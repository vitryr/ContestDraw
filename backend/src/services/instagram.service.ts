/**
 * Instagram API Integration Service
 * Handles authentication, post fetching, comments, likes, and story mentions
 */

import axios, { AxiosInstance } from 'axios';
import { PaginatedResponse, Comment, SocialAccount, APIError } from '../types/social.types';
import { RetryHandler } from '../utils/retry.util';
import { Cache } from '../utils/cache.util';

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramComment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
  like_count?: number;
  replies?: {
    data: InstagramComment[];
  };
}

interface InstagramStoryMention {
  id: string;
  media_type: 'STORY';
  timestamp: string;
  username: string;
}

export class InstagramService {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://graph.instagram.com';
  private readonly apiVersion = 'v18.0';

  constructor() {
    this.client = axios.create({
      baseURL: `${this.baseUrl}/${this.apiVersion}`,
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Connect Instagram account using OAuth authorization code
   * @param userId - User ID from database
   * @param authCode - OAuth authorization code
   * @returns Connected account information
   */
  async connectAccount(userId: string, authCode: string): Promise<SocialAccount> {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Instagram OAuth credentials not configured');
    }

    return RetryHandler.withRetry(async () => {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: authCode,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const { access_token: shortLivedToken, user_id } = tokenResponse.data;

      // Exchange short-lived token for long-lived token
      const longLivedResponse = await this.client.get('/access_token', {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: clientSecret,
          access_token: shortLivedToken,
        },
      });

      const { access_token, expires_in } = longLivedResponse.data;

      // Get user information
      const userResponse = await this.client.get(`/${user_id}`, {
        params: {
          fields: 'id,username',
          access_token: access_token,
        },
      });

      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

      return {
        userId,
        platform: 'instagram' as const,
        accountId: user_id,
        username: userResponse.data.username,
        accessToken: access_token,
        expiresAt,
        connectedAt: new Date(),
      };
    });
  }

  /**
   * Fetch comments from an Instagram post
   * @param postUrl - Instagram post URL
   * @param accessToken - User access token
   * @param maxComments - Maximum number of comments to fetch (default: unlimited)
   * @returns Paginated comments
   */
  async fetchComments(
    postUrl: string,
    accessToken: string,
    maxComments?: number
  ): Promise<PaginatedResponse<Comment>> {
    const mediaId = this.parsePostUrl(postUrl);
    const cacheKey = `instagram:comments:${mediaId}`;

    // Check cache first
    const cached = Cache.get<PaginatedResponse<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    return RetryHandler.withRetry(async () => {
      const allComments: Comment[] = [];
      let nextCursor: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxComments || allComments.length < maxComments)) {
        const params: any = {
          fields: 'id,text,username,timestamp,like_count,replies{id,text,username,timestamp,like_count}',
          access_token: accessToken,
        };

        if (nextCursor) {
          params.after = nextCursor;
        }

        const response = await this.client.get(`/${mediaId}/comments`, {
          params,
        });

        const comments = response.data.data.map((comment: InstagramComment) => ({
          id: comment.id,
          text: comment.text,
          username: comment.username,
          userId: comment.username, // Instagram API doesn't provide user ID in comments
          timestamp: new Date(comment.timestamp),
          likes: comment.like_count,
          replies: comment.replies?.data.map((reply) => ({
            id: reply.id,
            text: reply.text,
            username: reply.username,
            userId: reply.username,
            timestamp: new Date(reply.timestamp),
            likes: reply.like_count,
          })),
        }));

        allComments.push(...comments);

        // Check for pagination
        nextCursor = response.data.paging?.cursors?.after;
        hasMore = !!response.data.paging?.next && !!nextCursor;

        // Respect max comments limit
        if (maxComments && allComments.length >= maxComments) {
          hasMore = false;
        }
      }

      const result: PaginatedResponse<Comment> = {
        data: maxComments ? allComments.slice(0, maxComments) : allComments,
        pagination: {
          nextCursor,
          hasMore,
          total: allComments.length,
        },
      };

      // Cache for 5 minutes
      Cache.set(cacheKey, result, 300);

      return result;
    });
  }

  /**
   * Fetch likes count from an Instagram post
   * @param postUrl - Instagram post URL
   * @param accessToken - User access token
   * @returns Number of likes
   */
  async fetchLikes(postUrl: string, accessToken: string): Promise<number> {
    const mediaId = this.parsePostUrl(postUrl);
    const cacheKey = `instagram:likes:${mediaId}`;

    return Cache.getOrSet(cacheKey, async () => {
      return RetryHandler.withRetry(async () => {
        const response = await this.client.get(`/${mediaId}`, {
          params: {
            fields: 'like_count',
            access_token: accessToken,
          },
        });

        return response.data.like_count || 0;
      });
    }, 300);
  }

  /**
   * Verify if a user is following a target account
   * Uses Instagram Graph API to check followers list
   * Requires Business/Creator account with instagram_business_manage_messages permission
   * 
   * @param username - Username to check
   * @param targetAccountId - Target Instagram Business Account ID (not username)
   * @param accessToken - User access token with appropriate permissions
   * @returns True if following, false otherwise
   */
  async verifyFollowing(
    username: string,
    targetAccountId: string,
    accessToken: string
  ): Promise<boolean> {
    const cacheKey = `instagram:following:${username}:${targetAccountId}`;

    return Cache.getOrSet(cacheKey, async () => {
      return RetryHandler.withRetry(async () => {
        try {
          // Use Instagram Graph API to check followers
          // This requires the target account to be a Business/Creator account
          let nextCursor: string | undefined;
          let hasMore = true;

          while (hasMore) {
            const params: any = {
              fields: 'username',
              access_token: accessToken,
              limit: 100,
            };

            if (nextCursor) {
              params.after = nextCursor;
            }

            const response = await this.client.get(`/${targetAccountId}/followers`, { params });

            // Check if username exists in current page
            const follower = response.data.data?.find(
              (f: { username: string }) => f.username.toLowerCase() === username.toLowerCase()
            );

            if (follower) {
              return true;
            }

            // Check for pagination
            nextCursor = response.data.paging?.cursors?.after;
            hasMore = !!response.data.paging?.next && !!nextCursor;
          }

          return false;
        } catch (error: any) {
          // Handle permission errors gracefully
          if (error.response?.status === 403 || error.response?.data?.error?.code === 190) {
            console.warn(
              'Instagram follower verification requires Business account with proper permissions. ' +
              'Falling back to unverified mode.'
            );
            // Return undefined to indicate verification not possible
            // Caller should handle this case appropriately
            throw new Error('FOLLOWER_VERIFICATION_NOT_AVAILABLE');
          }
          throw error;
        }
      });
    }, 600);
  }

  /**
   * Fetch story mentions for a business account
   * @param accountId - Instagram business account ID
   * @param accessToken - Access token with story mention permissions
   * @returns Story mentions
   */
  async fetchStoryMentions(
    accountId: string,
    accessToken: string
  ): Promise<PaginatedResponse<InstagramStoryMention>> {
    const cacheKey = `instagram:story-mentions:${accountId}`;

    return Cache.getOrSet(cacheKey, async () => {
      return RetryHandler.withRetry(async () => {
        const response = await this.client.get(`/${accountId}/stories`, {
          params: {
            fields: 'id,media_type,timestamp,username',
            access_token: accessToken,
          },
        });

        const mentions: InstagramStoryMention[] = response.data.data || [];

        return {
          data: mentions,
          pagination: {
            hasMore: false,
            total: mentions.length,
          },
        };
      });
    }, 300);
  }

  /**
   * Parse Instagram post URL to extract media ID
   * @param url - Instagram post URL
   * @returns Media ID
   */
  parsePostUrl(url: string): string {
    // Instagram URL formats:
    // https://www.instagram.com/p/CODE/
    // https://instagram.com/p/CODE/
    // https://www.instagram.com/reel/CODE/
    const match = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);

    if (!match) {
      throw new Error('Invalid Instagram post URL');
    }

    return match[2];
  }

  /**
   * Refresh long-lived access token
   * @param accessToken - Current access token
   * @returns New access token and expiry
   */
  async refreshAccessToken(accessToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    return RetryHandler.withRetry(async () => {
      const response = await this.client.get('/refresh_access_token', {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: accessToken,
        },
      });

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      };
    });
  }

  /**
   * Handle API errors and convert to standard format
   */
  private handleError(error: any): never {
    const apiError: APIError = {
      code: error.response?.data?.error?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.error?.message || error.message,
      statusCode: error.response?.status || 500,
      retryable: error.response?.status >= 500 || error.response?.status === 429,
    };

    // Parse rate limit info
    if (error.response?.status === 429) {
      const headers = error.response.headers;
      apiError.rateLimit = {
        limit: parseInt(headers['x-ratelimit-limit'] || '0'),
        remaining: parseInt(headers['x-ratelimit-remaining'] || '0'),
        resetAt: new Date(
          parseInt(headers['x-ratelimit-reset'] || '0') * 1000
        ),
      };
    }

    throw apiError;
  }
}
