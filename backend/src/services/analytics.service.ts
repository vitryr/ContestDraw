import * as Mixpanel from "mixpanel";
import config from "../config/config";
import { logger } from "../utils/logger";

/**
 * Analytics Service using Mixpanel
 * Tracks user behavior, conversion funnels, and product usage
 */
class AnalyticsService {
  private mixpanel: any = null;
  private enabled: boolean;

  constructor() {
    this.enabled = !!config.analytics?.mixpanel?.token;

    if (this.enabled) {
      this.mixpanel = Mixpanel.init(config.analytics.mixpanel.token, {
        host: config.analytics.mixpanel.euEndpoint
          ? "api-eu.mixpanel.com"
          : "api.mixpanel.com",
      });
      logger.info("Mixpanel analytics initialized");
    } else {
      logger.warn("Mixpanel token not configured - analytics disabled");
    }
  }

  /**
   * Track an event
   */
  track(
    event: string,
    userId: string | undefined,
    properties: Record<string, any> = {}
  ): void {
    if (!this.enabled || !this.mixpanel) {
      logger.debug(`[Analytics DISABLED] ${event}`, properties);
      return;
    }

    try {
      this.mixpanel.track(event, {
        distinct_id: userId || "anonymous",
        time: Date.now(),
        ...properties,
      });
      logger.debug(`[Analytics] Tracked: ${event}`, { userId });
    } catch (error) {
      logger.error("Failed to track event", { event, error });
    }
  }

  /**
   * Identify a user (set profile properties)
   */
  identify(userId: string, properties: Record<string, any> = {}): void {
    if (!this.enabled || !this.mixpanel) return;

    try {
      this.mixpanel.people.set(userId, {
        ...properties,
        $last_seen: new Date().toISOString(),
      });
      logger.debug(`[Analytics] Identified user: ${userId}`);
    } catch (error) {
      logger.error("Failed to identify user", { userId, error });
    }
  }

  /**
   * Set user properties once (only if not already set)
   */
  setOnce(userId: string, properties: Record<string, any>): void {
    if (!this.enabled || !this.mixpanel) return;

    try {
      this.mixpanel.people.set_once(userId, properties);
    } catch (error) {
      logger.error("Failed to set_once", { userId, error });
    }
  }

  /**
   * Increment a numeric property
   */
  increment(userId: string, property: string, value: number = 1): void {
    if (!this.enabled || !this.mixpanel) return;

    try {
      this.mixpanel.people.increment(userId, property, value);
    } catch (error) {
      logger.error("Failed to increment", { userId, property, error });
    }
  }

  /**
   * Track revenue
   */
  trackRevenue(
    userId: string,
    amount: number,
    properties: Record<string, any> = {}
  ): void {
    if (!this.enabled || !this.mixpanel) return;

    try {
      this.mixpanel.people.track_charge(userId, amount, properties);
      this.track("Revenue", userId, { amount, ...properties });
    } catch (error) {
      logger.error("Failed to track revenue", { userId, amount, error });
    }
  }

  // ============================================
  // USER LIFECYCLE EVENTS
  // ============================================

  trackSignup(
    userId: string,
    properties: {
      method: "email" | "google" | "facebook" | "apple";
      referrer?: string;
      campaign?: string;
    }
  ): void {
    this.track("User Signed Up", userId, properties);
    this.identify(userId, {
      $created: new Date().toISOString(),
      signup_method: properties.method,
    });
    this.setOnce(userId, {
      first_signup_date: new Date().toISOString(),
      signup_referrer: properties.referrer,
      signup_campaign: properties.campaign,
    });
  }

  trackLogin(
    userId: string,
    properties: { method: string; platform?: string }
  ): void {
    this.track("User Logged In", userId, properties);
    this.increment(userId, "login_count");
  }

  trackEmailVerified(userId: string): void {
    this.track("Email Verified", userId, {});
    this.identify(userId, { email_verified: true });
  }

  // ============================================
  // SOCIAL ACCOUNT EVENTS
  // ============================================

  trackSocialAccountConnected(
    userId: string,
    properties: {
      platform: "instagram" | "facebook" | "twitter" | "tiktok" | "youtube";
      accountId?: string;
      followerCount?: number;
    }
  ): void {
    this.track("Social Account Connected", userId, properties);
    this.increment(userId, "connected_accounts_count");
  }

  trackSocialAccountDisconnected(
    userId: string,
    platform: string
  ): void {
    this.track("Social Account Disconnected", userId, { platform });
  }

  // ============================================
  // DRAW EVENTS (Core Product)
  // ============================================

  trackDrawCreated(
    userId: string,
    properties: {
      drawId: string;
      platform: string;
      participantCount: number;
      winnerCount: number;
      hasFilters: boolean;
      filterTypes?: string[];
    }
  ): void {
    this.track("Draw Created", userId, properties);
    this.increment(userId, "draws_created_count");
  }

  trackDrawStarted(
    userId: string,
    properties: {
      drawId: string;
      platform: string;
      participantCount: number;
    }
  ): void {
    this.track("Draw Started", userId, properties);
  }

