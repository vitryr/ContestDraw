/**
 * Facebook Graph API Integration Service
 * Handles authentication, post fetching, comments, and reactions
 */

import axios, { AxiosInstance } from "axios";
import {
  PaginatedResponse,
  Comment,
  SocialAccount,
  APIError,
} from "../types/social.types";
import { RetryHandler } from "../utils/retry.util";
import { Cache } from "../utils/cache.util";

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url: string;
}

interface FacebookComment {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
  like_count?: number;
  comment_count?: number;
}

interface FacebookReaction {
  id: string;
  name: string;
  type: "LIKE" | "LOVE" | "WOW" | "HAHA" | "SAD" | "ANGRY" | "CARE";
}

export class FacebookService {
  private client: AxiosInstance;
  private readonly baseUrl = "https://graph.facebook.com";
  private readonly apiVersion = "v18.0";

  constructor() {
    this.client = axios.create({
      baseURL: `${this.baseUrl}/${this.apiVersion}`,
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error),
    );
  }

  /**
   * Connect Facebook account using OAuth authorization code
   * @param userId - User ID from database
   * @param authCode - OAuth authorization code
   * @returns Connected account information
   */
  async connectAccount(
    userId: string,
    authCode: string,
  ): Promise<SocialAccount> {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      throw new Error("Facebook OAuth credentials not configured");
    }

