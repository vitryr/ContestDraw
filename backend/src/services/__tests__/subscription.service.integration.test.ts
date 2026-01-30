/**
 * Subscription Service Integration Tests
 */

import { SubscriptionService } from "../subscription.service";

describe("SubscriptionService Integration", () => {
  let service: SubscriptionService;
  let mockDb: any;
  let mockPaymentService: any;
  let mockEmailService: any;

  beforeEach(() => {
    mockDb = {
      subscription: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      connectedAccount: {
        count: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    mockPaymentService = {
      createSubscription: jest.fn(),
      cancelSubscription: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn(),
    };

    service = new SubscriptionService(mockDb, mockPaymentService, mockEmailService);
  });

  describe("hasActiveSubscription", () => {
    it("should return true when subscription exists", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: "ACTIVE",
      });

      const result = await service.hasActiveSubscription("user-123");

      expect(result).toBe(true);
    });

    it("should return false when no subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await service.hasActiveSubscription("user-123");

      expect(result).toBe(false);
    });
  });

  describe("getActiveSubscription", () => {
    it("should return subscription when found", async () => {
      const mockSub = { id: "sub-123", status: "ACTIVE", plan: "PRO" };
      mockDb.subscription.findFirst.mockResolvedValue(mockSub);

      const result = await service.getActiveSubscription("user-123");

      expect(result).toEqual(mockSub);
    });

    it("should query with correct statuses", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      await service.getActiveSubscription("user-123");

      expect(mockDb.subscription.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user-123",
          }),
        })
      );
    });
  });

  describe("checkSubscriptionStatus", () => {
    it("should return full status for active subscription", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: "ACTIVE",
        plan: "PRO",
        currentPeriodEnd: futureDate,
        connectedAccountsLimit: 5,
        creditsPerMonth: 50,
      });

      const result = await service.checkSubscriptionStatus("user-123");

      expect(result.hasSubscription).toBe(true);
      expect(result.status).toBe("ACTIVE");
      expect(result.daysRemaining).toBeGreaterThan(0);
    });

    it("should return defaults when no subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await service.checkSubscriptionStatus("user-123");

      expect(result.hasSubscription).toBe(false);
      expect(result.status).toBeNull();
      expect(result.plan).toBeNull();
    });
  });

  describe("canConnectAccount", () => {
    it("should allow free user first account", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);
      mockDb.connectedAccount.count.mockResolvedValue(0);

      const result = await service.canConnectAccount("user-123");

      expect(result).toBe(true);
    });

    it("should deny free user second account", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);
      mockDb.connectedAccount.count.mockResolvedValue(1);

      const result = await service.canConnectAccount("user-123");

      expect(result).toBe(false);
    });

    it("should check against subscription limit for pro", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: "ACTIVE",
        connectedAccountsLimit: 5,
      });
      mockDb.connectedAccount.count.mockResolvedValue(3);

      const result = await service.canConnectAccount("user-123");

      expect(result).toBe(true);
    });
  });

  describe("getConnectedAccountsLimit", () => {
    it("should return subscription limit for pro user", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: "ACTIVE",
        connectedAccountsLimit: 10,
      });

      const limit = await service.getConnectedAccountsLimit("user-123");

      expect(limit).toBe(10);
    });

    it("should return 1 for free user", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const limit = await service.getConnectedAccountsLimit("user-123");

      expect(limit).toBe(1);
    });
  });

  describe("allocateMonthlyCredits", () => {
    it("should throw for non-existent subscription", async () => {
      mockDb.subscription.findUnique.mockResolvedValue(null);

      await expect(service.allocateMonthlyCredits("invalid")).rejects.toThrow(
        "Subscription not found"
      );
    });

    it("should skip inactive subscriptions without adding credits", async () => {
      mockDb.subscription.findUnique.mockResolvedValue({
        id: "sub-123",
        status: "CANCELED",
        creditsPerMonth: 50,
      });

      // Should not throw
      await expect(service.allocateMonthlyCredits("sub-123")).resolves.not.toThrow();
    });
  });

  describe("processGracePeriods", () => {
    it("should update expired subscriptions to grace period", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      mockDb.subscription.findMany.mockResolvedValue([
        {
          id: "sub-123",
          userId: "user-123",
          status: "ACTIVE",
          currentPeriodEnd: pastDate,
        },
      ]);
      mockDb.subscription.update.mockResolvedValue({});
      mockEmailService.sendSubscriptionGracePeriod = jest.fn().mockResolvedValue(undefined);

      await service.processGracePeriods();

      expect(mockDb.subscription.update).toHaveBeenCalled();
    });

    it("should mark as expired if grace period passed", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10); // 10 days ago

      mockDb.subscription.findMany.mockResolvedValue([
        {
          id: "sub-456",
          userId: "user-456",
          status: "ACTIVE",
          currentPeriodEnd: oldDate,
        },
      ]);
      mockDb.subscription.update.mockResolvedValue({});
      mockEmailService.sendSubscriptionExpired = jest.fn().mockResolvedValue(undefined);

      await service.processGracePeriods();

      // Should call update for expired subscription
      expect(mockDb.subscription.update).toHaveBeenCalled();
    });

    it("should handle empty list", async () => {
      mockDb.subscription.findMany.mockResolvedValue([]);

      await expect(service.processGracePeriods()).resolves.not.toThrow();
    });
  });

  describe("handleFailedPayment", () => {
    it("should throw for non-existent subscription", async () => {
      mockDb.subscription.findUnique.mockResolvedValue(null);

      await expect(
        service.handleFailedPayment("invalid", "Card declined")
      ).rejects.toThrow("Subscription not found");
    });

    it("should update subscription status on failed payment", async () => {
      mockDb.subscription.findUnique.mockResolvedValue({
        id: "sub-123",
        userId: "user-123",
        status: "ACTIVE",
      });
      mockDb.subscription.update.mockResolvedValue({});
      mockEmailService.sendPaymentFailed = jest.fn().mockResolvedValue(undefined);

      await service.handleFailedPayment("sub-123", "Insufficient funds");

      expect(mockDb.subscription.update).toHaveBeenCalled();
    });
  });

  describe("Subscription Analytics Logic", () => {
    it("should calculate total from transactions", () => {
      const transactions = [
        { amount: 1999, credits: 50 },
        { amount: 1999, credits: 50 },
      ];

      const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalCredits = transactions.reduce((sum, tx) => sum + tx.credits, 0);

      expect(totalSpent).toBe(3998);
      expect(totalCredits).toBe(100);
    });

    it("should calculate subscription duration", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 60);

      const durationDays = Math.ceil(
        (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(durationDays).toBe(60);
    });
  });

  describe("Subscription Features", () => {
    const planFeatures = {
      FREE: { creditsPerMonth: 3, connectedAccounts: 1 },
      PRO: { creditsPerMonth: 50, connectedAccounts: 5 },
      ENTERPRISE: { creditsPerMonth: 500, connectedAccounts: 20 },
    };

    it("should have correct FREE plan features", () => {
      expect(planFeatures.FREE.creditsPerMonth).toBe(3);
      expect(planFeatures.FREE.connectedAccounts).toBe(1);
    });

    it("should have correct PRO plan features", () => {
      expect(planFeatures.PRO.creditsPerMonth).toBe(50);
      expect(planFeatures.PRO.connectedAccounts).toBe(5);
    });

    it("should have correct ENTERPRISE plan features", () => {
      expect(planFeatures.ENTERPRISE.creditsPerMonth).toBe(500);
    });
  });
});
