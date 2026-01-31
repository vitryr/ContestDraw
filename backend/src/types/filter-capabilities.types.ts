/**
 * Filter Capabilities Types
 * Defines what each data source can verify
 */

/**
 * Source Capabilities - What the data source allows us to verify
 * Each boolean indicates if a specific data point is available
 */
export interface SourceCapabilities {
  // Comment data
  hasCommentText: boolean;          // Can access comment content
  hasMentions: boolean;             // Can extract @mentions from comments
  hasHashtags: boolean;             // Can extract #hashtags from comments
  hasCommentTimestamp: boolean;     // Can access comment creation time
  hasReplyInfo: boolean;            // Can distinguish replies from top-level comments
  hasCommentLikeCount: boolean;     // Can access comment likes count
  
  // Profile data
  hasProfileBio: boolean;           // Can access user bio
  hasProfilePicture: boolean;       // Can verify profile picture exists
  hasFollowerCount: boolean;        // Can access follower count
  hasFollowingCount: boolean;       // Can access following count
  hasPostsCount: boolean;           // Can access posts count
  hasAccountAge: boolean;           // Can determine account creation date
  hasVerifiedStatus: boolean;       // Can check if account is verified
  
  // Verification capabilities
  hasFollowVerification: boolean;   // Can verify if user follows account(s)
  hasStoryVerification: boolean;    // Can verify story interactions
  hasLikeVerification: boolean;     // Can verify post likes
  
  // Platform-specific
  platformId: SupportedPlatform;
  sourceType: 'url' | 'csv' | 'api';
  
  // Rate limits
  maxCommentsPerRequest: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

/**
 * Supported platforms
 */
export type SupportedPlatform = 
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'facebook'
  | 'csv'
  | 'unknown';

/**
 * Platform detection result
 */
export interface PlatformDetectionResult {
  platform: SupportedPlatform;
  postId?: string;
  postType?: 'post' | 'reel' | 'story' | 'video' | 'tweet' | 'short';
  url?: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * CSV column mapping for capability detection
 */
export interface CSVColumnMapping {
  username?: string;
  comment?: string;
  timestamp?: string;
  mentions?: string;
  bio?: string;
  followerCount?: string;
  followingCount?: string;
  postsCount?: string;
  profilePicture?: string;
  accountAge?: string;
  isReply?: string;
  likeCount?: string;
}

/**
 * Filter tier - determines which filters are available based on subscription
 */
export type FilterTier = 'free' | 'basic' | 'premium' | 'enterprise';

/**
 * Filter availability based on tier and capabilities
 */
export interface FilterAvailability {
  filterId: string;
  available: boolean;
  reason?: 'capability_missing' | 'tier_required' | 'platform_unsupported';
  requiredTier?: FilterTier;
  requiredCapabilities?: (keyof SourceCapabilities)[];
}

/**
 * Pre-scan result for volume check
 */
export interface PreScanResult {
  totalComments: number;
  estimatedComments?: number;  // If exact count not available
  isEstimate: boolean;
  hasMore: boolean;
  withinLimit: boolean;
  userLimit: number;           // Based on user's subscription
  upgradeRequired: boolean;
  suggestedPlan?: string;
}
