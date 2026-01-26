/**
 * Follower Verification Controller
 * Handles HTTP requests for follower/like verification
 */

import { Request, Response, NextFunction } from "express";
import followerVerificationService from "../../services/follower-verification.service";
import logger from "../../utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Verify Instagram follower
 */
export async function verifyInstagramFollower(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { username, targetAccountId, accessToken } = req.body;

    if (!username || !targetAccountId || !accessToken) {
      res.status(400).json({
        error: "Username, targetAccountId, and accessToken are required",
      });
      return;
    }

    const isFollowing =
      await followerVerificationService.verifyInstagramFollower(
        username,
        targetAccountId,
        accessToken,
      );

    res.json({
      success: true,
      data: {
        username,
        targetAccountId,
        isFollowing,
        platform: "instagram",
      },
    });
  } catch (error) {
    logger.error("Instagram follower verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Verify Facebook page like
 */
export async function verifyFacebookPageLike(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { userId: fbUserId, pageId, accessToken } = req.body;

    if (!fbUserId || !pageId || !accessToken) {
      res.status(400).json({
        error: "userId, pageId, and accessToken are required",
      });
      return;
    }

    const isLiking = await followerVerificationService.verifyFacebookPageLike(
      fbUserId,
      pageId,
      accessToken,
    );

    res.json({
      success: true,
      data: {
        userId: fbUserId,
        pageId,
        isLiking,
        platform: "facebook",
      },
    });
  } catch (error) {
    logger.error("Facebook page like verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Batch verify followers
 */
export async function batchVerify(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { drawId, requests, accessTokens } = req.body;

    if (!drawId || !Array.isArray(requests) || requests.length === 0) {
      res.status(400).json({
        error: "drawId and requests array are required",
      });
      return;
    }

    if (!accessTokens || (!accessTokens.instagram && !accessTokens.facebook)) {
      res.status(400).json({
        error: "At least one access token (instagram or facebook) is required",
      });
      return;
    }

    const results = await followerVerificationService.batchVerify(
      drawId,
      requests,
      accessTokens,
    );

    const successCount = results.filter((r) => !r.error).length;
    const failedCount = results.filter((r) => r.error).length;
    const followingCount = results.filter((r) => r.isFollowing).length;

    res.json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        success: successCount,
        failed: failedCount,
        following: followingCount,
        notFollowing: successCount - followingCount,
      },
    });
  } catch (error) {
    logger.error("Batch verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Get verification results for a draw
 */
export async function getVerificationResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { drawId } = req.params;

    // Verify user owns the draw
    const draw = await prisma.draw.findFirst({
      where: {
        id: drawId,
        userId,
      },
    });

    if (!draw) {
      res.status(404).json({ error: "Draw not found" });
      return;
    }

    const results =
      await followerVerificationService.getVerificationResults(drawId);

    const followingCount = results.filter((r) => r.isFollowing).length;

    res.json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        following: followingCount,
        notFollowing: results.length - followingCount,
      },
    });
  } catch (error) {
    logger.error("Get verification results failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Get Instagram followers count
 */
export async function getInstagramFollowersCount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { accountId, accessToken } = req.query;

    if (!accountId || !accessToken) {
      res.status(400).json({
        error: "accountId and accessToken are required",
      });
      return;
    }

    const followersCount =
      await followerVerificationService.getInstagramFollowersCount(
        accountId as string,
        accessToken as string,
      );

    res.json({
      success: true,
      data: {
        accountId,
        followersCount,
        platform: "instagram",
      },
    });
  } catch (error) {
    logger.error("Get Instagram followers count failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}

/**
 * Get Facebook page likes count
 */
export async function getFacebookPageLikesCount(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { pageId, accessToken } = req.query;

    if (!pageId || !accessToken) {
      res.status(400).json({
        error: "pageId and accessToken are required",
      });
      return;
    }

    const likesCount =
      await followerVerificationService.getFacebookPageLikesCount(
        pageId as string,
        accessToken as string,
      );

    res.json({
      success: true,
      data: {
        pageId,
        likesCount,
        platform: "facebook",
      },
    });
  } catch (error) {
    logger.error("Get Facebook page likes count failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    next(error);
  }
}
