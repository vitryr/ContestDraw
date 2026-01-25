/**
 * Draw Service Tests - Free Trial Feature
 */

import { DrawService } from '../../src/services/draw.service';

describe('DrawService - Free Trial', () => {
  let drawService: DrawService;
  let mockDb: any;

  beforeEach(() => {
    drawService = new DrawService();

    mockDb = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn()
      }
    };
  });

  describe('checkFreeTrialEligibility', () => {
    it('should allow trial for eligible user with valid participant count', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: false
      });

      mockDb.user.update.mockResolvedValue({});

      const result = await drawService.checkFreeTrialEligibility('user-123', 150, mockDb);

      expect(result.canUseTrial).toBe(true);
      expect(mockDb.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { trial_used: true }
      });
    });

    it('should reject trial if already used', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: true
      });

      await expect(
        drawService.checkFreeTrialEligibility('user-123', 150, mockDb)
      ).rejects.toThrow('Free trial already used');
    });

    it('should reject trial with less than 100 participants', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: false
      });

      await expect(
        drawService.checkFreeTrialEligibility('user-123', 50, mockDb)
      ).rejects.toThrow('Free trial requires at least 100 participants');
    });

    it('should reject trial with more than 200 participants', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: false
      });

      await expect(
        drawService.checkFreeTrialEligibility('user-123', 250, mockDb)
      ).rejects.toThrow('Free trial limited to 200 participants');
    });

    it('should skip trial if user has credits', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 5,
        trial_used: false
      });

      const result = await drawService.checkFreeTrialEligibility('user-123', 150, mockDb);

      expect(result.canUseTrial).toBe(false);
      expect(result.reason).toBe('User has credits available');
      expect(mockDb.user.update).not.toHaveBeenCalled();
    });
  });

  describe('canPerformDraw', () => {
    it('should allow draw with active 48h pass', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: true
      });

      const mockSubscriptionService = {
        allowsUnlimitedDraws: jest.fn().mockResolvedValue(true)
      };

      const result = await drawService.canPerformDraw('user-123', mockDb, mockSubscriptionService);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('48h pass active - unlimited draws');
    });

    it('should allow draw with available credits', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 5,
        trial_used: false
      });

      const result = await drawService.canPerformDraw('user-123', mockDb);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('Credits available');
    });

    it('should allow trial for eligible user', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: false
      });

      const mockSubscriptionService = {
        allowsUnlimitedDraws: jest.fn().mockResolvedValue(false)
      };

      const result = await drawService.canPerformDraw('user-123', mockDb, mockSubscriptionService);

      expect(result.allowed).toBe(true);
      expect(result.useTrial).toBe(true);
      expect(result.reason).toBe('Free trial available (100-200 participants)');
    });

    it('should reject if no credits and trial used', async () => {
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user-123',
        credits: 0,
        trial_used: true
      });

      const mockSubscriptionService = {
        allowsUnlimitedDraws: jest.fn().mockResolvedValue(false)
      };

      const result = await drawService.canPerformDraw('user-123', mockDb, mockSubscriptionService);

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('No credits available and trial already used');
    });
  });
});
