import { DrawService } from '@/services/draw.service';
import { PrismaClient } from '@prisma/client';
import { TestFactories } from '@tests/utils/test-factories';

describe('DrawService', () => {
  let drawService: DrawService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    drawService = new DrawService(mockPrisma);
  });

  describe('createDraw', () => {
    it('should create a new draw with valid data', async () => {
      const drawData = {
        userId: '123',
        title: 'Instagram Giveaway',
        description: 'Win amazing prizes!',
        instagramPostUrl: 'https://instagram.com/p/abc123',
        winnerCount: 3,
        filters: {
          requireLike: true,
          requireComment: true,
          requireFollow: false,
        },
      };

      const mockDraw = TestFactories.createDraw(drawData);
      (mockPrisma.draw.create as jest.Mock).mockResolvedValue(mockDraw);

      const result = await drawService.createDraw(drawData);

      expect(mockPrisma.draw.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: drawData.userId,
          title: drawData.title,
          status: 'pending',
        }),
      });
      expect(result).toEqual(mockDraw);
    });

    it('should validate Instagram URL format', async () => {
      const invalidUrlData = {
        userId: '123',
        title: 'Test Draw',
        instagramPostUrl: 'invalid-url',
        winnerCount: 1,
      };

      await expect(drawService.createDraw(invalidUrlData)).rejects.toThrow(
        'Invalid Instagram post URL'
      );
    });

    it('should enforce minimum winner count', async () => {
      const invalidWinnerCount = {
        userId: '123',
        title: 'Test Draw',
        instagramPostUrl: 'https://instagram.com/p/abc123',
        winnerCount: 0,
      };

      await expect(drawService.createDraw(invalidWinnerCount)).rejects.toThrow(
        'Winner count must be at least 1'
      );
    });
  });

  describe('executeDrawWithFilters', () => {
    it('should filter and select winners based on criteria', async () => {
      const drawId = '123';
      const participants = TestFactories.createMultiple(
        () => TestFactories.createParticipant({ drawId }),
        50
      );

      // Create mock participants with different eligibility
      const eligibleParticipants = participants.slice(0, 30).map((p) => ({
        ...p,
        hasLiked: true,
        hasCommented: true,
        isEligible: true,
      }));

      const ineligibleParticipants = participants.slice(30).map((p) => ({
        ...p,
        hasLiked: false,
        isEligible: false,
      }));

      const mockDraw = TestFactories.createDraw({
        id: drawId,
        winnerCount: 3,
        filters: { requireLike: true, requireComment: true },
      });

      (mockPrisma.draw.findUnique as jest.Mock).mockResolvedValue(mockDraw);
      (mockPrisma.participant.findMany as jest.Mock).mockResolvedValue([
        ...eligibleParticipants,
        ...ineligibleParticipants,
      ]);
      (mockPrisma.winner.createMany as jest.Mock).mockResolvedValue({ count: 3 });

      const winners = await drawService.executeDrawWithFilters(drawId);

      expect(winners).toHaveLength(3);
      expect(winners.every((w) => w.isEligible)).toBe(true);
    });

    it('should handle insufficient eligible participants', async () => {
      const drawId = '123';
      const mockDraw = TestFactories.createDraw({ id: drawId, winnerCount: 5 });
      const participants = TestFactories.createMultiple(
        () => TestFactories.createParticipant({ drawId, isEligible: true }),
        2
      );

      (mockPrisma.draw.findUnique as jest.Mock).mockResolvedValue(mockDraw);
      (mockPrisma.participant.findMany as jest.Mock).mockResolvedValue(
        participants
      );

      await expect(drawService.executeDrawWithFilters(drawId)).rejects.toThrow(
        'Not enough eligible participants'
      );
    });

    it('should ensure random and fair winner selection', async () => {
      const drawId = '123';
      const participants = TestFactories.createMultiple(
        () => TestFactories.createParticipant({ drawId, isEligible: true }),
        100
      );

      const mockDraw = TestFactories.createDraw({ id: drawId, winnerCount: 10 });
      (mockPrisma.draw.findUnique as jest.Mock).mockResolvedValue(mockDraw);
      (mockPrisma.participant.findMany as jest.Mock).mockResolvedValue(
        participants
      );

      const winners = await drawService.executeDrawWithFilters(drawId);

      // Check uniqueness
      const uniqueWinnerIds = new Set(winners.map((w) => w.id));
      expect(uniqueWinnerIds.size).toBe(10);

      // Verify all winners are from participant pool
      const participantIds = new Set(participants.map((p) => p.id));
      expect(winners.every((w) => participantIds.has(w.participantId))).toBe(
        true
      );
    });
  });

  describe('applyFilters', () => {
    it('should filter participants requiring likes', () => {
      const participants = [
        TestFactories.createParticipant({ hasLiked: true }),
        TestFactories.createParticipant({ hasLiked: false }),
      ];

      const filtered = drawService.applyFilters(participants, {
        requireLike: true,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].hasLiked).toBe(true);
    });

    it('should filter participants requiring comments', () => {
      const participants = [
        TestFactories.createParticipant({ hasCommented: true }),
        TestFactories.createParticipant({ hasCommented: false }),
      ];

      const filtered = drawService.applyFilters(participants, {
        requireComment: true,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].hasCommented).toBe(true);
    });

    it('should filter participants requiring follow', () => {
      const participants = [
        TestFactories.createParticipant({ followsAccount: true }),
        TestFactories.createParticipant({ followsAccount: false }),
      ];

      const filtered = drawService.applyFilters(participants, {
        requireFollow: true,
      });

      expect(filtered).toHaveLength(1);
      expect(filtered[0].followsAccount).toBe(true);
    });

    it('should apply multiple filters simultaneously', () => {
      const participants = [
        TestFactories.createParticipant({
          hasLiked: true,
          hasCommented: true,
          followsAccount: true,
        }),
        TestFactories.createParticipant({
          hasLiked: true,
          hasCommented: false,
          followsAccount: true,
        }),
        TestFactories.createParticipant({
          hasLiked: false,
          hasCommented: true,
          followsAccount: true,
        }),
      ];

      const filtered = drawService.applyFilters(participants, {
        requireLike: true,
        requireComment: true,
        requireFollow: true,
      });

      expect(filtered).toHaveLength(1);
    });
  });

  describe('getDraw', () => {
    it('should retrieve draw with participants and winners', async () => {
      const drawId = '123';
      const mockDraw = TestFactories.createDraw({ id: drawId });

      (mockPrisma.draw.findUnique as jest.Mock).mockResolvedValue({
        ...mockDraw,
        participants: [],
        winners: [],
      });

      const result = await drawService.getDraw(drawId);

      expect(mockPrisma.draw.findUnique).toHaveBeenCalledWith({
        where: { id: drawId },
        include: {
          participants: true,
          winners: true,
        },
      });
      expect(result).toEqual(expect.objectContaining(mockDraw));
    });
  });
});
