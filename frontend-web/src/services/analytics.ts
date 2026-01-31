/**
 * Analytics Service using Mixpanel
 * Tracks user behavior, conversion funnels, and product usage
 * GDPR-compliant: requires consent before initialization
 */
import mixpanel from "mixpanel-browser";
import { consentService, ConsentCategory } from "./consent";

// Types for analytics events
interface UserProperties {
  email?: string;
  name?: string;
  plan?: string;
  createdAt?: string;
  [key: string]: any;
}

interface DrawEventProperties {
  drawId: string;
  platform?: string;
  participantCount?: number;
  winnerCount?: number;
  [key: string]: any;
}

interface PaymentEventProperties {
  planId: string;
  amount?: number;
  currency?: string;
  [key: string]: any;
}

class AnalyticsService {
  private initialized = false;
  private isEnabled = false;

  /**
   * Initialize Mixpanel with token from environment
   * @param forceInit - If true, initialize regardless of consent status
   */
  init(forceInit?: boolean): void {
    // Check consent before initializing (unless forced)
    if (!forceInit && !consentService.hasConsent(ConsentCategory.ANALYTICS)) {
      console.log("[Analytics] No analytics consent - skipping initialization");
      return;
    }

    const token = import.meta.env.VITE_MIXPANEL_TOKEN;

    if (!token) {
      console.warn("[Analytics] Mixpanel token not configured - analytics disabled");
      return;
    }

    try {
      mixpanel.init(token, {
        autocapture: true,
        record_sessions_percent: 100,
        api_host: "https://api-eu.mixpanel.com",
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: "localStorage",
      });

      this.initialized = true;
      this.isEnabled = true;
      console.log("[Analytics] Mixpanel initialized");
    } catch (error) {
      console.error("[Analytics] Failed to initialize Mixpanel:", error);
    }
  }

  /**
   * Disable analytics tracking
   * Opts out of Mixpanel tracking and disables all tracking methods
   */
  disable(): void {
    try {
      if (this.initialized) {
        mixpanel.opt_out_tracking();
        console.log("[Analytics] Mixpanel tracking disabled");
      }
    } catch (error) {
      console.error("[Analytics] Failed to opt out of tracking:", error);
    }

    this.initialized = false;
    this.isEnabled = false;
  }

  /**
   * Dynamically enable or disable analytics
   * @param enabled - Whether analytics should be enabled
   */
  setEnabled(enabled: boolean): void {
    if (enabled) {
      if (!this.initialized) {
        // Initialize if not already done
        this.init(true);
      } else {
        // Re-enable tracking if already initialized
        try {
          mixpanel.opt_in_tracking();
          this.isEnabled = true;
          console.log("[Analytics] Tracking re-enabled");
        } catch (error) {
          console.error("[Analytics] Failed to opt in to tracking:", error);
        }
      }
    } else {
      this.disable();
    }
  }

  /**
   * Track a custom event
   */
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    try {
      mixpanel.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Analytics] Failed to track event:", event, error);
    }
  }

  /**
   * Identify a user (after login/signup)
   */
  identify(userId: string, properties: UserProperties = {}): void {
    if (!this.isEnabled) return;

    try {
      mixpanel.identify(userId);
      mixpanel.people.set({
        ...properties,
        $last_seen: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Analytics] Failed to identify user:", error);
    }
  }

  /**
   * Set user properties once (only if not already set)
   */
  setOnce(properties: UserProperties): void {
    if (!this.isEnabled) return;

    try {
      mixpanel.people.set_once(properties);
    } catch (error) {
      console.error("[Analytics] Failed to set_once:", error);
    }
  }

  /**
   * Reset user identity (on logout)
   */
  reset(): void {
    if (!this.isEnabled) return;

    try {
      mixpanel.reset();
    } catch (error) {
      console.error("[Analytics] Failed to reset:", error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties: Record<string, any> = {}): void {
    this.track("Page Viewed", {
      page: pageName,
      url: window.location.href,
      referrer: document.referrer,
      ...properties,
    });
  }

  // ============================================
  // USER LIFECYCLE EVENTS
  // ============================================

  trackSignup(method: "email" | "google" | "facebook" | "apple"): void {
    this.track("User Signed Up", { method });
  }

  trackLogin(method: string): void {
    this.track("User Logged In", { method });
  }

  trackLogout(): void {
    this.track("User Logged Out");
    this.reset();
  }

  trackEmailVerified(): void {
    this.track("Email Verified");
  }

  // ============================================
  // SOCIAL ACCOUNT EVENTS
  // ============================================

  trackSocialAccountConnected(
    platform: "instagram" | "facebook" | "twitter" | "tiktok" | "youtube",
    accountId?: string
  ): void {
    this.track("Social Account Connected", { platform, accountId });
  }

  trackSocialAccountDisconnected(
    platform: "instagram" | "facebook" | "twitter" | "tiktok" | "youtube"
  ): void {
    this.track("Social Account Disconnected", { platform });
  }

  // ============================================
  // DRAW EVENTS
  // ============================================

  trackDrawCreated(properties: DrawEventProperties): void {
    this.track("Draw Created", properties);
  }

  trackDrawStarted(properties: DrawEventProperties): void {
    this.track("Draw Started", properties);
  }

  trackDrawCompleted(properties: DrawEventProperties): void {
    this.track("Draw Completed", properties);
  }

  trackDrawFailed(drawId: string, error: string): void {
    this.track("Draw Failed", { drawId, error });
  }

  trackParticipantsImported(
    drawId: string,
    platform: string,
    count: number
  ): void {
    this.track("Participants Imported", { drawId, platform, count });
  }

  trackFilterApplied(drawId: string, filterType: string, value: any): void {
    this.track("Filter Applied", { drawId, filterType, value });
  }

  // ============================================
  // PAYMENT EVENTS
  // ============================================

  trackCheckoutStarted(properties: PaymentEventProperties): void {
    this.track("Checkout Started", properties);
  }

  trackPaymentCompleted(properties: PaymentEventProperties): void {
    this.track("Payment Completed", properties);
  }

  trackPaymentFailed(planId: string, error: string): void {
    this.track("Payment Failed", { planId, error });
  }

  trackSubscriptionCreated(planId: string): void {
    this.track("Subscription Created", { planId });
  }

  trackSubscriptionCancelled(planId: string, reason?: string): void {
    this.track("Subscription Cancelled", { planId, reason });
  }

  // ============================================
  // FEATURE USAGE EVENTS
  // ============================================

  trackCertificateDownloaded(drawId: string, format: string): void {
    this.track("Certificate Downloaded", { drawId, format });
  }

  trackResultsShared(drawId: string, platform: string): void {
    this.track("Results Shared", { drawId, platform });
  }

  trackVideoGenerated(drawId: string): void {
    this.track("Video Generated", { drawId });
  }

  // ============================================
  // UI INTERACTION EVENTS
  // ============================================

  trackButtonClicked(buttonName: string, context?: string): void {
    this.track("Button Clicked", { button: buttonName, context });
  }

  trackModalOpened(modalName: string): void {
    this.track("Modal Opened", { modal: modalName });
  }

  trackFormSubmitted(formName: string, success: boolean): void {
    this.track("Form Submitted", { form: formName, success });
  }

  trackError(errorType: string, message: string, context?: string): void {
    this.track("Error Occurred", { errorType, message, context });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

export default analytics;
