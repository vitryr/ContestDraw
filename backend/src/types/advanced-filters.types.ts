/**
 * Advanced Filters Types
 * Complete filter definitions for the draw engine
 */

import { FilterTier } from './filter-capabilities.types';

/**
 * Complete Draw Filters Configuration
 */
export interface AdvancedDrawFilters {
  // === CONDITIONS DE PARTICIPATION ===
  participation: {
    /** Toggle: Must have commented (ON by default for URL source) */
    requireComment: boolean;
    
    /** Include or exclude replies */
    replyHandling: 'include' | 'exclude' | 'only_replies';
    
    /** Date range filter */
    dateRange?: {
      from?: Date;
      to?: Date;
    };
  };

  // === MENTIONS / IDENTIFICATIONS ===
  mentions: {
    /** Minimum number of @mentions required (0-10) */
    minMentions: number;
    
    /** Only count unique mentions */
    uniqueMentionsOnly: boolean;
    
    /** Exclude if user mentions themselves */
    excludeAutoMention: boolean;
    
    /** Specific accounts that must be mentioned */
    requiredMentions?: string[];
  };

  // === MOTS-CLÉS ===
  keywords: {
    /** Required keywords/hashtags */
    required: string[];
    
    /** Match mode: ANY (at least one) or ALL (must have all) */
    requiredMode: 'any' | 'all';
    
    /** Forbidden keywords - exclude if present */
    forbidden: string[];
    
    /** Case sensitive matching */
    caseSensitive: boolean;
  };

  // === MULTI-COMMENTAIRES / ÉQUITÉ ===
  multiComment: {
    /** Max comments per participant (1, 2, 3, 5, 10, or null for unlimited) */
    maxEntriesPerUser: number | null;
    
    /** Allow multiple comments ONLY if tagged accounts are different */
    allowIfDifferentMentions: boolean;
    
    /** Which comment to keep: first, last, or random */
    commentSelection: 'first' | 'last' | 'random';
    
    /** Remove exact duplicate comments (same text) */
    removeDuplicateComments: boolean;
  };

  // === FILTRES PROFIL ===
  profile: {
    /** Require bio with minimum length */
    requireBio: {
      enabled: boolean;
      minLength: number;
    };
    
    /** Require profile picture */
    requireProfilePicture: boolean;
    
    /** Minimum account age in days */
    minAccountAge: number | null;
    
    /** Minimum number of posts */
    minPosts: number | null;
    
    /** Maximum followings (to filter follow-bots) */
    maxFollowings: number | null;
    
    /** Forbidden words in bio */
    bioForbiddenWords: string[];
    
    /** Minimum followers */
    minFollowers: number | null;
    
    /** Require verified account */
    requireVerified: boolean;
  };

  // === ANTI COMPTES LIÉS / CONCOURISTES ===
  antiBot: {
    /** Exclude similar usernames (heuristic) */
    excludeSimilarUsernames: {
      enabled: boolean;
      mode: 'standard' | 'strict';
      /** Minimum similarity threshold (0-1) for exclusion */
      threshold: number;
    };
    
    /** Manually linked accounts mapping */
    linkedAccounts: LinkedAccountGroup[];
    
    /** Global blacklist of usernames */
    blacklist: string[];
    
    /** Exclude accounts matching patterns (regex) */
    excludePatterns: string[];
  };

  // === FOLLOW & STORY ===
  followVerification: {
    /** Require following specific accounts */
    requiredFollows: {
      accounts: string[];
      /** Verification mode */
      mode: 'verified' | 'declarative';
    };
    
    /** Story bonus - multiplies chances */
    storyBonus: {
      enabled: boolean;
      multiplier: number;
      /** Verification method */
      verificationMethod: 'code' | 'declarative' | 'api';
      /** Required code if using code verification */
      requiredCode?: string;
    };
  };
}

/**
 * Linked account group - accounts that belong to same person
 */
export interface LinkedAccountGroup {
  /** Primary username */
  primary: string;
  /** Linked usernames */
  linked: string[];
  /** Reason for linking */
  reason?: string;
}

/**
 * Default filter values
 */
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

/**
 * Filter metadata - tier requirements and capability dependencies
 */
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

/**
 * All filter metadata definitions
 */
