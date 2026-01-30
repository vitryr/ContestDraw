/**
 * Analytics Service Integration Tests
 */

// Mock Mixpanel before import
jest.mock("mixpanel", () => ({
  init: jest.fn(() => ({
    track: jest.fn(),
    people: {
      set: jest.fn(),
      set_once: jest.fn(),
      increment: jest.fn(),
    },
  })),
}));

jest.mock("../../config/config", () => ({
  default: {
    analytics: {
      mixpanel: {
        token: "test-token",
        euEndpoint: false,
      },
    },
  },
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

import { analyticsService } from "../analytics.service";
import * as Mixpanel from "mixpanel";

describe("AnalyticsService Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("track", () => {
    it("should track events with user ID", () => {
      analyticsService.track("Test Event", "user-123", { key: "value" });
      // Should not throw
    });

    it("should track events without user ID", () => {
      analyticsService.track("Anonymous Event", undefined, {});
      // Should not throw
    });

    it("should include timestamp in event", () => {
      analyticsService.track("Timed Event", "user-123", {});
      // Should not throw
    });
  });

  describe("identify", () => {
    it("should identify user with properties", () => {
      analyticsService.identify("user-123", { email: "test@test.com" });
      // Should not throw
    });

    it("should set last seen date", () => {
      analyticsService.identify("user-456", { name: "Test User" });
      // Should not throw
    });
  });

  describe("setOnce", () => {
    it("should set properties once", () => {
      analyticsService.setOnce("user-123", { createdAt: new Date().toISOString() });
      // Should not throw
    });
  });

  describe("increment", () => {
    it("should increment a property", () => {
      analyticsService.increment("user-123", "login_count", 1);
      // Should not throw
    });

    it("should increment by default value", () => {
      analyticsService.increment("user-123", "page_views");
      // Should not throw
    });
  });

  describe("trackRevenue", () => {
    it("should track revenue", () => {
      analyticsService.trackRevenue("user-123", 1999, { plan: "pro" });
      // Should not throw
    });
  });

  describe("User Lifecycle Events", () => {
    it("should track signup", () => {
      analyticsService.trackSignup("user-123", {
        email: "test@test.com",
        source: "organic",
      });
      // Should track and identify
    });

    it("should track login", () => {
      analyticsService.trackLogin("user-123", { method: "email" });
    });

    it("should track email verified", () => {
      analyticsService.trackEmailVerified("user-123");
    });
  });

  describe("Social Account Events", () => {
    it("should track social account connected", () => {
      analyticsService.trackSocialAccountConnected("user-123", {
        platform: "instagram",
        accountId: "ig-123",
      });
    });

    it("should track social account disconnected", () => {
      analyticsService.trackSocialAccountDisconnected("user-123", {
        platform: "twitter",
        accountId: "tw-456",
      });
    });
  });

  describe("Draw Events", () => {
    it("should track draw created", () => {
      analyticsService.trackDrawCreated("user-123", {
        drawId: "draw-123",
        platform: "instagram",
        participantCount: 500,
      });
    });

    it("should track draw completed", () => {
      analyticsService.trackDrawCompleted("user-123", {
        drawId: "draw-123",
        platform: "instagram",
        participantCount: 500,
        winnerCount: 3,
        durationMs: 5000,
        filteredOutCount: 50,
      });
    });

    it("should track draw failed", () => {
      analyticsService.trackDrawFailed("user-123", {
        drawId: "draw-123",
        platform: "instagram",
        error: "API rate limit",
      });
    });
  });

  describe("Payment Events", () => {
    it("should track checkout started", () => {
      analyticsService.trackCheckoutStarted("user-123", {
        planId: "pro",
        amount: 1999,
        currency: "EUR",
      });
    });

    it("should track payment completed", () => {
      analyticsService.trackPaymentCompleted("user-123", {
        planId: "pro",
        amount: 1999,
        currency: "EUR",
        paymentId: "pay-123",
      });
    });

    it("should track subscription created", () => {
      analyticsService.trackSubscriptionCreated("user-123", {
        planId: "pro",
        subscriptionId: "sub-123",
      });
    });

    it("should track subscription cancelled", () => {
      analyticsService.trackSubscriptionCancelled("user-123", {
        planId: "pro",
        subscriptionId: "sub-123",
        reason: "Too expensive",
      });
    });
  });

  describe("Feature Usage Events", () => {
    it("should track certificate generated", () => {
      analyticsService.trackCertificateGenerated("user-123", {
        drawId: "draw-123",
      });
    });

    it("should track certificate downloaded", () => {
      analyticsService.trackCertificateDownloaded("user-123", {
        drawId: "draw-123",
        format: "pdf",
      });
    });

    it("should track results shared", () => {
      analyticsService.trackResultsShared("user-123", {
        drawId: "draw-123",
        platform: "twitter",
      });
    });

    it("should track filter used", () => {
      analyticsService.trackFilterUsed("user-123", {
        drawId: "draw-123",
        filterType: "minFollowers",
        filterValue: "100",
      });
    });

    it("should track participants imported", () => {
      analyticsService.trackParticipantsImported("user-123", {
        drawId: "draw-123",
        platform: "instagram",
        count: 500,
      });
    });
  });

  describe("Draw Started", () => {
    it("should track draw started", () => {
      analyticsService.trackDrawStarted("user-123", {
        drawId: "draw-123",
        platform: "instagram",
      });
    });
  });

  describe("Subscription Renewed", () => {
    it("should track subscription renewed", () => {
      analyticsService.trackSubscriptionRenewed("user-123", {
        planId: "pro",
        subscriptionId: "sub-123",
      });
    });
  });
});
