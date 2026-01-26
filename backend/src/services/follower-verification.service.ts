/**
 * Follower Verification Service
 * Implements Instagram followers check and Facebook Page likes verification
 * Provides batch verification endpoint for efficient processing
 */

import { PrismaClient } from "@prisma/client";
import axios, { AxiosInstance } from "axios";
import { RetryHandler } from "../utils/retry.util";
import { Cache } from "../utils/cache.util";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

interface VerificationRequest {
  username: string;
  platform: "instagram" | "facebook";
  targetAccount: string;
}

interface VerificationResult {
  username: string;
  platform: string;
  targetAccount: string;
  isFollowing: boolean;
  verifiedAt: Date;
  error?: string;
}

interface InstagramFollowersResponse {
  data: Array<{
    id: string;
    username: string;
  }>;
  paging?: {
    cursors?: {
      after?: string;
      before?: string;
    };
    next?: string;
  };
}

interface FacebookPageLikesResponse {
  data: Array<{
    id: string;
    name: string;
  }>;
  paging?: {
    cursors?: {
      after?: string;
      before?: string;
    };
    next?: string;
  };
}

export class FollowerVerificationService {
  private instagramClient: AxiosInstance;
  private facebookClient: AxiosInstance;

  constructor() {
    this.instagramClient = axios.create({
      baseURL: "https://graph.instagram.com/v18.0",
      timeout: 30000,
    });

    this.facebookClient = axios.create({
      baseURL: "https://graph.facebook.com/v18.0",
      timeout: 30000,
    });
  }

