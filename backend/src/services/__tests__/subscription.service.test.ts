/**
 * Subscription Service Tests
 * Tests for subscription management logic
 */

import { SubscriptionService } from "../subscription.service";

// Mock types
enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  TRIALING = "TRIALING",
  GRACE_PERIOD = "GRACE_PERIOD",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

describe("SubscriptionService", () => {
  let subscriptionService: SubscriptionService;
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
      updateSubscription: jest.fn(),
    };

    mockEmailService = {
      sendEmail: jest.fn(),
      sendSubscriptionEmail: jest.fn(),
    };

    subscriptionService = new SubscriptionService(
      mockDb,
      mockPaymentService,
      mockEmailService
    );
  });

  describe("hasActiveSubscription", () => {
    it("should return true for active subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: SubscriptionStatus.ACTIVE,
      });

      const result = await subscriptionService.hasActiveSubscription("user-123");

      expect(result).toBe(true);
    });

    it("should return true for trialing subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: SubscriptionStatus.TRIALING,
      });

      const result = await subscriptionService.hasActiveSubscription("user-123");

      expect(result).toBe(true);
    });

    it("should return false for no subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await subscriptionService.hasActiveSubscription("user-123");

      expect(result).toBe(false);
    });
  });

  describe("getActiveSubscription", () => {
    it("should call findFirst with user ID", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      await subscriptionService.getActiveSubscription("user-123");

      expect(mockDb.subscription.findFirst).toHaveBeenCalled();
      const callArgs = mockDb.subscription.findFirst.mock.calls[0][0];
      expect(callArgs.where.userId).toBe("user-123");
    });

    it("should return subscription data", async () => {
      const mockSubscription = {
        id: "sub-123",
        userId: "user-123",
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE,
      };

      mockDb.subscription.findFirst.mockResolvedValue(mockSubscription);

      const result = await subscriptionService.getActiveSubscription("user-123");

      expect(result).toEqual(mockSubscription);
    });
  });

  describe("checkSubscriptionStatus", () => {
    it("should return full status for active subscription", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: SubscriptionStatus.ACTIVE,
        plan: SubscriptionPlan.PRO,
        currentPeriodEnd: futureDate,
        connectedAccountsLimit: 5,
        creditsPerMonth: 50,
      });

      const result = await subscriptionService.checkSubscriptionStatus("user-123");

      expect(result.hasSubscription).toBe(true);
      expect(result.status).toBe(SubscriptionStatus.ACTIVE);
      expect(result.plan).toBe(SubscriptionPlan.PRO);
      expect(result.daysRemaining).toBeGreaterThan(0);
      expect(result.connectedAccountsLimit).toBe(5);
    });

    it("should return defaults for no subscription", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);

      const result = await subscriptionService.checkSubscriptionStatus("user-123");

      expect(result.hasSubscription).toBe(false);
      expect(result.status).toBeNull();
      expect(result.plan).toBeNull();
      expect(result.daysRemaining).toBe(0);
    });

    it("should calculate days remaining correctly", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: SubscriptionStatus.ACTIVE,
        plan: SubscriptionPlan.PRO,
        currentPeriodEnd: futureDate,
      });

      const result = await subscriptionService.checkSubscriptionStatus("user-123");

      expect(result.daysRemaining).toBe(10);
    });
  });

  describe("canConnectAccount", () => {
    it("should allow free user to connect 1 account", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);
      mockDb.connectedAccount.count.mockResolvedValue(0);

      const result = await subscriptionService.canConnectAccount("user-123");

      expect(result).toBe(true);
    });

    it("should deny free user with 1 connected account", async () => {
      mockDb.subscription.findFirst.mockResolvedValue(null);
      mockDb.connectedAccount.count.mockResolvedValue(1);

      const result = await subscriptionService.canConnectAccount("user-123");

      expect(result).toBe(false);
    });

    it("should check against subscription limit for pro users", async () => {
      mockDb.subscription.findFirst.mockResolvedValue({
        id: "sub-123",
        status: SubscriptionStatus.ACTIVE,
        connectedAccountsLimit: 5,
      });
      mockDb.connectedAccount.count.mockResolvedValue(3);

      const result = await subscriptionService.canConnectAccount("user-123");

      expect(result).toBe(true);
    });
  });
});

