/**
 * Capabilities Service
 * Detects platform and determines available filter capabilities
 */

import {
  SourceCapabilities,
  SupportedPlatform,
  PlatformDetectionResult,
  CSVColumnMapping,
  FilterAvailability,
  FilterTier,
  PreScanResult,
} from '../types/filter-capabilities.types';
import { FILTER_METADATA, FilterMetadata } from '../types/advanced-filters.types';
import { logger } from '../utils/logger';

/**
 * Platform-specific capabilities definitions
 */
const PLATFORM_CAPABILITIES: Record<SupportedPlatform, Partial<SourceCapabilities>> = {
  instagram: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: true,
    hasReplyInfo: true,
    hasCommentLikeCount: true,
    hasProfileBio: true,
    hasProfilePicture: true,
    hasFollowerCount: true,
    hasFollowingCount: true,
    hasPostsCount: true,
    hasAccountAge: false,  // Not directly available via API
    hasVerifiedStatus: true,
    hasFollowVerification: true,  // Via API with proper permissions
    hasStoryVerification: false,  // Not available via public API
    hasLikeVerification: false,
    maxCommentsPerRequest: 50,
    rateLimit: { requestsPerMinute: 200, requestsPerDay: 5000 },
  },
  
  tiktok: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: true,
    hasReplyInfo: true,
    hasCommentLikeCount: true,
    hasProfileBio: true,
    hasProfilePicture: true,
    hasFollowerCount: true,
    hasFollowingCount: true,
    hasPostsCount: false,
    hasAccountAge: false,
    hasVerifiedStatus: true,
    hasFollowVerification: false,  // Limited API access
    hasStoryVerification: false,
    hasLikeVerification: false,
    maxCommentsPerRequest: 100,
    rateLimit: { requestsPerMinute: 100, requestsPerDay: 2000 },
  },
  
  youtube: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: true,
    hasReplyInfo: true,
    hasCommentLikeCount: true,
    hasProfileBio: false,
    hasProfilePicture: true,
    hasFollowerCount: true,  // Subscriber count
    hasFollowingCount: false,
    hasPostsCount: false,
    hasAccountAge: true,
    hasVerifiedStatus: true,
    hasFollowVerification: true,  // Can check subscriptions
    hasStoryVerification: false,
    hasLikeVerification: false,
    maxCommentsPerRequest: 100,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 10000 },
  },
  
  twitter: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: true,
    hasReplyInfo: true,
    hasCommentLikeCount: true,
    hasProfileBio: true,
    hasProfilePicture: true,
    hasFollowerCount: true,
    hasFollowingCount: true,
    hasPostsCount: true,
    hasAccountAge: true,
    hasVerifiedStatus: true,
    hasFollowVerification: true,
    hasStoryVerification: false,
    hasLikeVerification: true,
    maxCommentsPerRequest: 100,
    rateLimit: { requestsPerMinute: 15, requestsPerDay: 1500 },
  },
  
  facebook: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: true,
    hasReplyInfo: true,
    hasCommentLikeCount: true,
    hasProfileBio: false,
    hasProfilePicture: true,
    hasFollowerCount: false,
    hasFollowingCount: false,
    hasPostsCount: false,
    hasAccountAge: false,
    hasVerifiedStatus: false,
    hasFollowVerification: false,
    hasStoryVerification: false,
    hasLikeVerification: false,
    maxCommentsPerRequest: 100,
    rateLimit: { requestsPerMinute: 200, requestsPerDay: 5000 },
  },
  
  csv: {
    // CSV capabilities depend on columns present - will be determined dynamically
    hasCommentText: true,  // Assumed minimum
    hasMentions: true,     // Can be extracted from comment
    hasHashtags: true,     // Can be extracted from comment
    hasCommentTimestamp: false,
    hasReplyInfo: false,
    hasCommentLikeCount: false,
    hasProfileBio: false,
    hasProfilePicture: false,
    hasFollowerCount: false,
    hasFollowingCount: false,
    hasPostsCount: false,
    hasAccountAge: false,
    hasVerifiedStatus: false,
    hasFollowVerification: false,
    hasStoryVerification: false,
    hasLikeVerification: false,
    maxCommentsPerRequest: Infinity,
    rateLimit: { requestsPerMinute: Infinity, requestsPerDay: Infinity },
  },
  
  unknown: {
    hasCommentText: true,
    hasMentions: true,
    hasHashtags: true,
    hasCommentTimestamp: false,
    hasReplyInfo: false,
    hasCommentLikeCount: false,
    hasProfileBio: false,
    hasProfilePicture: false,
    hasFollowerCount: false,
    hasFollowingCount: false,
    hasPostsCount: false,
    hasAccountAge: false,
    hasVerifiedStatus: false,
    hasFollowVerification: false,
    hasStoryVerification: false,
    hasLikeVerification: false,
    maxCommentsPerRequest: 100,
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 1000 },
  },
};

