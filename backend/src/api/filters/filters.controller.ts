/**
 * Filters Controller
 * Handles filter-related API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { capabilitiesService } from '../../services/capabilities.service';
import { advancedFilterService } from '../../services/advanced-filter.service';
import { preScanService } from '../../services/prescan.service';
import { logger } from '../../utils/logger';
import { prisma } from '../../utils/prisma';
import { AdvancedDrawFilters, DEFAULT_FILTERS } from '../../types/advanced-filters.types';
import { FilterTier } from '../../types/filter-capabilities.types';

/**
 * Get capabilities for a source (URL or CSV)
 * POST /api/filters/capabilities
 */
export const getCapabilities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, csvColumns } = req.body;
    const userId = req.user!.id;

    // Get user tier
    const userTier = await getUserTier(userId);

    let capabilities;
    let platformDetection;

    if (url) {
      // Detect from URL
      platformDetection = capabilitiesService.detectPlatform(url);
      capabilities = capabilitiesService.getCapabilities(platformDetection.platform, 'url');
    } else if (csvColumns && Array.isArray(csvColumns)) {
      // Detect from CSV columns
      capabilities = capabilitiesService.getCapabilitiesFromCSV(csvColumns);
      platformDetection = { platform: 'csv', confidence: 'high' };
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either url or csvColumns is required',
      });
    }

    // Get available filters based on capabilities and tier
    const availableFilters = capabilitiesService.getAvailableFilters(capabilities, userTier);

    res.json({
      success: true,
      data: {
        platform: platformDetection,
        capabilities,
        userTier,
        availableFilters,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Pre-scan a post before draw
 * POST /api/filters/prescan
 */
export const preScan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, drawId } = req.body;
    const userId = req.user!.id;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
      });
    }

    // Detect platform
    const platformDetection = capabilitiesService.detectPlatform(url);

    if (platformDetection.platform === 'unknown') {
      return res.status(400).json({
        success: false,
        error: 'Unsupported platform. Please use Instagram, TikTok, YouTube, Twitter, or Facebook.',
      });
    }

    // Run pre-scan
    const preScanResult = await preScanService.preScan(
      userId,
      platformDetection.platform,
      url,
      platformDetection.postId
    );

    // Validate eligibility
    const validation = await preScanService.validateDrawEligibility(userId, preScanResult);

    // If drawId provided, update the draw with pre-scan result
    if (drawId) {
      await prisma.draw.update({
        where: { id: drawId, userId },
        data: {
          preScanResult: preScanResult as any,
          platform: platformDetection.platform,
          postId: platformDetection.postId,
        },
      });
    }

    res.json({
      success: true,
      data: {
        preScan: preScanResult,
        validation,
        platform: platformDetection,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save advanced filters for a draw
 * PUT /api/filters/:drawId
 */
export const saveFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { drawId } = req.params;
    const userId = req.user!.id;
    const filters: Partial<AdvancedDrawFilters> = req.body.filters;

    // Verify draw ownership
    const draw = await prisma.draw.findFirst({
      where: { id: drawId, userId },
    });

    if (!draw) {
      return res.status(404).json({
        success: false,
        error: 'Draw not found',
      });
    }

    // Get capabilities to validate filters
    const capabilities = draw.platform
      ? capabilitiesService.getCapabilities(draw.platform as any, 'url')
      : capabilitiesService.getCapabilities('unknown', 'url');

    const userTier = await getUserTier(userId);

    // Validate that user has access to all selected filters
    const availableFilters = capabilitiesService.getAvailableFilters(capabilities, userTier);
    const unavailableFilters = validateFiltersAccess(filters, availableFilters);

    if (unavailableFilters.length > 0) {
      return res.status(403).json({
        success: false,
        error: 'Some filters require upgrade',
        unavailableFilters,
      });
    }

    // Save filters
    await prisma.draw.update({
      where: { id: drawId },
      data: {
        advancedFilters: filters as any,
        status: 'READY',
      },
    });

    res.json({
      success: true,
      data: {
        drawId,
        filters,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get filters for a draw
 * GET /api/filters/:drawId
 */
export const getFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { drawId } = req.params;
    const userId = req.user!.id;

    const draw = await prisma.draw.findFirst({
      where: { id: drawId, userId },
      select: {
        id: true,
        advancedFilters: true,
        filters: true,
        platform: true,
        postUrl: true,
        preScanResult: true,
      },
    });

    if (!draw) {
      return res.status(404).json({
        success: false,
        error: 'Draw not found',
      });
    }

    // Get capabilities
    const capabilities = draw.platform
      ? capabilitiesService.getCapabilities(draw.platform as any, 'url')
      : capabilitiesService.getCapabilities('unknown', 'url');

    const userTier = await getUserTier(userId);
    const availableFilters = capabilitiesService.getAvailableFilters(capabilities, userTier);

    res.json({
      success: true,
      data: {
        drawId: draw.id,
        filters: draw.advancedFilters || DEFAULT_FILTERS,
        legacyFilters: draw.filters,
        platform: draw.platform,
        preScanResult: draw.preScanResult,
        capabilities,
        userTier,
        availableFilters,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Preview filter results (dry run)
 * POST /api/filters/:drawId/preview
 */
export const previewFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { drawId } = req.params;
    const userId = req.user!.id;
    const filters: Partial<AdvancedDrawFilters> = req.body.filters;

    // Get draw with participants
    const draw = await prisma.draw.findFirst({
      where: { id: drawId, userId },
      include: {
        participants: {
          take: 1000, // Limit for preview
        },
      },
    });

    if (!draw) {
      return res.status(404).json({
        success: false,
        error: 'Draw not found',
      });
    }

    if (!draw.participants || draw.participants.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No participants loaded. Please load participants first.',
      });
    }

    // Get capabilities
    const capabilities = draw.platform
      ? capabilitiesService.getCapabilities(draw.platform as any, 'url')
      : capabilitiesService.getCapabilities('unknown', 'url');

    // Convert participants to extended format
    const extendedParticipants = draw.participants.map(p => ({
      id: p.id,
      username: p.identifier,
      comment: p.name, // Note: name field might contain comment text
      timestamp: p.createdAt,
      mentions: extractMentions(p.name),
      hashtags: extractHashtags(p.name),
      ...(p.metadata as any),
    }));

    // Apply filters (preview mode)
    const result = await advancedFilterService.applyFilters(
      extendedParticipants,
      filters || (draw.advancedFilters as any) || DEFAULT_FILTERS,
      capabilities
    );

    res.json({
      success: true,
      data: {
        totalParticipants: result.totalProcessed,
        qualified: result.passed,
        excluded: result.excluded,
        summary: result.summary,
        processingTimeMs: result.processingTimeMs,
        // Don't include full results for privacy, just summary
        sampleExcluded: result.results
          .filter(r => !r.passed)
          .slice(0, 10)
          .map(r => ({
            username: r.username,
            reasons: r.failedFilters,
          })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get filter metadata (descriptions, tiers, etc.)
 * GET /api/filters/metadata
 */
export const getFilterMetadata = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const userTier = await getUserTier(userId);

    // Import metadata from types
    const { FILTER_METADATA } = await import('../../types/advanced-filters.types');

    res.json({
      success: true,
      data: {
        filters: FILTER_METADATA,
        userTier,
        defaultFilters: DEFAULT_FILTERS,
      },
    });
  } catch (error) {
    next(error);
  }
};

// === Helper Functions ===

async function getUserTier(userId: string): Promise<FilterTier> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      credits: true,
      subscription: {
        select: {
          planId: true,
          status: true,
          is48HPass: true,
        },
      },
    },
  });

  if (!user) return 'free';

  // Check for active pass
  const hasActivePass = await preScanService.checkActivePass(userId);
  if (hasActivePass) return 'enterprise'; // Pass gives enterprise access

  // Check subscription
  if (user.subscription?.status === 'ACTIVE') {
    const plan = user.subscription.planId?.toLowerCase() || '';
    if (plan.includes('enterprise')) return 'enterprise';
    if (plan.includes('premium')) return 'premium';
    if (plan.includes('basic')) return 'basic';
    return 'basic';
  }

  // Free tier
  return 'free';
}

function validateFiltersAccess(
  filters: Partial<AdvancedDrawFilters>,
  availableFilters: { filterId: string; available: boolean }[]
): string[] {
  const unavailable: string[] = [];
  const availableSet = new Set(
    availableFilters.filter(f => f.available).map(f => f.filterId)
  );

  // Check each enabled filter
  if (filters.profile?.requireBio?.enabled && !availableSet.has('profile.requireBio')) {
    unavailable.push('profile.requireBio');
  }
  if (filters.profile?.requireProfilePicture && !availableSet.has('profile.requireProfilePicture')) {
    unavailable.push('profile.requireProfilePicture');
  }
  if (filters.profile?.minAccountAge && !availableSet.has('profile.minAccountAge')) {
    unavailable.push('profile.minAccountAge');
  }
  if (filters.profile?.minPosts && !availableSet.has('profile.minPosts')) {
    unavailable.push('profile.minPosts');
  }
  if (filters.profile?.maxFollowings && !availableSet.has('profile.maxFollowings')) {
    unavailable.push('profile.maxFollowings');
  }
  if (filters.antiBot?.excludeSimilarUsernames?.enabled && !availableSet.has('antiBot.excludeSimilarUsernames')) {
    unavailable.push('antiBot.excludeSimilarUsernames');
  }
  if (filters.followVerification?.requiredFollows?.accounts?.length && !availableSet.has('followVerification.requiredFollows')) {
    unavailable.push('followVerification.requiredFollows');
  }
  if (filters.followVerification?.storyBonus?.enabled && !availableSet.has('followVerification.storyBonus')) {
    unavailable.push('followVerification.storyBonus');
  }

  return unavailable;
}

function extractMentions(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/@[\w.]+/g);
  return matches ? matches.map(m => m.substring(1)) : [];
}

function extractHashtags(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/#[\w]+/g);
  return matches ? matches.map(h => h.substring(1)) : [];
}
