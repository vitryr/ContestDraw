/**
 * Pre-Scan Service
 * Validates draw eligibility before consuming credits
 * Ensures complete coverage of comments
 */

import { SupportedPlatform, PreScanResult } from '../types/filter-capabilities.types';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';

/**
 * User draw limits based on subscription tier
 */
const TIER_LIMITS: Record<string, { maxComments: number; name: string }> = {
  free: { maxComments: 200, name: 'Free Trial' },
  basic: { maxComments: 1000, name: 'Basic' },
  premium: { maxComments: 5000, name: 'Premium' },
  enterprise: { maxComments: 50000, name: 'Enterprise' },
  unlimited: { maxComments: Infinity, name: 'Unlimited (48h Pass)' },
};

/**
 * Suggested upgrade paths
 */
const UPGRADE_SUGGESTIONS: Record<string, string> = {
  free: 'basic',
  basic: 'premium',
  premium: 'enterprise',
  enterprise: 'enterprise', // Already at top
};

interface UserDrawEligibility {
  canDraw: boolean;
  userTier: string;
  maxComments: number;
  hasActivePass: boolean;
  creditsRemaining: number;
  trialUsed: boolean;
}

class PreScanService {
  /**
   * Get user's draw eligibility
   */
  async getUserEligibility(userId: string): Promise<UserDrawEligibility> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          select: {
            planId: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check for active 48h pass
    const hasActivePass = await this.checkActivePass(userId);
    
    // Determine user tier
    let userTier = 'free';
    if (hasActivePass) {
      userTier = 'unlimited';
    } else if (user.subscription?.status === 'ACTIVE') {
      userTier = user.subscription.planId || 'basic';
    } else if (user.credits > 0) {
      userTier = 'basic'; // Credit-based users get basic tier limits
    } else if (!user.trial_used) {
      userTier = 'free';
    }

    const tierLimit = TIER_LIMITS[userTier] || TIER_LIMITS.free;

    return {
      canDraw: hasActivePass || user.credits > 0 || !user.trial_used,
      userTier,
      maxComments: tierLimit.maxComments,
      hasActivePass,
      creditsRemaining: user.credits,
      trialUsed: user.trial_used,
    };
  }

