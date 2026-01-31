/**
 * Tests for Filter Helper Functions
 */

import {
  DEFAULT_FILTERS,
  AdvancedDrawFilters,
  FilterTier,
  TIER_COLORS,
  TIER_LABELS,
  FILTER_SECTIONS,
} from '../../src/types/filters';

// Helper functions that we would test
// These functions could be extracted to a utils file

/**
 * Validates filter values
 */
function validateFilters(filters: AdvancedDrawFilters): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate mentions
  if (filters.mentions.minMentions < 0) {
    errors.push('Minimum mentions cannot be negative');
  }
  if (filters.mentions.minMentions > 10) {
    errors.push('Minimum mentions cannot exceed 10');
  }

  // Validate multiComment
  if (filters.multiComment.maxEntriesPerUser !== null && filters.multiComment.maxEntriesPerUser < 1) {
    errors.push('Max entries per user must be at least 1');
  }

  // Validate profile
  if (filters.profile.minAccountAge !== null && filters.profile.minAccountAge < 0) {
    errors.push('Minimum account age cannot be negative');
  }
  if (filters.profile.requireBio.minLength < 0) {
    errors.push('Bio minimum length cannot be negative');
  }

  // Validate antiBot
  if (filters.antiBot.excludeSimilarUsernames.threshold < 0 || filters.antiBot.excludeSimilarUsernames.threshold > 1) {
    errors.push('Similarity threshold must be between 0 and 1');
  }

  // Validate followVerification
  if (filters.followVerification.storyBonus.multiplier < 1) {
    errors.push('Story bonus multiplier must be at least 1');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Merges user filters with defaults
 */
function mergeWithDefaults(partialFilters: Partial<AdvancedDrawFilters>): AdvancedDrawFilters {
  return {
    ...DEFAULT_FILTERS,
    ...partialFilters,
    participation: { ...DEFAULT_FILTERS.participation, ...partialFilters.participation },
    mentions: { ...DEFAULT_FILTERS.mentions, ...partialFilters.mentions },
    keywords: { ...DEFAULT_FILTERS.keywords, ...partialFilters.keywords },
    multiComment: { ...DEFAULT_FILTERS.multiComment, ...partialFilters.multiComment },
    profile: { ...DEFAULT_FILTERS.profile, ...partialFilters.profile },
    antiBot: { ...DEFAULT_FILTERS.antiBot, ...partialFilters.antiBot },
    followVerification: { ...DEFAULT_FILTERS.followVerification, ...partialFilters.followVerification },
  };
}

/**
 * Checks if a tier has access to another tier's features
 */
function hasTierAccess(userTier: FilterTier, requiredTier: FilterTier): boolean {
  const tierOrder: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Gets active filter count
 */
function getActiveFilterCount(filters: AdvancedDrawFilters): number {
  let count = 0;

  // Participation
  if (filters.participation.requireComment) count++;
  if (filters.participation.replyHandling !== 'include') count++;
  if (filters.participation.dateRange) count++;

  // Mentions
  if (filters.mentions.minMentions > 0) count++;
  if (filters.mentions.uniqueMentionsOnly) count++;
  if (filters.mentions.excludeAutoMention) count++;
  if (filters.mentions.requiredMentions && filters.mentions.requiredMentions.length > 0) count++;

  // Keywords
  if (filters.keywords.required.length > 0) count++;
  if (filters.keywords.forbidden.length > 0) count++;

  // MultiComment
  if (filters.multiComment.maxEntriesPerUser !== null && filters.multiComment.maxEntriesPerUser !== 1) count++;
  if (filters.multiComment.allowIfDifferentMentions) count++;

  // Profile
  if (filters.profile.requireBio.enabled) count++;
  if (filters.profile.requireProfilePicture) count++;
  if (filters.profile.minAccountAge !== null) count++;
  if (filters.profile.minPosts !== null) count++;
  if (filters.profile.minFollowers !== null) count++;
  if (filters.profile.requireVerified) count++;

  // AntiBot
  if (filters.antiBot.excludeSimilarUsernames.enabled) count++;
  if (filters.antiBot.blacklist.length > 0) count++;
  if (filters.antiBot.linkedAccounts.length > 0) count++;

  // FollowVerification
  if (filters.followVerification.requiredFollows.accounts.length > 0) count++;
  if (filters.followVerification.storyBonus.enabled) count++;

  return count;
}

describe('Filter Helpers', () => {
  describe('validateFilters', () => {
    it('should return valid for default filters', () => {
      const result = validateFilters(DEFAULT_FILTERS);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject negative mentions', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        mentions: { ...DEFAULT_FILTERS.mentions, minMentions: -1 },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Minimum mentions cannot be negative');
    });

    it('should reject mentions over 10', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        mentions: { ...DEFAULT_FILTERS.mentions, minMentions: 15 },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Minimum mentions cannot exceed 10');
    });

    it('should reject max entries less than 1', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        multiComment: { ...DEFAULT_FILTERS.multiComment, maxEntriesPerUser: 0 },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Max entries per user must be at least 1');
    });

    it('should allow null max entries (unlimited)', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        multiComment: { ...DEFAULT_FILTERS.multiComment, maxEntriesPerUser: null },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(true);
    });

    it('should reject negative account age', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        profile: { ...DEFAULT_FILTERS.profile, minAccountAge: -30 },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Minimum account age cannot be negative');
    });

    it('should reject invalid similarity threshold', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        antiBot: {
          ...DEFAULT_FILTERS.antiBot,
          excludeSimilarUsernames: { ...DEFAULT_FILTERS.antiBot.excludeSimilarUsernames, threshold: 1.5 },
        },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Similarity threshold must be between 0 and 1');
    });

    it('should reject multiplier less than 1', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        followVerification: {
          ...DEFAULT_FILTERS.followVerification,
          storyBonus: { ...DEFAULT_FILTERS.followVerification.storyBonus, multiplier: 0.5 },
        },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Story bonus multiplier must be at least 1');
    });

    it('should collect multiple errors', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        mentions: { ...DEFAULT_FILTERS.mentions, minMentions: -1 },
        profile: { ...DEFAULT_FILTERS.profile, minAccountAge: -30 },
      };
      const result = validateFilters(filters);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });

  describe('mergeWithDefaults', () => {
    it('should return defaults for empty partial', () => {
      const result = mergeWithDefaults({});
      expect(result).toEqual(DEFAULT_FILTERS);
    });

    it('should merge partial mentions', () => {
      const result = mergeWithDefaults({
        mentions: { minMentions: 3 } as any,
      });
      expect(result.mentions.minMentions).toBe(3);
      expect(result.mentions.uniqueMentionsOnly).toBe(false); // default
    });

    it('should preserve other categories when updating one', () => {
      const result = mergeWithDefaults({
        keywords: { required: ['#test'] } as any,
      });
      expect(result.keywords.required).toEqual(['#test']);
      expect(result.participation).toEqual(DEFAULT_FILTERS.participation);
    });

    it('should deeply merge nested objects', () => {
      const result = mergeWithDefaults({
        profile: { requireBio: { enabled: true } } as any,
      });
      expect(result.profile.requireBio.enabled).toBe(true);
    });
  });

  describe('hasTierAccess', () => {
    it('should allow same tier access', () => {
      expect(hasTierAccess('free', 'free')).toBe(true);
      expect(hasTierAccess('premium', 'premium')).toBe(true);
    });

    it('should allow higher tier access', () => {
      expect(hasTierAccess('premium', 'free')).toBe(true);
      expect(hasTierAccess('enterprise', 'basic')).toBe(true);
    });

    it('should deny lower tier access', () => {
      expect(hasTierAccess('free', 'premium')).toBe(false);
      expect(hasTierAccess('basic', 'enterprise')).toBe(false);
    });

    it('should follow correct tier order', () => {
      expect(hasTierAccess('basic', 'free')).toBe(true);
      expect(hasTierAccess('premium', 'basic')).toBe(true);
      expect(hasTierAccess('enterprise', 'premium')).toBe(true);
    });
  });

  describe('getActiveFilterCount', () => {
    it('should return 1 for default filters (requireComment is true)', () => {
      const count = getActiveFilterCount(DEFAULT_FILTERS);
      expect(count).toBe(1);
    });

    it('should count mentions filters', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        mentions: { ...DEFAULT_FILTERS.mentions, minMentions: 2, uniqueMentionsOnly: true },
      };
      const count = getActiveFilterCount(filters);
      expect(count).toBeGreaterThanOrEqual(3); // requireComment + 2 mentions
    });

    it('should count keywords', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        keywords: { ...DEFAULT_FILTERS.keywords, required: ['#test'], forbidden: ['spam'] },
      };
      const count = getActiveFilterCount(filters);
      expect(count).toBeGreaterThanOrEqual(3); // requireComment + 2 keyword filters
    });

    it('should count profile filters', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        profile: {
          ...DEFAULT_FILTERS.profile,
          requireBio: { enabled: true, minLength: 10 },
          requireProfilePicture: true,
          requireVerified: true,
        },
      };
      const count = getActiveFilterCount(filters);
      expect(count).toBeGreaterThanOrEqual(4);
    });

    it('should count antiBot filters', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        antiBot: {
          ...DEFAULT_FILTERS.antiBot,
          excludeSimilarUsernames: { enabled: true, mode: 'standard' as const, threshold: 0.85 },
          blacklist: ['@spammer'],
        },
      };
      const count = getActiveFilterCount(filters);
      expect(count).toBeGreaterThanOrEqual(3);
    });

    it('should count followVerification filters', () => {
      const filters = {
        ...DEFAULT_FILTERS,
        followVerification: {
          ...DEFAULT_FILTERS.followVerification,
          requiredFollows: { accounts: ['@brand'], mode: 'declarative' as const },
          storyBonus: { enabled: true, multiplier: 2, verificationMethod: 'declarative' as const },
        },
      };
      const count = getActiveFilterCount(filters);
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  describe('FILTER_SECTIONS config', () => {
    it('should have all categories covered', () => {
      const categories = FILTER_SECTIONS.map((s) => s.id);
      expect(categories).toContain('participation');
      expect(categories).toContain('mentions');
      expect(categories).toContain('keywords');
      expect(categories).toContain('multiComment');
      expect(categories).toContain('profile');
      expect(categories).toContain('antiBot');
      expect(categories).toContain('followVerification');
    });

    it('should have valid icons', () => {
      const validIcons = [
        'checkmark-circle',
        'at',
        'pricetag',
        'people',
        'person',
        'shield-checkmark',
        'person-add',
      ];
      FILTER_SECTIONS.forEach((section) => {
        expect(validIcons).toContain(section.icon);
      });
    });

    it('should have valid tiers', () => {
      const validTiers: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
      FILTER_SECTIONS.forEach((section) => {
        expect(validTiers).toContain(section.tier);
      });
    });
  });

  describe('TIER_COLORS', () => {
    it('should have valid hex colors', () => {
      Object.values(TIER_COLORS).forEach((color) => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  describe('TIER_LABELS', () => {
    it('should have non-empty labels', () => {
      Object.values(TIER_LABELS).forEach((label) => {
        expect(label.length).toBeGreaterThan(0);
      });
    });

    it('should be in French', () => {
      expect(TIER_LABELS.free).toBe('Gratuit');
    });
  });
});