  trackDrawCompleted(
    userId: string,
    properties: {
      drawId: string;
      platform: string;
      participantCount: number;
      winnerCount: number;
      durationMs: number;
      filteredOutCount?: number;
    }
  ): void {
    this.track("Draw Completed", userId, properties);
    this.increment(userId, "draws_completed_count");
    this.increment(userId, "total_participants_drawn", properties.participantCount);
  }

  trackDrawFailed(
    userId: string,
    properties: {
      drawId: string;
      error: string;
      platform?: string;
    }
  ): void {
    this.track("Draw Failed", userId, properties);
  }

  trackParticipantsImported(
    userId: string,
    properties: {
      drawId: string;
      platform: string;
      count: number;
      source: "comments" | "likes" | "shares" | "manual";
    }
  ): void {
    this.track("Participants Imported", userId, properties);
  }

  // ============================================
  // PAYMENT & SUBSCRIPTION EVENTS
  // ============================================

  trackCheckoutStarted(
    userId: string,
    properties: {
      plan: "48h_pass" | "monthly" | "annual" | "enterprise";
      price: number;
      currency?: string;
    }
  ): void {
    this.track("Checkout Started", userId, properties);
  }

  trackPaymentCompleted(
    userId: string,
    properties: {
      plan: string;
      amount: number;
      currency: string;
      isFirstPayment: boolean;
      paymentMethod?: string;
    }
  ): void {
    this.track("Payment Completed", userId, properties);
    this.trackRevenue(userId, properties.amount, {
      plan: properties.plan,
      currency: properties.currency,
    });

    if (properties.isFirstPayment) {
      this.track("First Payment", userId, properties);
      this.setOnce(userId, {
        first_payment_date: new Date().toISOString(),
        first_payment_plan: properties.plan,
      });
    }

    this.identify(userId, {
      current_plan: properties.plan,
      lifetime_value: undefined, // Will be incremented
    });
    this.increment(userId, "lifetime_value", properties.amount);
  }

  trackSubscriptionCreated(
    userId: string,
    properties: {
      plan: string;
      interval: "month" | "year";
      amount: number;
    }
  ): void {
    this.track("Subscription Created", userId, properties);
    this.identify(userId, {
      subscription_plan: properties.plan,
      subscription_interval: properties.interval,
      subscription_started_at: new Date().toISOString(),
    });
  }

  trackSubscriptionCancelled(
    userId: string,
    properties: {
      plan: string;
      reason?: string;
      daysActive?: number;
    }
  ): void {
    this.track("Subscription Cancelled", userId, properties);
    this.identify(userId, {
      subscription_cancelled_at: new Date().toISOString(),
      cancellation_reason: properties.reason,
    });
  }

  trackSubscriptionRenewed(
    userId: string,
    properties: { plan: string; amount: number }
  ): void {
    this.track("Subscription Renewed", userId, properties);
    this.increment(userId, "renewal_count");
  }

  // ============================================
  // FEATURE USAGE EVENTS
  // ============================================

  trackCertificateGenerated(
    userId: string,
    properties: { drawId: string; format: string }
  ): void {
    this.track("Certificate Generated", userId, properties);
    this.increment(userId, "certificates_generated_count");
  }

  trackCertificateDownloaded(
    userId: string,
    properties: { drawId: string }
  ): void {
    this.track("Certificate Downloaded", userId, properties);
  }

  trackResultsShared(
    userId: string,
    properties: {
      drawId: string;
      shareMethod: "link" | "email" | "social";
      platform?: string;
    }
  ): void {
    this.track("Results Shared", userId, properties);
  }

  trackFilterUsed(
    userId: string,
    properties: {
      drawId: string;
      filterType: string;
      filterValue?: any;
    }
  ): void {
    this.track("Filter Used", userId, properties);
  }

  // ============================================
  // ENGAGEMENT EVENTS
  // ============================================

  trackPageViewed(
    userId: string | undefined,
    properties: {
      page: string;
      referrer?: string;
      platform?: "web" | "mobile";
    }
  ): void {
    this.track("Page Viewed", userId, properties);
  }

  trackFeatureDiscovered(
    userId: string,
    properties: { feature: string; source?: string }
  ): void {
    this.track("Feature Discovered", userId, properties);
  }

  trackOnboardingStep(
    userId: string,
    properties: { step: number; stepName: string; completed: boolean }
  ): void {
    this.track("Onboarding Step", userId, properties);
    if (properties.completed) {
      this.identify(userId, { onboarding_step: properties.step });
    }
  }

  trackOnboardingCompleted(userId: string): void {
    this.track("Onboarding Completed", userId, {});
    this.identify(userId, {
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    });
  }

  // ============================================
  // ERROR & SUPPORT EVENTS
  // ============================================

  trackError(
    userId: string | undefined,
    properties: {
      errorType: string;
      errorMessage: string;
      context?: string;
    }
  ): void {
    this.track("Error Occurred", userId, properties);
  }

  trackSupportRequested(
    userId: string,
    properties: { topic: string; priority?: string }
  ): void {
    this.track("Support Requested", userId, properties);
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
