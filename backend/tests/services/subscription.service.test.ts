/**
 * Subscription Service Tests - 48h Pass Feature
 */

import { SubscriptionService } from '../../src/services/subscription.service';
import { SubscriptionPlan, SubscriptionStatus } from '../../src/types/payment.types';

describe('SubscriptionService - 48h Pass', () => {
  let subscriptionService: SubscriptionService;
  let mockDb: any;
  let mockPaymentService: any;
  let mockEmailService: any;

  beforeEach(() => {
    // Mock database
    mockDb = {
      subscription: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
      }
    };

    mockPaymentService = {};
    mockEmailService = {
      send48HPassExpired: jest.fn()
    };

    subscriptionService = new SubscriptionService(mockDb, mockPaymentService, mockEmailService);
  });

  describe('hasActive48HPass', () => {
    it('should return true for active 48h pass', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

      mockDb.subscription.findFirst.mockResolvedValue({
        id: 'sub-123',
        userId: 'user-123',
        plan: SubscriptionPlan.PASS_48H,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: futureDate
      });

      const result = await subscriptionService.hasActive48HPass('user-123');

      expect(result).toBe(true);
      expect(mockDb.subscription.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          plan: SubscriptionPlan.PASS_48H,
          status: {
            in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]
          },
          currentPeriodEnd: {
            gte: expect.any(Date)
          }
        }
      });
    });

    it('should return false for expired 48h pass', async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await subscriptionService.hasActive48HPass('user-123');

      expect(result).toBe(false);
    });

    it('should return false when no subscription exists', async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await subscriptionService.hasActive48HPass('user-123');

      expect(result).toBe(false);
    });
  });

  describe('processExpired48HPasses', () => {
    it('should expire passes that have ended', async () => {
      const pastDate = new Date(Date.now() - 1000);
      const expiredPasses = [
        {
          id: 'sub-123',
          userId: 'user-123',
          plan: SubscriptionPlan.PASS_48H,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: pastDate
        },
        {
          id: 'sub-456',
          userId: 'user-456',
          plan: SubscriptionPlan.PASS_48H,
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: pastDate
        }
      ];

      mockDb.subscription.findMany.mockResolvedValue(expiredPasses);
      mockDb.subscription.update.mockResolvedValue({});

      await subscriptionService.processExpired48HPasses();

      expect(mockDb.subscription.findMany).toHaveBeenCalledWith({
        where: {
          plan: SubscriptionPlan.PASS_48H,
          status: {
            in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]
          },
          currentPeriodEnd: {
            lt: expect.any(Date)
          }
        }
      });

      expect(mockDb.subscription.update).toHaveBeenCalledTimes(2);
      expect(mockDb.subscription.update).toHaveBeenCalledWith({
        where: { id: 'sub-123' },
        data: {
          status: SubscriptionStatus.EXPIRED,
          updatedAt: expect.any(Date)
        }
      });

      expect(mockEmailService.send48HPassExpired).toHaveBeenCalledTimes(2);
    });

    it('should not process active passes', async () => {
      mockDb.subscription.findMany.mockResolvedValue([]);

      await subscriptionService.processExpired48HPasses();

      expect(mockDb.subscription.update).not.toHaveBeenCalled();
      expect(mockEmailService.send48HPassExpired).not.toHaveBeenCalled();
    });
  });

  describe('allowsUnlimitedDraws', () => {
    it('should return true when user has active 48h pass', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      mockDb.subscription.findFirst.mockResolvedValue({
        id: 'sub-123',
        userId: 'user-123',
        plan: SubscriptionPlan.PASS_48H,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: futureDate
      });

      const result = await subscriptionService.allowsUnlimitedDraws('user-123');

      expect(result).toBe(true);
    });

    it('should return false when no active pass', async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await subscriptionService.allowsUnlimitedDraws('user-123');

      expect(result).toBe(false);
    });
  });

  describe('getSubscriptionFeatures', () => {
    it('should return correct features for 48h pass', () => {
      const features = subscriptionService.getSubscriptionFeatures(SubscriptionPlan.PASS_48H);

      expect(features).toEqual({
        creditsPerMonth: 0,
        connectedAccounts: 1,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        unlimitedDraws: true,
        duration: '48 hours'
      });
    });

    it('should return correct features for monthly plan', () => {
      const features = subscriptionService.getSubscriptionFeatures(SubscriptionPlan.MONTHLY);

      expect(features).toEqual({
        creditsPerMonth: 10,
        connectedAccounts: 3,
        prioritySupport: false,
        advancedAnalytics: true,
        apiAccess: false
      });
    });
  });
});