/**
 * URL patterns for platform detection
 */
const PLATFORM_PATTERNS: { platform: SupportedPlatform; patterns: RegExp[]; postTypePatterns: Record<string, RegExp> }[] = [
  {
    platform: 'instagram',
    patterns: [
      /instagram\.com/i,
      /instagr\.am/i,
    ],
    postTypePatterns: {
      post: /\/p\/([A-Za-z0-9_-]+)/,
      reel: /\/reel\/([A-Za-z0-9_-]+)/,
      story: /\/stories\/([A-Za-z0-9_-]+)/,
    },
  },
  {
    platform: 'tiktok',
    patterns: [
      /tiktok\.com/i,
      /vm\.tiktok\.com/i,
    ],
    postTypePatterns: {
      video: /\/video\/(\d+)/,
      post: /@[^/]+\/video\/(\d+)/,
    },
  },
  {
    platform: 'youtube',
    patterns: [
      /youtube\.com/i,
      /youtu\.be/i,
    ],
    postTypePatterns: {
      video: /(?:watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/,
      short: /\/shorts\/([A-Za-z0-9_-]+)/,
    },
  },
  {
    platform: 'twitter',
    patterns: [
      /twitter\.com/i,
      /x\.com/i,
    ],
    postTypePatterns: {
      tweet: /\/status\/(\d+)/,
    },
  },
  {
    platform: 'facebook',
    patterns: [
      /facebook\.com/i,
      /fb\.com/i,
      /fb\.watch/i,
    ],
    postTypePatterns: {
      post: /\/posts\/(\d+)/,
      video: /\/videos\/(\d+)/,
      reel: /\/reel\/(\d+)/,
    },
  },
];

class CapabilitiesService {
  /**
   * Detect platform from URL
   */
  detectPlatform(url: string): PlatformDetectionResult {
    logger.debug('Detecting platform from URL', { url });
    
    for (const { platform, patterns, postTypePatterns } of PLATFORM_PATTERNS) {
      const matchesPlatform = patterns.some(pattern => pattern.test(url));
      
      if (matchesPlatform) {
        let postId: string | undefined;
        let postType: 'post' | 'reel' | 'story' | 'video' | 'tweet' | 'short' | undefined;
        
        // Try to extract post ID and type
        for (const [type, pattern] of Object.entries(postTypePatterns)) {
          const match = url.match(pattern);
          if (match) {
            postId = match[1];
            postType = type as any;
            break;
          }
        }
        
        logger.info('Platform detected', { platform, postId, postType });
        
        return {
          platform,
          postId,
          postType,
          url,
          confidence: postId ? 'high' : 'medium',
        };
      }
    }
    
    logger.warn('Unknown platform', { url });
    return {
      platform: 'unknown',
      url,
      confidence: 'low',
    };
  }

  /**
   * Get capabilities for a platform
   */
  getCapabilities(platform: SupportedPlatform, sourceType: 'url' | 'csv' | 'api' = 'url'): SourceCapabilities {
    const baseCapabilities = PLATFORM_CAPABILITIES[platform] || PLATFORM_CAPABILITIES.unknown;
    
    return {
      ...baseCapabilities,
      platformId: platform,
      sourceType,
    } as SourceCapabilities;
  }

  /**
   * Get capabilities from URL
   */
  getCapabilitiesFromUrl(url: string): SourceCapabilities {
    const detection = this.detectPlatform(url);
    return this.getCapabilities(detection.platform, 'url');
  }

  /**
   * Get capabilities from CSV columns
   */
  getCapabilitiesFromCSV(columns: string[]): SourceCapabilities {
    const normalizedColumns = columns.map(c => c.toLowerCase().trim());
    
    const capabilities: SourceCapabilities = {
      ...PLATFORM_CAPABILITIES.csv,
      platformId: 'csv',
      sourceType: 'csv',
      
      // Detect capabilities based on column names
      hasCommentText: this.hasColumn(normalizedColumns, ['comment', 'text', 'message', 'content']),
      hasMentions: this.hasColumn(normalizedColumns, ['mentions', 'tagged', 'tags']),
      hasCommentTimestamp: this.hasColumn(normalizedColumns, ['timestamp', 'date', 'created_at', 'time']),
      hasReplyInfo: this.hasColumn(normalizedColumns, ['is_reply', 'reply', 'parent_id']),
      hasCommentLikeCount: this.hasColumn(normalizedColumns, ['likes', 'like_count']),
      hasProfileBio: this.hasColumn(normalizedColumns, ['bio', 'description']),
      hasProfilePicture: this.hasColumn(normalizedColumns, ['profile_pic', 'avatar', 'picture']),
      hasFollowerCount: this.hasColumn(normalizedColumns, ['followers', 'follower_count']),
      hasFollowingCount: this.hasColumn(normalizedColumns, ['following', 'following_count']),
      hasPostsCount: this.hasColumn(normalizedColumns, ['posts', 'post_count', 'media_count']),
      hasAccountAge: this.hasColumn(normalizedColumns, ['account_age', 'created', 'joined']),
      hasVerifiedStatus: this.hasColumn(normalizedColumns, ['verified', 'is_verified']),
    } as SourceCapabilities;
    
    logger.info('CSV capabilities detected', { columns, capabilities });
    
    return capabilities;
  }

  /**
   * Check if columns contain a specific field
   */
  private hasColumn(columns: string[], possibleNames: string[]): boolean {
    return possibleNames.some(name => 
      columns.some(col => col.includes(name))
    );
  }

  /**
   * Get available filters based on capabilities and user tier
   */
  getAvailableFilters(
    capabilities: SourceCapabilities,
    userTier: FilterTier
  ): FilterAvailability[] {
    const tierOrder: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
    const userTierIndex = tierOrder.indexOf(userTier);
    
    return FILTER_METADATA.map(filter => {
      const filterTierIndex = tierOrder.indexOf(filter.tier);
      
      // Check tier requirement
      if (filterTierIndex > userTierIndex) {
        return {
          filterId: filter.id,
          available: false as const,
          reason: 'tier_required' as const,
          requiredTier: filter.tier,
          requiredCapabilities: filter.requiredCapabilities as (keyof SourceCapabilities)[],
        };
      }
      
      // Check capability requirements
      const missingCapabilities = filter.requiredCapabilities.filter(
        cap => !(capabilities as any)[cap]
      );
      
      if (missingCapabilities.length > 0) {
        return {
          filterId: filter.id,
          available: false as const,
          reason: 'capability_missing' as const,
          requiredCapabilities: missingCapabilities as (keyof SourceCapabilities)[],
        };
      }
      
      return {
        filterId: filter.id,
        available: true as const,
      };
    });
  }

  /**
   * Pre-scan to check comment volume before draw
   */
  async preScan(
    platform: SupportedPlatform,
    postId: string,
    userLimit: number
  ): Promise<PreScanResult> {
    // This would integrate with platform-specific services
    // For now, return a placeholder
    logger.info('Pre-scanning post', { platform, postId, userLimit });
    
    // TODO: Implement actual pre-scan for each platform
    // This should make a lightweight API call to get comment count
    
    return {
      totalComments: 0,
      isEstimate: true,
      hasMore: false,
      withinLimit: true,
      userLimit,
      upgradeRequired: false,
    };
  }

  /**
   * Get filter metadata by ID
   */
  getFilterMetadata(filterId: string): FilterMetadata | undefined {
    return FILTER_METADATA.find(f => f.id === filterId);
  }

  /**
   * Check if a specific filter is available
   */
  isFilterAvailable(
    filterId: string,
    capabilities: SourceCapabilities,
    userTier: FilterTier
  ): FilterAvailability {
    const filters = this.getAvailableFilters(capabilities, userTier);
    return filters.find(f => f.filterId === filterId) || {
      filterId,
      available: false,
      reason: 'platform_unsupported',
    };
  }
}

export const capabilitiesService = new CapabilitiesService();
export default capabilitiesService;