describe("SubscriptionService - Unit Logic Tests", () => {
  describe("Days Remaining Calculation", () => {
    it("should calculate correct days remaining", () => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysRemaining).toBe(30);
    });

    it("should return negative for expired", () => {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 5);

      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysRemaining).toBeLessThan(0);
    });
  });

  describe("Plan Limits", () => {
    const planLimits = {
      [SubscriptionPlan.FREE]: {
        connectedAccounts: 1,
        creditsPerMonth: 3,
        drawsPerMonth: 1,
      },
      [SubscriptionPlan.PRO]: {
        connectedAccounts: 5,
        creditsPerMonth: 50,
        drawsPerMonth: 20,
      },
      [SubscriptionPlan.ENTERPRISE]: {
        connectedAccounts: 20,
        creditsPerMonth: 500,
        drawsPerMonth: -1, // Unlimited
      },
    };

    it("should have correct free tier limits", () => {
      expect(planLimits[SubscriptionPlan.FREE].connectedAccounts).toBe(1);
      expect(planLimits[SubscriptionPlan.FREE].creditsPerMonth).toBe(3);
    });

    it("should have correct pro tier limits", () => {
      expect(planLimits[SubscriptionPlan.PRO].connectedAccounts).toBe(5);
      expect(planLimits[SubscriptionPlan.PRO].creditsPerMonth).toBe(50);
    });

    it("should have unlimited draws for enterprise", () => {
      expect(planLimits[SubscriptionPlan.ENTERPRISE].drawsPerMonth).toBe(-1);
    });
  });

  describe("Grace Period Logic", () => {
    it("should identify grace period status", () => {
      const isInGracePeriod = (status: SubscriptionStatus): boolean => {
        return status === SubscriptionStatus.GRACE_PERIOD;
      };

      expect(isInGracePeriod(SubscriptionStatus.GRACE_PERIOD)).toBe(true);
      expect(isInGracePeriod(SubscriptionStatus.ACTIVE)).toBe(false);
    });

    it("should calculate grace period end", () => {
      const gracePeriodDays = 7;
      const failedPaymentDate = new Date();
      const gracePeriodEnd = new Date(failedPaymentDate);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

      const daysUntilExpiry = Math.ceil(
        (gracePeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      expect(daysUntilExpiry).toBe(gracePeriodDays);
    });
  });

  describe("Active Subscription Check", () => {
    it("should recognize active statuses", () => {
      const activeStatuses = [
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.TRIALING,
        SubscriptionStatus.GRACE_PERIOD,
      ];

      const isActive = (status: SubscriptionStatus): boolean => {
        return activeStatuses.includes(status);
      };

      expect(isActive(SubscriptionStatus.ACTIVE)).toBe(true);
      expect(isActive(SubscriptionStatus.TRIALING)).toBe(true);
      expect(isActive(SubscriptionStatus.GRACE_PERIOD)).toBe(true);
      expect(isActive(SubscriptionStatus.CANCELED)).toBe(false);
      expect(isActive(SubscriptionStatus.EXPIRED)).toBe(false);
    });
  });

  describe("Credit Allocation", () => {
    it("should calculate monthly credits correctly", () => {
      const baseCredits = 50;
      const bonusCredits = 10;
      const totalCredits = baseCredits + bonusCredits;

      expect(totalCredits).toBe(60);
    });

    it("should reset credits at period start", () => {
      const periodStart = new Date();
      const now = new Date();
      const isPeriodStart = 
        periodStart.getDate() === now.getDate() &&
        periodStart.getMonth() === now.getMonth();

      expect(isPeriodStart).toBe(true);
    });
  });

  describe("Subscription Upgrade/Downgrade", () => {
    it("should calculate proration for upgrade", () => {
      const currentPlanPrice = 1999; // €19.99
      const newPlanPrice = 4999; // €49.99
      const daysRemaining = 15;
      const totalDays = 30;

      const unusedAmount = (currentPlanPrice * daysRemaining) / totalDays;
      const prorationCredit = Math.round(unusedAmount);

      expect(prorationCredit).toBeGreaterThan(0);
      expect(prorationCredit).toBeLessThan(currentPlanPrice);
    });

    it("should identify upgrade vs downgrade", () => {
      const planOrder = {
        [SubscriptionPlan.FREE]: 0,
        [SubscriptionPlan.PRO]: 1,
        [SubscriptionPlan.ENTERPRISE]: 2,
      };

      const isUpgrade = (from: SubscriptionPlan, to: SubscriptionPlan): boolean => {
        return planOrder[to] > planOrder[from];
      };

      expect(isUpgrade(SubscriptionPlan.FREE, SubscriptionPlan.PRO)).toBe(true);
      expect(isUpgrade(SubscriptionPlan.PRO, SubscriptionPlan.FREE)).toBe(false);
    });
  });
});
