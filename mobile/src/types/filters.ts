/**
 * Advanced Filters Types for Mobile
 */

// === Source Capabilities ===
export interface SourceCapabilities {
  hasCommentText: boolean;
  hasMentions: boolean;
  hasHashtags: boolean;
  hasCommentTimestamp: boolean;
  hasReplyInfo: boolean;
  hasCommentLikeCount: boolean;
  hasProfileBio: boolean;
  hasProfilePicture: boolean;
  hasFollowerCount: boolean;
  hasFollowingCount: boolean;
  hasPostsCount: boolean;
  hasAccountAge: boolean;
  hasVerifiedStatus: boolean;
  hasFollowVerification: boolean;
  hasStoryVerification: boolean;
  hasLikeVerification: boolean;
  platformId: SupportedPlatform;
  sourceType: 'url' | 'csv' | 'api';
  maxCommentsPerRequest: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
}

export type SupportedPlatform = 
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'facebook'
  | 'csv'
  | 'unknown';

export type FilterTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface FilterAvailability {
  filterId: string;
  available: boolean;
  reason?: 'capability_missing' | 'tier_required' | 'platform_unsupported';
  requiredTier?: FilterTier;
  requiredCapabilities?: string[];
}

export interface PreScanResult {
  totalComments: number;
  estimatedComments?: number;
  isEstimate: boolean;
  hasMore: boolean;
  withinLimit: boolean;
  userLimit: number;
  upgradeRequired: boolean;
  suggestedPlan?: string;
}

// === Advanced Filters ===
export interface AdvancedDrawFilters {
  participation: {
    requireComment: boolean;
    replyHandling: 'include' | 'exclude' | 'only_replies';
    dateRange?: {
      from?: string;
      to?: string;
    };
  };

  mentions: {
    minMentions: number;
    uniqueMentionsOnly: boolean;
    excludeAutoMention: boolean;
    requiredMentions?: string[];
  };

  keywords: {
    required: string[];
    requiredMode: 'any' | 'all';
    forbidden: string[];
    caseSensitive: boolean;
  };

  multiComment: {
    maxEntriesPerUser: number | null;
    allowIfDifferentMentions: boolean;
    commentSelection: 'first' | 'last' | 'random';
    removeDuplicateComments: boolean;
  };

  profile: {
    requireBio: {
      enabled: boolean;
      minLength: number;
    };
    requireProfilePicture: boolean;
    minAccountAge: number | null;
    minPosts: number | null;
    maxFollowings: number | null;
    bioForbiddenWords: string[];
    minFollowers: number | null;
    requireVerified: boolean;
  };

  antiBot: {
    excludeSimilarUsernames: {
      enabled: boolean;
      mode: 'standard' | 'strict';
      threshold: number;
    };
    linkedAccounts: LinkedAccountGroup[];
    blacklist: string[];
    excludePatterns: string[];
  };

  followVerification: {
    requiredFollows: {
      accounts: string[];
      mode: 'verified' | 'declarative';
    };
    storyBonus: {
      enabled: boolean;
      multiplier: number;
      verificationMethod: 'code' | 'declarative' | 'api';
      requiredCode?: string;
    };
  };
}

export interface LinkedAccountGroup {
  primary: string;
  linked: string[];
  reason?: string;
}

// === Default Values ===
export const DEFAULT_FILTERS: AdvancedDrawFilters = {
  participation: {
    requireComment: true,
    replyHandling: 'include',
    dateRange: undefined,
  },
  mentions: {
    minMentions: 0,
    uniqueMentionsOnly: false,
    excludeAutoMention: false,
    requiredMentions: [],
  },
  keywords: {
    required: [],
    requiredMode: 'any',
    forbidden: [],
    caseSensitive: false,
  },
  multiComment: {
    maxEntriesPerUser: 1,
    allowIfDifferentMentions: false,
    commentSelection: 'first',
    removeDuplicateComments: true,
  },
  profile: {
    requireBio: { enabled: false, minLength: 0 },
    requireProfilePicture: false,
    minAccountAge: null,
    minPosts: null,
    maxFollowings: null,
    bioForbiddenWords: [],
    minFollowers: null,
    requireVerified: false,
  },
  antiBot: {
    excludeSimilarUsernames: { enabled: false, mode: 'standard', threshold: 0.85 },
    linkedAccounts: [],
    blacklist: [],
    excludePatterns: [],
  },
  followVerification: {
    requiredFollows: { accounts: [], mode: 'declarative' },
    storyBonus: { enabled: false, multiplier: 2, verificationMethod: 'declarative' },
  },
};

// === Filter Metadata ===
export type FilterCategory = 
  | 'participation'
  | 'mentions'
  | 'keywords'
  | 'multiComment'
  | 'profile'
  | 'antiBot'
  | 'followVerification';

export interface FilterSectionConfig {
  id: FilterCategory;
  title: string;
  icon: string;
  description: string;
  tier: FilterTier;
}

export const FILTER_SECTIONS: FilterSectionConfig[] = [
  {
    id: 'participation',
    title: 'Conditions de Participation',
    icon: 'checkmark-circle',
    description: 'Filtres de base pour la participation',
    tier: 'free',
  },
  {
    id: 'mentions',
    title: 'Mentions',
    icon: 'at',
    description: 'Exiger des @mentions',
    tier: 'free',
  },
  {
    id: 'keywords',
    title: 'Mots-clés',
    icon: 'pricetag',
    description: 'Mots-clés requis ou interdits',
    tier: 'free',
  },
  {
    id: 'multiComment',
    title: 'Multi-commentaires',
    icon: 'people',
    description: 'Gérer les participations multiples',
    tier: 'free',
  },
  {
    id: 'profile',
    title: 'Filtres Profil',
    icon: 'person',
    description: 'Filtrer par données de profil',
    tier: 'premium',
  },
  {
    id: 'antiBot',
    title: 'Anti-Bots',
    icon: 'shield-checkmark',
    description: 'Exclure les comptes suspects',
    tier: 'premium',
  },
  {
    id: 'followVerification',
    title: 'Vérification Follow',
    icon: 'person-add',
    description: 'Vérifier les abonnements',
    tier: 'premium',
  },
];

// === Tier Colors ===
export const TIER_COLORS: Record<FilterTier, string> = {
  free: '#22c55e',
  basic: '#3b82f6',
  premium: '#a855f7',
  enterprise: '#f59e0b',
};

export const TIER_LABELS: Record<FilterTier, string> = {
  free: 'Gratuit',
  basic: 'Basic',
  premium: 'Premium',
  enterprise: 'Enterprise',
};

// === API Response Types ===
export interface CapabilitiesResponse {
  platform: {
    platform: SupportedPlatform;
    postId?: string;
    postType?: string;
    confidence: 'high' | 'medium' | 'low';
  };
  capabilities: SourceCapabilities;
  userTier: FilterTier;
  availableFilters: FilterAvailability[];
}

export interface PreScanResponse {
  preScan: PreScanResult;
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  platform: {
    platform: SupportedPlatform;
    postId?: string;
  };
}

export interface FilterPreviewResponse {
  totalParticipants: number;
  qualified: number;
  excluded: number;
  summary: {
    byFilter: Record<string, number>;
    byCategory: Record<FilterCategory, number>;
  };
  processingTimeMs: number;
  sampleExcluded: Array<{
    username: string;
    reasons: string[];
  }>;
}