  /**
   * Verify if a user follows an Instagram account
   */
  async verifyInstagramFollower(
    username: string,
    targetAccountId: string,
    accessToken: string,
  ): Promise<boolean> {
    const cacheKey = `instagram:follower:${username}:${targetAccountId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        return RetryHandler.withRetry(async () => {
          try {
            // Search for username in followers of target account
            const isFollowing = await this.checkInstagramFollower(
              targetAccountId,
              username,
              accessToken,
            );

            logger.info("Instagram follower verification completed", {
              username,
              targetAccountId,
              isFollowing,
            });

            return isFollowing;
          } catch (error) {
            logger.error("Instagram follower verification failed", {
              username,
              targetAccountId,
              error: error instanceof Error ? error.message : String(error),
            });
            throw error;
          }
        });
      },
      600, // Cache for 10 minutes
    );
  }

  /**
   * Check if username exists in Instagram followers list
   */
  private async checkInstagramFollower(
    accountId: string,
    username: string,
    accessToken: string,
  ): Promise<boolean> {
    let nextCursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const params: any = {
        fields: "id,username",
        access_token: accessToken,
        limit: 100,
      };

      if (nextCursor) {
        params.after = nextCursor;
      }

      const response =
        await this.instagramClient.get<InstagramFollowersResponse>(
          `/${accountId}/followers`,
          { params },
        );

      // Check if username exists in current page
      const follower = response.data.data.find(
        (f) => f.username.toLowerCase() === username.toLowerCase(),
      );

      if (follower) {
        return true;
      }

      // Check for pagination
      nextCursor = response.data.paging?.cursors?.after;
      hasMore = !!response.data.paging?.next && !!nextCursor;
    }

    return false;
  }

  /**
   * Verify if a user likes a Facebook Page
   */
  async verifyFacebookPageLike(
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
            // Check if user likes the page
            const response = await this.facebookClient.get<{ data: boolean }>(
              `/${userId}/likes/${pageId}`,
              {
                params: {
                  access_token: accessToken,
                },
              },
            );

            const isLiking = response.data.data === true;

            logger.info("Facebook page like verification completed", {
              userId,
              pageId,
              isLiking,
            });

            return isLiking;
          } catch (error) {
            // If 404, user doesn't like the page
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              return false;
            }

            logger.error("Facebook page like verification failed", {
              userId,
              pageId,
              error: error instanceof Error ? error.message : String(error),
            });
            throw error;
          }
        });
      },
      600, // Cache for 10 minutes
    );
  }

  /**
   * Batch verify multiple users
   */
  async batchVerify(
    drawId: string,
    requests: VerificationRequest[],
    accessTokens: { instagram?: string; facebook?: string },
  ): Promise<VerificationResult[]> {
    logger.info("Starting batch verification", {
      drawId,
      requestCount: requests.length,
    });

    const results: VerificationResult[] = [];
    const BATCH_SIZE = 10;

    // Process in batches to avoid overwhelming the API
    for (let i = 0; i < requests.length; i += BATCH_SIZE) {
      const batch = requests.slice(i, i + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async (request) => {
          try {
            let isFollowing = false;

            if (request.platform === "instagram" && accessTokens.instagram) {
              isFollowing = await this.verifyInstagramFollower(
                request.username,
                request.targetAccount,
                accessTokens.instagram,
              );
            } else if (
              request.platform === "facebook" &&
              accessTokens.facebook
            ) {
              isFollowing = await this.verifyFacebookPageLike(
                request.username,
                request.targetAccount,
                accessTokens.facebook,
              );
            }

            const result: VerificationResult = {
              username: request.username,
              platform: request.platform,
              targetAccount: request.targetAccount,
              isFollowing,
              verifiedAt: new Date(),
            };

            // Store verification result in database
            await this.storeVerificationResult(drawId, result);

            return result;
          } catch (error) {
            logger.error("Verification failed for user", {
              username: request.username,
              platform: request.platform,
              error: error instanceof Error ? error.message : String(error),
            });

            return {
              username: request.username,
              platform: request.platform,
              targetAccount: request.targetAccount,
              isFollowing: false,
              verifiedAt: new Date(),
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        }),
      );

      results.push(...batchResults);

      // Small delay between batches to respect rate limits
      if (i + BATCH_SIZE < requests.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    logger.info("Batch verification completed", {
      drawId,
      totalRequests: requests.length,
      successCount: results.filter((r) => !r.error).length,
      failedCount: results.filter((r) => r.error).length,
    });

    return results;
  }

  /**
   * Store verification result in database
   */
  private async storeVerificationResult(
    drawId: string,
    result: VerificationResult,
  ): Promise<void> {
    try {
      await prisma.followerVerification.create({
        data: {
          drawId,
          username: result.username,
          platform: result.platform,
          targetAccount: result.targetAccount,
          isFollowing: result.isFollowing,
          verifiedAt: result.verifiedAt,
          metadata: result.error ? { error: result.error } : null,
        },
      });
    } catch (error) {
      logger.error("Failed to store verification result", {
        drawId,
        username: result.username,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Get verification results for a draw
   */
  async getVerificationResults(drawId: string): Promise<VerificationResult[]> {
    const verifications = await prisma.followerVerification.findMany({
      where: { drawId },
      orderBy: { verifiedAt: "desc" },
    });

    return verifications.map((v) => ({
      username: v.username,
      platform: v.platform,
      targetAccount: v.targetAccount,
      isFollowing: v.isFollowing,
      verifiedAt: v.verifiedAt,
      error:
        v.metadata && typeof v.metadata === "object" && "error" in v.metadata
          ? String((v.metadata as any).error)
          : undefined,
    }));
  }

  /**
   * Filter participants by follower verification status
   */
  async filterVerifiedFollowers(
    drawId: string,
    participants: Array<{ username: string }>,
  ): Promise<Array<{ username: string; isFollowing: boolean }>> {
    const verifications = await prisma.followerVerification.findMany({
      where: {
        drawId,
        username: {
          in: participants.map((p) => p.username),
        },
      },
    });

    const verificationMap = new Map(
      verifications.map((v) => [v.username.toLowerCase(), v.isFollowing]),
    );

    return participants.map((p) => ({
      username: p.username,
      isFollowing: verificationMap.get(p.username.toLowerCase()) || false,
    }));
  }

  /**
   * Get followers count for Instagram account
   */
  async getInstagramFollowersCount(
    accountId: string,
    accessToken: string,
  ): Promise<number> {
    const cacheKey = `instagram:followers-count:${accountId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        try {
          const response = await this.instagramClient.get(`/${accountId}`, {
            params: {
              fields: "followers_count",
              access_token: accessToken,
            },
          });

          return response.data.followers_count || 0;
        } catch (error) {
          logger.error("Failed to get Instagram followers count", {
            accountId,
            error: error instanceof Error ? error.message : String(error),
          });
          return 0;
        }
      },
      3600, // Cache for 1 hour
    );
  }

  /**
   * Get Facebook Page likes count
   */
  async getFacebookPageLikesCount(
    pageId: string,
    accessToken: string,
  ): Promise<number> {
    const cacheKey = `facebook:page-likes:${pageId}`;

    return Cache.getOrSet(
      cacheKey,
      async () => {
        try {
          const response = await this.facebookClient.get(`/${pageId}`, {
            params: {
              fields: "fan_count",
              access_token: accessToken,
            },
          });

          return response.data.fan_count || 0;
        } catch (error) {
          logger.error("Failed to get Facebook page likes count", {
            pageId,
            error: error instanceof Error ? error.message : String(error),
          });
          return 0;
        }
      },
      3600, // Cache for 1 hour
    );
  }
}

export default new FollowerVerificationService();