  /**
   * Check if user has active 48h pass
   */
  async checkActivePass(userId: string): Promise<boolean> {
    const activePass = await prisma.userPass.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });
    return !!activePass;
  }

  /**
   * Pre-scan a post to validate draw eligibility
   */
  async preScan(
    userId: string,
    platform: SupportedPlatform,
    postUrl: string,
    postId?: string
  ): Promise<PreScanResult> {
    logger.info('Starting pre-scan', { userId, platform, postUrl });

    // Get user eligibility
    const eligibility = await this.getUserEligibility(userId);

    if (!eligibility.canDraw) {
      return {
        totalComments: 0,
        isEstimate: false,
        hasMore: false,
        withinLimit: false,
        userLimit: 0,
        upgradeRequired: true,
        suggestedPlan: 'basic',
      };
    }

    // Get comment count from platform
    const commentCount = await this.getCommentCount(platform, postUrl, postId);

    const withinLimit = commentCount.total <= eligibility.maxComments;

    const result: PreScanResult = {
      totalComments: commentCount.total,
      estimatedComments: commentCount.isEstimate ? commentCount.total : undefined,
      isEstimate: commentCount.isEstimate,
      hasMore: commentCount.hasMore,
      withinLimit,
      userLimit: eligibility.maxComments,
      upgradeRequired: !withinLimit,
      suggestedPlan: !withinLimit ? UPGRADE_SUGGESTIONS[eligibility.userTier] : undefined,
    };

    logger.info('Pre-scan complete', { 
      userId, 
      platform, 
      result: {
        totalComments: result.totalComments,
        withinLimit: result.withinLimit,
        userLimit: result.userLimit,
      }
    });

    return result;
  }

  /**
   * Get comment count from platform (lightweight API call)
   */
  private async getCommentCount(
    platform: SupportedPlatform,
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    try {
      switch (platform) {
        case 'instagram':
          return await this.getInstagramCommentCount(postUrl, postId);
        case 'tiktok':
          return await this.getTikTokCommentCount(postUrl, postId);
        case 'youtube':
          return await this.getYouTubeCommentCount(postUrl, postId);
        case 'twitter':
          return await this.getTwitterCommentCount(postUrl, postId);
        case 'facebook':
          return await this.getFacebookCommentCount(postUrl, postId);
        default:
          // For unknown platforms, return a safe estimate
          return { total: 0, isEstimate: true, hasMore: false };
      }
    } catch (error) {
      logger.error('Error getting comment count', { platform, postUrl, error });
      throw new Error(`Unable to scan post: ${error.message}`);
    }
  }

  /**
   * Instagram comment count (via Graph API or scraping metadata)
   */
  private async getInstagramCommentCount(
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    // TODO: Implement with Instagram Graph API
    // For now, return placeholder
    // In production, this would use the Instagram service
    
    // The implementation would:
    // 1. Use the media endpoint to get comment_count
    // 2. Or scrape the public page for comment count meta
    
    logger.debug('Getting Instagram comment count', { postUrl, postId });
    
    return {
      total: 0,
      isEstimate: true,
      hasMore: false,
    };
  }

  /**
   * TikTok comment count
   */
  private async getTikTokCommentCount(
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    // TODO: Implement with TikTok API
    logger.debug('Getting TikTok comment count', { postUrl, postId });
    
    return {
      total: 0,
      isEstimate: true,
      hasMore: false,
    };
  }

  /**
   * YouTube comment count
   */
  private async getYouTubeCommentCount(
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    // TODO: Implement with YouTube Data API v3
    // Use videos.list with part=statistics to get commentCount
    logger.debug('Getting YouTube comment count', { postUrl, postId });
    
    return {
      total: 0,
      isEstimate: true,
      hasMore: false,
    };
  }

  /**
   * Twitter/X comment count
   */
  private async getTwitterCommentCount(
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    // TODO: Implement with Twitter API v2
    // Use tweets endpoint with tweet.fields=public_metrics
    logger.debug('Getting Twitter comment count', { postUrl, postId });
    
    return {
      total: 0,
      isEstimate: true,
      hasMore: false,
    };
  }

  /**
   * Facebook comment count
   */
  private async getFacebookCommentCount(
    postUrl: string,
    postId?: string
  ): Promise<{ total: number; isEstimate: boolean; hasMore: boolean }> {
    // TODO: Implement with Facebook Graph API
    logger.debug('Getting Facebook comment count', { postUrl, postId });
    
    return {
      total: 0,
      isEstimate: true,
      hasMore: false,
    };
  }

  /**
   * Validate that a draw can proceed
   * Returns errors if draw should be blocked
   */
  async validateDrawEligibility(
    userId: string,
    preScanResult: PreScanResult
  ): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if within limit
    if (!preScanResult.withinLimit) {
      errors.push(
        `This post has ${preScanResult.totalComments.toLocaleString()} comments, ` +
        `but your plan allows up to ${preScanResult.userLimit.toLocaleString()}. ` +
        `Please upgrade to ${preScanResult.suggestedPlan} to process this draw.`
      );
    }

    // Check if estimate and warn
    if (preScanResult.isEstimate) {
      warnings.push(
        'Comment count is estimated. Actual count may vary slightly.'
      );
    }

    // Check if has more (pagination required)
    if (preScanResult.hasMore && preScanResult.totalComments > 10000) {
      warnings.push(
        'This post has many comments. Processing may take several minutes.'
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Lock a draw to prevent concurrent execution
   */
  async lockDraw(drawId: string, userId: string): Promise<boolean> {
    try {
      // Use database transaction to ensure atomic lock
      const result = await prisma.draw.updateMany({
        where: {
          id: drawId,
          userId,
          status: { in: ['DRAFT', 'READY'] },
          lockedAt: null,
        },
        data: {
          lockedAt: new Date(),
          status: 'PROCESSING',
        },
      });

      return result.count > 0;
    } catch (error) {
      logger.error('Error locking draw', { drawId, userId, error });
      return false;
    }
  }

  /**
   * Unlock a draw (on error or completion)
   */
  async unlockDraw(drawId: string, status: 'READY' | 'COMPLETED' | 'FAILED'): Promise<void> {
    await prisma.draw.update({
      where: { id: drawId },
      data: {
        lockedAt: null,
        status,
      },
    });
  }

  /**
   * Consume a draw credit
   */
  async consumeCredit(userId: string, drawId: string): Promise<boolean> {
    const eligibility = await this.getUserEligibility(userId);

    // If user has active pass, don't consume credits
    if (eligibility.hasActivePass) {
      logger.info('Using active pass, no credit consumed', { userId, drawId });
      return true;
    }

    // If free trial
    if (!eligibility.trialUsed && eligibility.creditsRemaining === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { trial_used: true },
      });
      logger.info('Free trial consumed', { userId, drawId });
      return true;
    }

    // Consume credit
    if (eligibility.creditsRemaining > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
      logger.info('Credit consumed', { userId, drawId, remaining: eligibility.creditsRemaining - 1 });
      return true;
    }

    return false;
  }

  /**
   * Refund a draw credit (on error)
   */
  async refundCredit(userId: string, drawId: string, reason: string): Promise<void> {
    // Note: We can't refund trial, but we can refund credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: 1 } },
    });

    // Log the refund
    await prisma.creditTransaction.create({
      data: {
        userId,
        credits: 1,
        type: 'REFUND',
        description: `Refund for failed draw ${drawId}: ${reason}`,
      },
    });

    logger.info('Credit refunded', { userId, drawId, reason });
  }
}

export const preScanService = new PreScanService();
export default preScanService;