    return RetryHandler.withRetry(async () => {
      // Exchange code for access token
      const tokenResponse = await this.client.get("/oauth/access_token", {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code: authCode,
        },
      });

      const { access_token } = tokenResponse.data;

      // Exchange short-lived token for long-lived token
      const longLivedResponse = await this.client.get("/oauth/access_token", {
        params: {
          grant_type: "fb_exchange_token",
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: access_token,
        },
      });

      const longLivedToken = longLivedResponse.data.access_token;

      // Get user information
      const userResponse = await this.client.get("/me", {
        params: {
          fields: "id,name",
          access_token: longLivedToken,
        },
      });

      return {
        userId,
        platform: "facebook" as const,
        accountId: userResponse.data.id,
        username: userResponse.data.name,
        accessToken: longLivedToken,
        connectedAt: new Date(),
      };
    });
  }

  /**
   * Fetch comments from a Facebook post
   * @param postUrl - Facebook post URL or post ID
   * @param pageAccessToken - Page access token
   * @param maxComments - Maximum number of comments to fetch
   * @returns Paginated comments
   */
  async fetchComments(
    postUrl: string,
    pageAccessToken: string,
    maxComments?: number,
  ): Promise<PaginatedResponse<Comment>> {
    const postId = this.parsePostUrl(postUrl);
    const cacheKey = `facebook:comments:${postId}`;

    // Check cache first
    const cached = Cache.get<PaginatedResponse<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    return RetryHandler.withRetry(async () => {
      const allComments: Comment[] = [];
      let nextUrl: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxComments || allComments.length < maxComments)) {
        const url = nextUrl || `/${postId}/comments`;
        const params = nextUrl
          ? {}
          : {
              fields:
                "id,message,from,created_time,like_count,comment_count,comments{id,message,from,created_time,like_count}",
              access_token: pageAccessToken,
              limit: 100,
            };

        const response = await this.client.get(url, { params });

        const comments = response.data.data.map((comment: FacebookComment) => ({
          id: comment.id,
          text: comment.message,
          username: comment.from.name,
          userId: comment.from.id,
          timestamp: new Date(comment.created_time),
          likes: comment.like_count,
          replies: comment.comment_count ? [] : undefined, // Nested comments available
        }));

        allComments.push(...comments);

        // Check for pagination
        nextUrl = response.data.paging?.next;
        hasMore = !!nextUrl;

        // Respect max comments limit
        if (maxComments && allComments.length >= maxComments) {
          hasMore = false;
        }
      }

      const result: PaginatedResponse<Comment> = {
        data: maxComments ? allComments.slice(0, maxComments) : allComments,
        pagination: {
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
   * Fetch reactions from a Facebook post
   * @param postUrl - Facebook post URL or post ID
   * @param accessToken - Access token
   * @returns Reaction counts by type
   */
  async fetchReactions(
    postUrl: string,
    accessToken: string,
  ): Promise<Record<string, number>> {
    const postId = this.parsePostUrl(postUrl);
    const cacheKey = `facebook:reactions:${postId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          const response = await this.client.get(`/${postId}`, {
            params: {
              fields:
                "reactions.type(LIKE).limit(0).summary(true).as(like)," +
                "reactions.type(LOVE).limit(0).summary(true).as(love)," +
                "reactions.type(WOW).limit(0).summary(true).as(wow)," +
                "reactions.type(HAHA).limit(0).summary(true).as(haha)," +
                "reactions.type(SAD).limit(0).summary(true).as(sad)," +
                "reactions.type(ANGRY).limit(0).summary(true).as(angry)," +
                "reactions.type(CARE).limit(0).summary(true).as(care)",
              access_token: accessToken,
            },
          });

          return {
            like: response.data.like?.summary?.total_count || 0,
            love: response.data.love?.summary?.total_count || 0,
            wow: response.data.wow?.summary?.total_count || 0,
            haha: response.data.haha?.summary?.total_count || 0,
            sad: response.data.sad?.summary?.total_count || 0,
            angry: response.data.angry?.summary?.total_count || 0,
            care: response.data.care?.summary?.total_count || 0,
          };
        });
      },
      300,
    );
  }

  /**
   * Verify if a user has liked a Facebook page
   * @param userId - Facebook user ID
   * @param pageId - Facebook page ID
   * @param accessToken - User access token
   * @returns True if user likes the page
   */
  async verifyPageLike(
    userId: string,
    pageId: string,
    accessToken: string,
  ): Promise<boolean> {
    const cacheKey = `facebook:page-like:${userId}:${pageId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          try {
            const response = await this.client.get(
              `/${userId}/likes/${pageId}`,
              {
                params: {
                  access_token: accessToken,
                },
              },
            );

            return response.data.data && response.data.data.length > 0;
          } catch (error: any) {
            // If the endpoint returns 404, user doesn't like the page
            if (error.statusCode === 404) {
              return false;
            }
            throw error;
          }
        });
      },
      600,
    );
  }

  /**
   * Get page access token from user access token
   * Required for accessing page data and comments
   * @param pageId - Facebook page ID
   * @param userAccessToken - User access token
   * @returns Page access token
   */
  async getPageAccessToken(
    pageId: string,
    userAccessToken: string,
  ): Promise<string> {
    const cacheKey = `facebook:page-token:${pageId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          const response = await this.client.get(`/${pageId}`, {
            params: {
              fields: "access_token",
              access_token: userAccessToken,
            },
          });

          return response.data.access_token;
        });
      },
      3600,
    ); // Cache for 1 hour
  }

  /**
   * Parse Facebook post URL to extract post ID
   * @param url - Facebook post URL or post ID
   * @returns Post ID
   */
  parsePostUrl(url: string): string {
    // If already a post ID format (page_id_post_id)
    if (url.includes("_") && !url.includes("/")) {
      return url;
    }

    // Facebook URL formats:
    // https://www.facebook.com/PageName/posts/123456789
    // https://www.facebook.com/photo.php?fbid=123456789
    // https://www.facebook.com/PageName/photos/123456789
    // https://www.facebook.com/permalink.php?story_fbid=123456789&id=987654321

    let match = url.match(/posts\/(\d+)/);
    if (match) return match[1];

    match = url.match(/fbid=(\d+)/);
    if (match) return match[1];

    match = url.match(/photos\/(\d+)/);
    if (match) return match[1];

    match = url.match(/story_fbid=(\d+)/);
    if (match) return match[1];

    // If no pattern matches, assume it's already a post ID
    throw new Error("Invalid Facebook post URL or unable to parse post ID");
  }

  /**
   * Debug access token and get expiration info
   * @param accessToken - Access token to debug
   * @returns Token information
   */
  async debugToken(accessToken: string): Promise<{
    isValid: boolean;
    expiresAt?: Date;
    scopes: string[];
  }> {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    return RetryHandler.withRetry(async () => {
      const response = await this.client.get("/debug_token", {
        params: {
          input_token: accessToken,
          access_token: `${appId}|${appSecret}`,
        },
      });

      const data = response.data.data;

      return {
        isValid: data.is_valid,
        expiresAt: data.expires_at
          ? new Date(data.expires_at * 1000)
          : undefined,
        scopes: data.scopes || [],
      };
    });
  }

  /**
   * Handle API errors and convert to standard format
   */
  private handleError(error: any): never {
    const apiError: APIError = {
      code: error.response?.data?.error?.code || "UNKNOWN_ERROR",
      message: error.response?.data?.error?.message || error.message,
      statusCode: error.response?.status || 500,
      retryable:
        error.response?.status >= 500 || error.response?.status === 429,
    };

    // Parse rate limit info
    if (error.response?.status === 429) {
      const headers = error.response.headers;
      apiError.rateLimit = {
        limit: parseInt(headers["x-app-usage"] || "0"),
        remaining: 100 - parseInt(headers["x-app-usage"] || "0"),
        resetAt: new Date(Date.now() + 3600000), // Facebook resets hourly
      };
    }

    throw apiError;
  }
}
