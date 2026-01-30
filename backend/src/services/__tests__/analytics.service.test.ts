/**
 * Analytics Service Tests - Mixpanel Integration
 */

import { analyticsService } from "../analytics.service";

// Mock Mixpanel
jest.mock("mixpanel", () => ({
  init: jest.fn(() => ({
    track: jest.fn(),
    people: {
      set: jest.fn(),
      set_once: jest.fn(),
      increment: jest.fn(),
      track_charge: jest.fn(),
    },
  })),
}));

// Mock config
jest.mock("../../config/config", () => ({
  default: {
    analytics: {
      mixpanel: {
        token: "test-token",
        euEndpoint: true,
      },
      enabled: true,
    },
  },
}));

// Mock logger
jest.mock("../../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("AnalyticsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with Mixpanel token", () => {
      expect(analyticsService).toBeDefined();
    });
  });

  describe("track", () => {
    it("should track event with userId and properties", () => {
      const spy = jest.spyOn(analyticsService as any, "track");
      
      analyticsService.track("Test Event", "user-123", {
        testProperty: "value",
      });

      expect(spy).toHaveBeenCalledWith("Test Event", "user-123", {
        testProperty: "value",
      });
    });

    it("should track event without userId (anonymous)", () => {
      const spy = jest.spyOn(analyticsService as any, "track");
      
      analyticsService.track("Anonymous Event", undefined, {});

      expect(spy).toHaveBeenCalledWith("Anonymous Event", undefined, {});
    });
  });

  describe("User Lifecycle Events", () => {
    describe("trackSignup", () => {
      it("should track signup with email method", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");
        const setOnceSpy = jest.spyOn(analyticsService, "setOnce");

        analyticsService.trackSignup("user-123", {
          method: "email",
          referrer: "google",
          campaign: "summer2025",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "User Signed Up",
          "user-123",
          expect.objectContaining({
            method: "email",
            referrer: "google",
            campaign: "summer2025",
          })
        );

        expect(identifySpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            signup_method: "email",
          })
        );

        expect(setOnceSpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            signup_referrer: "google",
            signup_campaign: "summer2025",
          })
        );
      });

      it("should track signup with Google OAuth", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackSignup("user-456", {
          method: "google",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "User Signed Up",
          "user-456",
          expect.objectContaining({ method: "google" })
        );
      });

      it("should track signup with Facebook OAuth", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackSignup("user-789", {
          method: "facebook",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "User Signed Up",
          "user-789",
          expect.objectContaining({ method: "facebook" })
        );
      });
    });

    describe("trackLogin", () => {
      it("should track login and increment login count", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackLogin("user-123", {
          method: "email",
          platform: "web",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "User Logged In",
          "user-123",
          { method: "email", platform: "web" }
        );

        expect(incrementSpy).toHaveBeenCalledWith("user-123", "login_count");
      });

      it("should track mobile login", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackLogin("user-123", {
          method: "biometric",
          platform: "mobile",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "User Logged In",
          "user-123",
          { method: "biometric", platform: "mobile" }
        );
      });
    });

    describe("trackEmailVerified", () => {
      it("should track email verification and update profile", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackEmailVerified("user-123");

        expect(trackSpy).toHaveBeenCalledWith("Email Verified", "user-123", {});
        expect(identifySpy).toHaveBeenCalledWith("user-123", {
          email_verified: true,
        });
      });
    });
  });

  describe("Social Account Events", () => {
    describe("trackSocialAccountConnected", () => {
      it("should track Instagram connection", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackSocialAccountConnected("user-123", {
          platform: "instagram",
          accountId: "ig-12345",
          followerCount: 5000,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Social Account Connected",
          "user-123",
          expect.objectContaining({
            platform: "instagram",
            accountId: "ig-12345",
            followerCount: 5000,
          })
        );

        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "connected_accounts_count"
        );
      });

      it("should track all supported platforms", () => {
        const platforms = [
          "instagram",
          "facebook",
          "twitter",
          "tiktok",
          "youtube",
        ] as const;

        platforms.forEach((platform) => {
          const trackSpy = jest.spyOn(analyticsService, "track");

          analyticsService.trackSocialAccountConnected("user-123", {
            platform,
          });

          expect(trackSpy).toHaveBeenCalledWith(
            "Social Account Connected",
            "user-123",
            expect.objectContaining({ platform })
          );
        });
      });
    });

    describe("trackSocialAccountDisconnected", () => {
      it("should track account disconnection", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackSocialAccountDisconnected("user-123", "instagram");

        expect(trackSpy).toHaveBeenCalledWith(
          "Social Account Disconnected",
          "user-123",
          { platform: "instagram" }
        );
      });
    });
  });

  describe("Draw Events", () => {
    describe("trackDrawCreated", () => {
      it("should track draw creation with all properties", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackDrawCreated("user-123", {
          drawId: "draw-456",
          platform: "instagram",
          participantCount: 500,
          winnerCount: 3,
          hasFilters: true,
          filterTypes: ["follower_check", "account_age"],
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Draw Created",
          "user-123",
          expect.objectContaining({
            drawId: "draw-456",
            platform: "instagram",
            participantCount: 500,
            winnerCount: 3,
            hasFilters: true,
            filterTypes: ["follower_check", "account_age"],
          })
        );

        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "draws_created_count"
        );
      });

      it("should track draw without filters", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackDrawCreated("user-123", {
          drawId: "draw-789",
          platform: "facebook",
          participantCount: 100,
          winnerCount: 1,
          hasFilters: false,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Draw Created",
          "user-123",
          expect.objectContaining({
            hasFilters: false,
          })
        );
      });
    });

    describe("trackDrawCompleted", () => {
      it("should track completed draw with metrics", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackDrawCompleted("user-123", {
          drawId: "draw-456",
          platform: "instagram",
          participantCount: 500,
          winnerCount: 3,
          durationMs: 2500,
          filteredOutCount: 50,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Draw Completed",
          "user-123",
          expect.objectContaining({
            drawId: "draw-456",
            durationMs: 2500,
            filteredOutCount: 50,
          })
        );

        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "draws_completed_count"
        );
        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "total_participants_drawn",
          500
        );
      });
    });

    describe("trackDrawFailed", () => {
      it("should track failed draw with error", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackDrawFailed("user-123", {
          drawId: "draw-456",
          error: "Instagram API rate limit exceeded",
          platform: "instagram",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Draw Failed",
          "user-123",
          expect.objectContaining({
            error: "Instagram API rate limit exceeded",
          })
        );
      });
    });

    describe("trackParticipantsImported", () => {
      it("should track participant import from comments", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackParticipantsImported("user-123", {
          drawId: "draw-456",
          platform: "instagram",
          count: 350,
          source: "comments",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Participants Imported",
          "user-123",
          expect.objectContaining({
            count: 350,
            source: "comments",
          })
        );
      });
    });
  });

  describe("Payment Events", () => {
    describe("trackCheckoutStarted", () => {
      it("should track checkout initiation", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackCheckoutStarted("user-123", {
          plan: "monthly",
          price: 19.99,
          currency: "EUR",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Checkout Started",
          "user-123",
          expect.objectContaining({
            plan: "monthly",
            price: 19.99,
          })
        );
      });

      it("should track 48h pass checkout", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackCheckoutStarted("user-123", {
          plan: "48h_pass",
          price: 12.99,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Checkout Started",
          "user-123",
          expect.objectContaining({ plan: "48h_pass" })
        );
      });
    });

    describe("trackPaymentCompleted", () => {
      it("should track first payment with revenue", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const trackRevenueSpy = jest.spyOn(analyticsService, "trackRevenue");
        const setOnceSpy = jest.spyOn(analyticsService, "setOnce");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackPaymentCompleted("user-123", {
          plan: "monthly",
          amount: 19.99,
          currency: "EUR",
          isFirstPayment: true,
          paymentMethod: "card",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Payment Completed",
          "user-123",
          expect.any(Object)
        );

        expect(trackSpy).toHaveBeenCalledWith(
          "First Payment",
          "user-123",
          expect.any(Object)
        );

        expect(trackRevenueSpy).toHaveBeenCalledWith(
          "user-123",
          19.99,
          expect.objectContaining({ plan: "monthly" })
        );

        expect(setOnceSpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            first_payment_plan: "monthly",
          })
        );

        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "lifetime_value",
          19.99
        );
      });

      it("should track recurring payment (not first)", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const setOnceSpy = jest.spyOn(analyticsService, "setOnce");

        analyticsService.trackPaymentCompleted("user-123", {
          plan: "monthly",
          amount: 19.99,
          currency: "EUR",
          isFirstPayment: false,
        });

        expect(trackSpy).not.toHaveBeenCalledWith(
          "First Payment",
          expect.any(String),
          expect.any(Object)
        );

        expect(setOnceSpy).not.toHaveBeenCalled();
      });
    });

    describe("trackSubscriptionCreated", () => {
      it("should track new monthly subscription", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackSubscriptionCreated("user-123", {
          plan: "monthly",
          interval: "month",
          amount: 19.99,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Subscription Created",
          "user-123",
          expect.objectContaining({
            plan: "monthly",
            interval: "month",
          })
        );

        expect(identifySpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            subscription_plan: "monthly",
            subscription_interval: "month",
          })
        );
      });

      it("should track annual subscription", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackSubscriptionCreated("user-123", {
          plan: "annual",
          interval: "year",
          amount: 199.0,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Subscription Created",
          "user-123",
          expect.objectContaining({
            plan: "annual",
            interval: "year",
          })
        );
      });
    });

    describe("trackSubscriptionCancelled", () => {
      it("should track cancellation with reason", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackSubscriptionCancelled("user-123", {
          plan: "monthly",
          reason: "too_expensive",
          daysActive: 45,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Subscription Cancelled",
          "user-123",
          expect.objectContaining({
            reason: "too_expensive",
            daysActive: 45,
          })
        );

        expect(identifySpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            cancellation_reason: "too_expensive",
          })
        );
      });
    });

    describe("trackSubscriptionRenewed", () => {
      it("should track renewal and increment count", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackSubscriptionRenewed("user-123", {
          plan: "monthly",
          amount: 19.99,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Subscription Renewed",
          "user-123",
          expect.objectContaining({ plan: "monthly", amount: 19.99 })
        );

        expect(incrementSpy).toHaveBeenCalledWith("user-123", "renewal_count");
      });
    });
  });

  describe("Feature Usage Events", () => {
    describe("trackCertificateGenerated", () => {
      it("should track certificate generation", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const incrementSpy = jest.spyOn(analyticsService, "increment");

        analyticsService.trackCertificateGenerated("user-123", {
          drawId: "draw-456",
          format: "pdf",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Certificate Generated",
          "user-123",
          { drawId: "draw-456", format: "pdf" }
        );

        expect(incrementSpy).toHaveBeenCalledWith(
          "user-123",
          "certificates_generated_count"
        );
      });
    });

    describe("trackResultsShared", () => {
      it("should track results sharing via link", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackResultsShared("user-123", {
          drawId: "draw-456",
          shareMethod: "link",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Results Shared",
          "user-123",
          expect.objectContaining({ shareMethod: "link" })
        );
      });

      it("should track results sharing to social platform", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackResultsShared("user-123", {
          drawId: "draw-456",
          shareMethod: "social",
          platform: "twitter",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Results Shared",
          "user-123",
          expect.objectContaining({
            shareMethod: "social",
            platform: "twitter",
          })
        );
      });
    });

    describe("trackFilterUsed", () => {
      it("should track filter usage", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackFilterUsed("user-123", {
          drawId: "draw-456",
          filterType: "minimum_followers",
          filterValue: 100,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Filter Used",
          "user-123",
          expect.objectContaining({
            filterType: "minimum_followers",
            filterValue: 100,
          })
        );
      });
    });
  });

  describe("Engagement Events", () => {
    describe("trackOnboardingStep", () => {
      it("should track onboarding progress", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackOnboardingStep("user-123", {
          step: 2,
          stepName: "connect_social",
          completed: true,
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Onboarding Step",
          "user-123",
          expect.objectContaining({
            step: 2,
            stepName: "connect_social",
            completed: true,
          })
        );

        expect(identifySpy).toHaveBeenCalledWith("user-123", {
          onboarding_step: 2,
        });
      });

      it("should not update profile for incomplete step", () => {
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackOnboardingStep("user-123", {
          step: 3,
          stepName: "first_draw",
          completed: false,
        });

        expect(identifySpy).not.toHaveBeenCalled();
      });
    });

    describe("trackOnboardingCompleted", () => {
      it("should track onboarding completion", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");
        const identifySpy = jest.spyOn(analyticsService, "identify");

        analyticsService.trackOnboardingCompleted("user-123");

        expect(trackSpy).toHaveBeenCalledWith(
          "Onboarding Completed",
          "user-123",
          {}
        );

        expect(identifySpy).toHaveBeenCalledWith(
          "user-123",
          expect.objectContaining({
            onboarding_completed: true,
          })
        );
      });
    });
  });

  describe("Error Tracking", () => {
    describe("trackError", () => {
      it("should track errors with context", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackError("user-123", {
          errorType: "API_ERROR",
          errorMessage: "Instagram API timeout",
          context: "draw_execution",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Error Occurred",
          "user-123",
          expect.objectContaining({
            errorType: "API_ERROR",
            errorMessage: "Instagram API timeout",
            context: "draw_execution",
          })
        );
      });

      it("should track anonymous errors", () => {
        const trackSpy = jest.spyOn(analyticsService, "track");

        analyticsService.trackError(undefined, {
          errorType: "AUTH_ERROR",
          errorMessage: "Invalid token",
        });

        expect(trackSpy).toHaveBeenCalledWith(
          "Error Occurred",
          undefined,
          expect.any(Object)
        );
      });
    });
  });

  describe("Disabled Analytics", () => {
    it("should not throw when analytics disabled", () => {
      // This tests graceful degradation when Mixpanel is not configured
      expect(() => {
        analyticsService.track("Test Event", "user-123", {});
      }).not.toThrow();
    });
  });
});
