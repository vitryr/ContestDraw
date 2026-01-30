/**
 * Twitter API v2 Integration Service
 * Handles authentication, tweets, replies, retweets, and follows
 */

import axios from "axios"
type AxiosInstance = ReturnType<typeof axios.create>;
import {
  PaginatedResponse,
  Comment,
  SocialAccount,
  APIError,
} from "../types/social.types";
import { RetryHandler } from "../utils/retry.util";
import { Cache } from "../utils/cache.util";

interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

interface TwitterUser {
  id: string;
  username: string;
  name: string;
}

export class TwitterService {
  private client: AxiosInstance;
  private readonly baseUrl = "https://api.twitter.com/2";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error),
    );
  }

  /**
   * Connect Twitter account using OAuth 2.0 PKCE flow
   * @param userId - User ID from database
   * @param oauthTokens - OAuth tokens (access_token, refresh_token)
   * @returns Connected account information
   */
  async connectAccount(
    userId: string,
    oauthTokens: { accessToken: string; refreshToken?: string },
  ): Promise<SocialAccount> {
    return RetryHandler.withRetry(async () => {
      // Get authenticated user information
      const response = await this.client.get("/users/me", {
        headers: {
          Authorization: `Bearer ${oauthTokens.accessToken}`,
        },
      });

      return {
        userId,
        platform: "twitter" as const,
        accountId: response.data.data.id,
        username: response.data.data.username,
        accessToken: oauthTokens.accessToken,
        refreshToken: oauthTokens.refreshToken,
        connectedAt: new Date(),
      };
    });
  }

  /**
   * Fetch replies to a tweet
   * @param tweetId - Tweet ID
   * @param bearerToken - App bearer token or user access token
   * @param maxReplies - Maximum number of replies to fetch
   * @returns Paginated replies
   */
  async fetchReplies(
    tweetId: string,
    bearerToken: string,
    maxReplies?: number,
  ): Promise<PaginatedResponse<Comment>> {
    const cacheKey = `twitter:replies:${tweetId}`;

    // Check cache first
    const cached = Cache.get<PaginatedResponse<Comment>>(cacheKey);
    if (cached) {
      return cached;
    }

    return RetryHandler.withRetry(async () => {
      const allReplies: Comment[] = [];
      let nextToken: string | undefined;
      let hasMore = true;

      while (hasMore && (!maxReplies || allReplies.length < maxReplies)) {
        // Search for tweets that are replies to the target tweet
        const params: any = {
          query: `conversation_id:${tweetId}`,
          "tweet.fields": "author_id,created_at,public_metrics",
          "user.fields": "username",
          expansions: "author_id",
          max_results: 100,
        };

        if (nextToken) {
          params.next_token = nextToken;
        }

        const response = await this.client.get("/tweets/search/recent", {
          params,
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        // Map users for username lookup
        const users = new Map<string, TwitterUser>();
        if (response.data.includes?.users) {
          response.data.includes.users.forEach((user: TwitterUser) => {
            users.set(user.id, user);
          });
        }

        const replies = (response.data.data || []).map(
          (tweet: TwitterTweet) => {
            const user = users.get(tweet.author_id);
            return {
              id: tweet.id,
              text: tweet.text,
              username: user?.username || "unknown",
              userId: tweet.author_id,
              timestamp: new Date(tweet.created_at),
              likes: tweet.public_metrics.like_count,
            };
          },
        );

        allReplies.push(...replies);

        // Check for pagination
        nextToken = response.data.meta?.next_token;
        hasMore = !!nextToken;

        // Respect max replies limit
        if (maxReplies && allReplies.length >= maxReplies) {
          hasMore = false;
        }
      }

      const result: PaginatedResponse<Comment> = {
        data: maxReplies ? allReplies.slice(0, maxReplies) : allReplies,
        pagination: {
          nextCursor: nextToken,
          hasMore,
          total: allReplies.length,
        },
      };

      // Cache for 5 minutes
      Cache.set(cacheKey, result, 300);

      return result;
    });
  }

  /**
   * Fetch retweets of a tweet
   * @param tweetId - Tweet ID
   * @param bearerToken - App bearer token
   * @returns List of users who retweeted
   */
  async fetchRetweets(
    tweetId: string,
    bearerToken: string,
  ): Promise<PaginatedResponse<{ userId: string; username: string }>> {
    const cacheKey = `twitter:retweets:${tweetId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          const allRetweets: { userId: string; username: string }[] = [];
          let nextToken: string | undefined;
          let hasMore = true;

          while (hasMore) {
            const params: any = {
              "user.fields": "username",
              max_results: 100,
            };

            if (nextToken) {
              params.pagination_token = nextToken;
            }

            const response = await this.client.get(
              `/tweets/${tweetId}/retweeted_by`,
              {
                params,
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                },
              },
            );

            const retweets = (response.data.data || []).map(
              (user: TwitterUser) => ({
                userId: user.id,
                username: user.username,
              }),
            );

            allRetweets.push(...retweets);

            // Check for pagination
            nextToken = response.data.meta?.next_token;
            hasMore = !!nextToken;
          }

          return {
            data: allRetweets,
            pagination: {
              hasMore: false,
              total: allRetweets.length,
            },
          };
        });
      },
      300,
    );
  }

  /**
   * Verify if a user is following a target account
   * @param username - Username to check
   * @param targetUsername - Target account username
   * @param bearerToken - App bearer token
   * @returns True if following
   */
  async verifyFollowing(
    username: string,
    targetUsername: string,
    bearerToken: string,
  ): Promise<boolean> {
    const cacheKey = `twitter:following:${username}:${targetUsername}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          // First, get user IDs from usernames
          const [sourceUser, targetUser] = await Promise.all([
            this.getUserByUsername(username, bearerToken),
            this.getUserByUsername(targetUsername, bearerToken),
          ]);

          // Check if source user follows target user
          const response = await this.client.get(
            `/users/${sourceUser.id}/following`,
            {
              params: {
                max_results: 1000, // Maximum allowed
              },
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
          );

          const following = response.data.data || [];
          return following.some(
            (user: TwitterUser) => user.id === targetUser.id,
          );
        });
      },
      600,
    );
  }

  /**
   * Get user information by username
   * @param username - Twitter username (without @)
   * @param bearerToken - App bearer token
   * @returns User information
   */
  async getUserByUsername(
    username: string,
    bearerToken: string,
  ): Promise<TwitterUser> {
    const cacheKey = `twitter:user:${username}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          const response = await this.client.get(
            `/users/by/username/${username}`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
              },
            },
          );

          return response.data.data;
        });
      },
      3600,
    );
  }

  /**
   * Get tweet information by ID
   * @param tweetId - Tweet ID
   * @param bearerToken - App bearer token
   * @returns Tweet information
   */
  async getTweet(tweetId: string, bearerToken: string): Promise<TwitterTweet> {
    const cacheKey = `twitter:tweet:${tweetId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          const response = await this.client.get(`/tweets/${tweetId}`, {
            params: {
              "tweet.fields": "author_id,created_at,public_metrics",
            },
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          });

          return response.data.data;
        });
      },
      300,
    );
  }

  /**
   * Parse Twitter URL to extract tweet ID
   * @param url - Twitter URL
   * @returns Tweet ID
   */
  parseTweetUrl(url: string): string {
    // Twitter URL formats:
    // https://twitter.com/username/status/1234567890
    // https://x.com/username/status/1234567890
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);

    if (!match) {
      throw new Error("Invalid Twitter URL");
    }

    return match[1];
  }

  /**
   * Refresh OAuth 2.0 access token
   * @param refreshToken - Refresh token
   * @returns New access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Twitter OAuth credentials not configured");
    }

    return RetryHandler.withRetry(async () => {
      const response = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };
    });
  }

  /**
   * Handle API errors and convert to standard format
   */
  private handleError(error: any): never {
    const apiError: APIError = {
      code: error.response?.data?.errors?.[0]?.code || "UNKNOWN_ERROR",
      message: error.response?.data?.errors?.[0]?.message || error.message,
      statusCode: error.response?.status || 500,
      retryable:
        error.response?.status >= 500 || error.response?.status === 429,
    };

    // Parse rate limit info
    if (error.response?.status === 429) {
      const headers = error.response.headers;
      apiError.rateLimit = {
        limit: parseInt(headers["x-rate-limit-limit"] || "0"),
        remaining: parseInt(headers["x-rate-limit-remaining"] || "0"),
        resetAt: new Date(
          parseInt(headers["x-rate-limit-reset"] || "0") * 1000,
        ),
      };
    }

    throw apiError;
  }
}
