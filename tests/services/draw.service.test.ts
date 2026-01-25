/**
 * Draw Service Tests
 * Comprehensive unit tests for the draw engine
 */

import { DrawService } from '../../backend/src/services/draw.service';
import { DrawConfig, DrawFilters, Participant } from '../../backend/src/types/draw.types';

describe('DrawService', () => {
  let drawService: DrawService;

  beforeEach(() => {
    drawService = new DrawService();
  });

  describe('validateDrawConfig', () => {
    it('should validate valid configuration', () => {
      const config: DrawConfig = {
        drawId: 'test-draw-1',
        winnersCount: 3,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: 5,
          minMentions: 1,
          verifyFollowing: false
        }
      };

      const result = drawService.validateDrawConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty draw ID', () => {
      const config: DrawConfig = {
        drawId: '',
        winnersCount: 3,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        }
      };

      const result = drawService.validateDrawConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Draw ID is required');
    });

    it('should reject invalid winners count', () => {
      const config: DrawConfig = {
        drawId: 'test-draw',
        winnersCount: 0,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        }
      };

      const result = drawService.validateDrawConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Winners count must be at least 1');
    });

    it('should reject negative alternates count', () => {
      const config: DrawConfig = {
        drawId: 'test-draw',
        winnersCount: 3,
        alternatesCount: -1,
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: false
        }
      };

      const result = drawService.validateDrawConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Alternates count cannot be negative');
    });

    it('should require following accounts when verifyFollowing is enabled', () => {
      const config: DrawConfig = {
        drawId: 'test-draw',
        winnersCount: 3,
        alternatesCount: 2,
        filters: {
          removeDuplicates: true,
          maxEntriesPerUser: null,
          minMentions: 0,
          verifyFollowing: true,
          followingAccounts: []
        }
      };

      const result = drawService.validateDrawConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Following accounts must be specified when verifyFollowing is enabled');
    });
  });

  describe('Filter Tests', () => {
    const mockParticipants: Participant[] = [
      {
        id: '1',
        username: 'user1',
        comment: 'Great giveaway! @brand #contest',
        timestamp: new Date(),
        mentions: ['brand'],
        hashtags: ['contest']
      },
      {
        id: '2',
        username: 'user1', // Duplicate
        comment: 'Another entry @brand @friend #contest',
        timestamp: new Date(),
        mentions: ['brand', 'friend'],
        hashtags: ['contest']
      },
      {
        id: '3',
        username: 'user2',
        comment: 'I want to win! #giveaway',
        timestamp: new Date(),
        mentions: [],
        hashtags: ['giveaway']
      },
      {
        id: '4',
        username: 'user3',
        comment: 'Amazing product @brand @sponsor #contest',
        timestamp: new Date(),
        mentions: ['brand', 'sponsor'],
        hashtags: ['contest']
      },
      {
        id: '5',
        username: 'blacklisted_user',
        comment: 'Entry @brand #contest',
        timestamp: new Date(),
        mentions: ['brand'],
        hashtags: ['contest']
      }
    ];

    it('should remove duplicates', async () => {
      const filters: DrawFilters = {
        removeDuplicates: true,
        maxEntriesPerUser: null,
        minMentions: 0,
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.length).toBe(4); // user1 appears only once
      expect(result.filter(p => p.username === 'user1').length).toBe(1);
    });

    it('should apply entries limit per user', async () => {
      const participantsWithMultipleEntries: Participant[] = [
        ...mockParticipants,
        {
          id: '6',
          username: 'user2',
          comment: 'Second entry',
          timestamp: new Date(),
          mentions: [],
          hashtags: []
        },
        {
          id: '7',
          username: 'user2',
          comment: 'Third entry',
          timestamp: new Date(),
          mentions: [],
          hashtags: []
        }
      ];

      const filters: DrawFilters = {
        removeDuplicates: false,
        maxEntriesPerUser: 2,
        minMentions: 0,
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(participantsWithMultipleEntries, filters);
      const user2Entries = result.filter(p => p.username === 'user2');
      expect(user2Entries.length).toBe(2);
    });

    it('should filter by minimum mentions', async () => {
      const filters: DrawFilters = {
        removeDuplicates: false,
        maxEntriesPerUser: null,
        minMentions: 2,
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.every(p => p.mentions.length >= 2)).toBe(true);
    });

    it('should filter by required hashtag', async () => {
      const filters: DrawFilters = {
        removeDuplicates: false,
        maxEntriesPerUser: null,
        minMentions: 0,
        requiredHashtag: '#contest',
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.every(p => p.hashtags.includes('contest'))).toBe(true);
    });

    it('should filter by required keywords', async () => {
      const filters: DrawFilters = {
        removeDuplicates: false,
        maxEntriesPerUser: null,
        minMentions: 0,
        requiredKeywords: ['giveaway', 'contest'],
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.every(p =>
        p.comment.toLowerCase().includes('giveaway') ||
        p.hashtags.some(h => h.toLowerCase() === 'contest')
      )).toBe(true);
    });

    it('should apply blacklist', async () => {
      const filters: DrawFilters = {
        removeDuplicates: false,
        maxEntriesPerUser: null,
        minMentions: 0,
        blacklist: ['blacklisted_user'],
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.find(p => p.username === 'blacklisted_user')).toBeUndefined();
    });

    it('should handle multiple filters simultaneously', async () => {
      const filters: DrawFilters = {
        removeDuplicates: true,
        maxEntriesPerUser: 1,
        minMentions: 1,
        requiredHashtag: '#contest',
        blacklist: ['blacklisted_user'],
        verifyFollowing: false
      };

      const result = await drawService.processParticipants(mockParticipants, filters);
      expect(result.length).toBe(2); // user1 and user3 meet all criteria
      expect(result.every(p => p.mentions.length >= 1)).toBe(true);
      expect(result.every(p => p.hashtags.includes('contest'))).toBe(true);
      expect(result.find(p => p.username === 'blacklisted_user')).toBeUndefined();
    });
  });

  describe('selectWinners', () => {
    const mockParticipants: Participant[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      username: `user${i + 1}`,
      comment: `Comment ${i + 1}`,
      timestamp: new Date(),
      mentions: [],
      hashtags: []
    }));

    it('should select correct number of winners and alternates', () => {
      const { winners, alternates } = drawService.selectWinners(mockParticipants, 3, 2);

      expect(winners.length).toBe(3);
      expect(alternates.length).toBe(2);
      expect(winners[0].position).toBe(1);
      expect(winners[1].position).toBe(2);
      expect(winners[2].position).toBe(3);
    });

    it('should not select duplicate winners', () => {
      const { winners, alternates } = drawService.selectWinners(mockParticipants, 3, 2);

      const allSelected = [...winners, ...alternates];
      const usernames = allSelected.map(w => w.participant.username);
      const uniqueUsernames = new Set(usernames);

      expect(usernames.length).toBe(uniqueUsernames.size);
    });

    it('should throw error when not enough participants', () => {
      expect(() => {
        drawService.selectWinners(mockParticipants, 8, 5); // Need 13 but only have 10
      }).toThrow('Not enough participants');
    });

    it('should generate unique seeds for each winner', () => {
      const { winners, alternates } = drawService.selectWinners(mockParticipants, 3, 2);

      const allSelected = [...winners, ...alternates];
      const seeds = allSelected.map(w => w.seed);
      const uniqueSeeds = new Set(seeds);

      expect(seeds.length).toBe(uniqueSeeds.size);
    });
  });

  describe('validateWinnerEligibility', () => {
    it('should validate eligible winners', () => {
      const winners = [
        {
          participant: {
            id: '1',
            username: 'user1',
            comment: 'Great @brand #contest',
            timestamp: new Date(),
            mentions: ['brand'],
            hashtags: ['contest']
          },
          position: 1,
          selectedAt: new Date(),
          seed: 'test-seed'
        }
      ];

      const filters: DrawFilters = {
        removeDuplicates: true,
        maxEntriesPerUser: null,
        minMentions: 1,
        requiredHashtag: '#contest',
        verifyFollowing: false
      };

      const result = drawService.validateWinnerEligibility(winners, filters);
      expect(result.valid).toBe(true);
    });

    it('should detect winners in blacklist', () => {
      const winners = [
        {
          participant: {
            id: '1',
            username: 'blacklisted_user',
            comment: 'Entry',
            timestamp: new Date(),
            mentions: [],
            hashtags: []
          },
          position: 1,
          selectedAt: new Date(),
          seed: 'test-seed'
        }
      ];

      const filters: DrawFilters = {
        removeDuplicates: true,
        maxEntriesPerUser: null,
        minMentions: 0,
        blacklist: ['blacklisted_user'],
        verifyFollowing: false
      };

      const result = drawService.validateWinnerEligibility(winners, filters);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('is in blacklist');
    });
  });

  describe('Performance Tests', () => {
    it('should handle 50k+ participants efficiently', async () => {
      const largeParticipantSet: Participant[] = Array.from({ length: 50000 }, (_, i) => ({
        id: `${i + 1}`,
        username: `user${i + 1}`,
        comment: `Entry ${i + 1} @brand #contest`,
        timestamp: new Date(),
        mentions: ['brand'],
        hashtags: ['contest']
      }));

      const filters: DrawFilters = {
        removeDuplicates: true,
        maxEntriesPerUser: null,
        minMentions: 1,
        requiredHashtag: '#contest',
        verifyFollowing: false
      };

      const startTime = Date.now();
      const result = await drawService.processParticipants(largeParticipantSet, filters);
      const duration = Date.now() - startTime;

      expect(result.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    }, 10000);
  });
});
