/**
 * Tests for Filter Types and Constants
 */

import {
  DEFAULT_FILTERS,
  FILTER_SECTIONS,
  TIER_COLORS,
  TIER_LABELS,
  AdvancedDrawFilters,
  FilterTier,
  FilterCategory,
  SupportedPlatform,
} from '../../src/types/filters';

describe('Filter Types', () => {
  describe('DEFAULT_FILTERS', () => {
    it('should have all required categories', () => {
      expect(DEFAULT_FILTERS).toHaveProperty('participation');
      expect(DEFAULT_FILTERS).toHaveProperty('mentions');
      expect(DEFAULT_FILTERS).toHaveProperty('keywords');
      expect(DEFAULT_FILTERS).toHaveProperty('multiComment');
      expect(DEFAULT_FILTERS).toHaveProperty('profile');
      expect(DEFAULT_FILTERS).toHaveProperty('antiBot');
      expect(DEFAULT_FILTERS).toHaveProperty('followVerification');
    });

    it('should have correct default participation values', () => {
      expect(DEFAULT_FILTERS.participation.requireComment).toBe(true);
      expect(DEFAULT_FILTERS.participation.replyHandling).toBe('include');
      expect(DEFAULT_FILTERS.participation.dateRange).toBeUndefined();
    });

    it('should have correct default mentions values', () => {
      expect(DEFAULT_FILTERS.mentions.minMentions).toBe(0);
      expect(DEFAULT_FILTERS.mentions.uniqueMentionsOnly).toBe(false);
      expect(DEFAULT_FILTERS.mentions.excludeAutoMention).toBe(false);
      expect(DEFAULT_FILTERS.mentions.requiredMentions).toEqual([]);
    });

    it('should have correct default keywords values', () => {
      expect(DEFAULT_FILTERS.keywords.required).toEqual([]);
      expect(DEFAULT_FILTERS.keywords.requiredMode).toBe('any');
      expect(DEFAULT_FILTERS.keywords.forbidden).toEqual([]);
      expect(DEFAULT_FILTERS.keywords.caseSensitive).toBe(false);
    });

    it('should have correct default multiComment values', () => {
      expect(DEFAULT_FILTERS.multiComment.maxEntriesPerUser).toBe(1);
      expect(DEFAULT_FILTERS.multiComment.allowIfDifferentMentions).toBe(false);
      expect(DEFAULT_FILTERS.multiComment.commentSelection).toBe('first');
      expect(DEFAULT_FILTERS.multiComment.removeDuplicateComments).toBe(true);
    });

    it('should have correct default profile values', () => {
      expect(DEFAULT_FILTERS.profile.requireBio.enabled).toBe(false);
      expect(DEFAULT_FILTERS.profile.requireBio.minLength).toBe(0);
      expect(DEFAULT_FILTERS.profile.requireProfilePicture).toBe(false);
      expect(DEFAULT_FILTERS.profile.minAccountAge).toBeNull();
      expect(DEFAULT_FILTERS.profile.minPosts).toBeNull();
      expect(DEFAULT_FILTERS.profile.maxFollowings).toBeNull();
      expect(DEFAULT_FILTERS.profile.bioForbiddenWords).toEqual([]);
      expect(DEFAULT_FILTERS.profile.minFollowers).toBeNull();
      expect(DEFAULT_FILTERS.profile.requireVerified).toBe(false);
    });

    it('should have correct default antiBot values', () => {
      expect(DEFAULT_FILTERS.antiBot.excludeSimilarUsernames.enabled).toBe(false);
      expect(DEFAULT_FILTERS.antiBot.excludeSimilarUsernames.mode).toBe('standard');
      expect(DEFAULT_FILTERS.antiBot.excludeSimilarUsernames.threshold).toBe(0.85);
      expect(DEFAULT_FILTERS.antiBot.linkedAccounts).toEqual([]);
      expect(DEFAULT_FILTERS.antiBot.blacklist).toEqual([]);
      expect(DEFAULT_FILTERS.antiBot.excludePatterns).toEqual([]);
    });

    it('should have correct default followVerification values', () => {
      expect(DEFAULT_FILTERS.followVerification.requiredFollows.accounts).toEqual([]);
      expect(DEFAULT_FILTERS.followVerification.requiredFollows.mode).toBe('declarative');
      expect(DEFAULT_FILTERS.followVerification.storyBonus.enabled).toBe(false);
      expect(DEFAULT_FILTERS.followVerification.storyBonus.multiplier).toBe(2);
      expect(DEFAULT_FILTERS.followVerification.storyBonus.verificationMethod).toBe('declarative');
    });
  });

  describe('FILTER_SECTIONS', () => {
    it('should have 7 sections', () => {
      expect(FILTER_SECTIONS).toHaveLength(7);
    });

    it('should have correct structure for each section', () => {
      FILTER_SECTIONS.forEach((section) => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('icon');
        expect(section).toHaveProperty('description');
        expect(section).toHaveProperty('tier');
      });
    });

    it('should have free tier for basic sections', () => {
      const freeSections = FILTER_SECTIONS.filter((s) => s.tier === 'free');
      expect(freeSections.length).toBeGreaterThanOrEqual(4);
      
      const freeIds = freeSections.map((s) => s.id);
      expect(freeIds).toContain('participation');
      expect(freeIds).toContain('mentions');
      expect(freeIds).toContain('keywords');
      expect(freeIds).toContain('multiComment');
    });

    it('should have premium tier for advanced sections', () => {
      const premiumSections = FILTER_SECTIONS.filter((s) => s.tier === 'premium');
      expect(premiumSections.length).toBeGreaterThanOrEqual(3);
      
      const premiumIds = premiumSections.map((s) => s.id);
      expect(premiumIds).toContain('profile');
      expect(premiumIds).toContain('antiBot');
      expect(premiumIds).toContain('followVerification');
    });

    it('should have unique ids', () => {
      const ids = FILTER_SECTIONS.map((s) => s.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  describe('TIER_COLORS', () => {
    it('should have colors for all tiers', () => {
      const tiers: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
      tiers.forEach((tier) => {
        expect(TIER_COLORS[tier]).toBeDefined();
        expect(TIER_COLORS[tier]).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should have distinct colors', () => {
      const colors = Object.values(TIER_COLORS);
      const uniqueColors = [...new Set(colors)];
      expect(colors.length).toBe(uniqueColors.length);
    });
  });

  describe('TIER_LABELS', () => {
    it('should have labels for all tiers', () => {
      const tiers: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
      tiers.forEach((tier) => {
        expect(TIER_LABELS[tier]).toBeDefined();
        expect(typeof TIER_LABELS[tier]).toBe('string');
        expect(TIER_LABELS[tier].length).toBeGreaterThan(0);
      });
    });
  });

  describe('Type Guards', () => {
    it('should accept valid SupportedPlatform values', () => {
      const validPlatforms: SupportedPlatform[] = [
        'instagram',
        'tiktok',
        'youtube',
        'twitter',
        'facebook',
        'csv',
        'unknown',
      ];
      
      validPlatforms.forEach((platform) => {
        expect(typeof platform).toBe('string');
      });
    });

    it('should accept valid FilterCategory values', () => {
      const validCategories: FilterCategory[] = [
        'participation',
        'mentions',
        'keywords',
        'multiComment',
        'profile',
        'antiBot',
        'followVerification',
      ];
      
      validCategories.forEach((category) => {
        expect(typeof category).toBe('string');
      });
    });

    it('should accept valid FilterTier values', () => {
      const validTiers: FilterTier[] = ['free', 'basic', 'premium', 'enterprise'];
      
      validTiers.forEach((tier) => {
        expect(typeof tier).toBe('string');
      });
    });
  });
});

describe('Filter Immutability', () => {
  it('DEFAULT_FILTERS should not be mutated', () => {
    const original = JSON.stringify(DEFAULT_FILTERS);
    
    // Attempt to modify (this should be caught by TypeScript in real code)
    const copy = { ...DEFAULT_FILTERS };
    copy.mentions = { ...copy.mentions, minMentions: 5 };
    
    // Original should be unchanged
    expect(JSON.stringify(DEFAULT_FILTERS)).toBe(original);
  });
});