export const FILTER_METADATA: FilterMetadata[] = [
  // Participation filters
  {
    id: 'participation.requireComment',
    name: 'Require Comment',
    description: 'Only include entries with valid comments',
    tier: 'free',
    requiredCapabilities: ['hasCommentText'],
    category: 'participation',
  },
  {
    id: 'participation.replyHandling',
    name: 'Reply Handling',
    description: 'Include or exclude reply comments',
    tier: 'free',
    requiredCapabilities: ['hasReplyInfo'],
    category: 'participation',
  },
  {
    id: 'participation.dateRange',
    name: 'Date Range',
    description: 'Filter comments by date/time',
    tier: 'free',
    requiredCapabilities: ['hasCommentTimestamp'],
    category: 'participation',
  },
  
  // Mentions filters
  {
    id: 'mentions.minMentions',
    name: 'Minimum Mentions',
    description: 'Require minimum number of @mentions',
    tier: 'free',
    requiredCapabilities: ['hasMentions'],
    category: 'mentions',
  },
  {
    id: 'mentions.uniqueMentionsOnly',
    name: 'Unique Mentions Only',
    description: 'Only count unique @mentions',
    tier: 'basic',
    requiredCapabilities: ['hasMentions'],
    category: 'mentions',
  },
  {
    id: 'mentions.excludeAutoMention',
    name: 'Exclude Self-Mention',
    description: 'Exclude if user mentions themselves',
    tier: 'basic',
    requiredCapabilities: ['hasMentions'],
    category: 'mentions',
  },
  
  // Keywords filters
  {
    id: 'keywords.required',
    name: 'Required Keywords',
    description: 'Require specific keywords or hashtags',
    tier: 'free',
    requiredCapabilities: ['hasCommentText'],
    category: 'keywords',
  },
  {
    id: 'keywords.forbidden',
    name: 'Forbidden Keywords',
    description: 'Exclude comments with specific words',
    tier: 'basic',
    requiredCapabilities: ['hasCommentText'],
    category: 'keywords',
  },
  
  // Multi-comment filters
  {
    id: 'multiComment.maxEntriesPerUser',
    name: 'Max Entries Per User',
    description: 'Limit entries per participant',
    tier: 'free',
    requiredCapabilities: [],
    category: 'multiComment',
  },
  {
    id: 'multiComment.allowIfDifferentMentions',
    name: 'Multiple If Different Mentions',
    description: 'Allow multiple entries if tagged users differ',
    tier: 'premium',
    requiredCapabilities: ['hasMentions'],
    category: 'multiComment',
  },
  
  // Profile filters
  {
    id: 'profile.requireBio',
    name: 'Require Bio',
    description: 'Require profile bio with minimum length',
    tier: 'premium',
    requiredCapabilities: ['hasProfileBio'],
    category: 'profile',
  },
  {
    id: 'profile.requireProfilePicture',
    name: 'Require Profile Picture',
    description: 'Require profile picture',
    tier: 'premium',
    requiredCapabilities: ['hasProfilePicture'],
    category: 'profile',
  },
  {
    id: 'profile.minAccountAge',
    name: 'Minimum Account Age',
    description: 'Require minimum account age',
    tier: 'premium',
    requiredCapabilities: ['hasAccountAge'],
    category: 'profile',
  },
  {
    id: 'profile.minPosts',
    name: 'Minimum Posts',
    description: 'Require minimum number of posts',
    tier: 'premium',
    requiredCapabilities: ['hasPostsCount'],
    category: 'profile',
  },
  {
    id: 'profile.maxFollowings',
    name: 'Maximum Followings',
    description: 'Exclude accounts following too many users',
    tier: 'premium',
    requiredCapabilities: ['hasFollowingCount'],
    category: 'profile',
  },
  
  // Anti-bot filters
  {
    id: 'antiBot.excludeSimilarUsernames',
    name: 'Exclude Similar Usernames',
    description: 'Exclude accounts with similar usernames',
    tier: 'premium',
    requiredCapabilities: [],
    category: 'antiBot',
  },
  {
    id: 'antiBot.blacklist',
    name: 'Blacklist',
    description: 'Exclude specific usernames',
    tier: 'free',
    requiredCapabilities: [],
    category: 'antiBot',
  },
  
  // Follow verification
  {
    id: 'followVerification.requiredFollows',
    name: 'Required Follows',
    description: 'Require following specific accounts',
    tier: 'premium',
    requiredCapabilities: ['hasFollowVerification'],
    category: 'followVerification',
  },
  {
    id: 'followVerification.storyBonus',
    name: 'Story Bonus',
    description: 'Bonus entries for story interaction',
    tier: 'enterprise',
    requiredCapabilities: ['hasStoryVerification'],
    category: 'followVerification',
  },
];

/**
 * Filter result for a single participant
 */
export interface ParticipantFilterResult {
  participantId: string;
  username: string;
  passed: boolean;
  failedFilters: string[];
  warnings: string[];
  entriesCount: number;
  bonusMultiplier: number;
}

/**
 * Batch filter result
 */
export interface BatchFilterResult {
  totalProcessed: number;
  passed: number;
  excluded: number;
  results: ParticipantFilterResult[];
  summary: {
    byFilter: Record<string, number>;
    byCategory: Record<FilterCategory, number>;
  };
  processingTimeMs: number;
}
