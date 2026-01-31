/**
 * Advanced Filters Types for Frontend
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
export interface FilterMetadata {
  id: string;
  name: string;
  description: string;
  tier: FilterTier;
  requiredCapabilities: string[];
  category: FilterCategory;
}

export type FilterCategory = 
  | 'participation'
  | 'mentions'
  | 'keywords'
  | 'multiComment'
  | 'profile'
  | 'antiBot'
  | 'followVerification';

// === API Responses ===
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

// === UI Helper Types ===
export interface FilterSectionConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  tier: FilterTier;
  filters: string[];
}

export const FILTER_SECTIONS: FilterSectionConfig[] = [
  {
    id: 'participation',
    title: 'Conditions de Participation',
    icon: 'CheckCircle',
    description: 'Filtres de base pour la participation',
    tier: 'free',
    filters: ['participation.requireComment', 'participation.replyHandling', 'participation.dateRange'],
  },
  {
    id: 'mentions',
    title: 'Mentions / Identifications',
    icon: 'AtSign',
    description: 'Exiger des @mentions dans les commentaires',
    tier: 'free',
    filters: ['mentions.minMentions', 'mentions.uniqueMentionsOnly', 'mentions.excludeAutoMention'],
  },
  {
    id: 'keywords',
    title: 'Mots-clés / Hashtags',
    icon: 'Hash',
    description: 'Exiger ou interdire des mots-clés',
    tier: 'free',
    filters: ['keywords.required', 'keywords.forbidden'],
  },
  {
    id: 'multiComment',
    title: 'Multi-commentaires / Équité',
    icon: 'Users',
    description: 'Gérer les participations multiples',
    tier: 'free',
    filters: ['multiComment.maxEntriesPerUser', 'multiComment.allowIfDifferentMentions', 'multiComment.commentSelection'],
  },
  {
    id: 'profile',
    title: 'Filtres Profil',
    icon: 'User',
    description: 'Filtrer par données de profil',
    tier: 'premium',
    filters: ['profile.requireBio', 'profile.requireProfilePicture', 'profile.minAccountAge', 'profile.minPosts', 'profile.maxFollowings'],
  },
  {
    id: 'antiBot',
    title: 'Anti-Bots / Concouristes',
    icon: 'Shield',
    description: 'Exclure les comptes suspects',
    tier: 'premium',
    filters: ['antiBot.excludeSimilarUsernames', 'antiBot.blacklist', 'antiBot.excludePatterns'],
  },
  {
    id: 'followVerification',
    title: 'Vérification Follow / Story',
    icon: 'UserPlus',
    description: 'Vérifier les abonnements et stories',
    tier: 'premium',
    filters: ['followVerification.requiredFollows', 'followVerification.storyBonus'],
  },
];

// === Tier Badge Colors ===
export const TIER_COLORS: Record<FilterTier, string> = {
  free: 'bg-green-500/20 text-green-400',
  basic: 'bg-blue-500/20 text-blue-400',
  premium: 'bg-purple-500/20 text-purple-400',
  enterprise: 'bg-amber-500/20 text-amber-400',
};

export const TIER_LABELS: Record<FilterTier, string> = {
  free: 'Gratuit',
  basic: 'Basic',
  premium: 'Premium',
  enterprise: 'Enterprise',
};
