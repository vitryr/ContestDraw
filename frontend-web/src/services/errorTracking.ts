/**
 * Error Tracking Service using Sentry
 * Captures errors, exceptions, and performance data
 * GDPR-compliant: requires consent before initialization
 */
import * as Sentry from "@sentry/react";
import { consentService, ConsentCategory } from './consent';

class ErrorTrackingService {
  private initialized = false;
  private isEnabled = false;

  /**
   * Initialize Sentry with DSN from environment
   * Respects GDPR consent - only initializes if analytics consent is given
   * @param forceInit - If true, initializes regardless of consent (use with caution)
   */
  init(forceInit?: boolean): void {
    // Check consent unless force init is requested
    if (!forceInit && !consentService.hasConsent(ConsentCategory.ANALYTICS)) {
      console.log("[Sentry] Analytics consent not given - error tracking disabled");
      return;
    }

    const dsn = import.meta.env.VITE_SENTRY_DSN;
    const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || "development";

    if (!dsn) {
      console.warn("[Sentry] DSN not configured - error tracking disabled");
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: environment === "production" ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        // Release tracking
        release: import.meta.env.VITE_APP_VERSION || "1.0.0",
        // Filter out common non-errors
        beforeSend(event) {
          // Don't send errors in development
          if (import.meta.env.DEV) {
            console.log("[Sentry] Would send event:", event);
            return null;
          }
          return event;
        },
      });

      this.initialized = true;
      this.isEnabled = true;
      console.log("[Sentry] Initialized for", environment);
    } catch (error) {
      console.error("[Sentry] Failed to initialize:", error);
    }
  }

  /**
   * Disable error tracking and stop sending events
   * Call this when user revokes analytics consent
   */
  disable(): void {
    if (this.initialized) {
      try {
        Sentry.close();
        console.log("[Sentry] Closed and disabled");
      } catch (error) {
        console.error("[Sentry] Failed to close:", error);
      }
    }
    this.initialized = false;
    this.isEnabled = false;
  }

  /**
   * Dynamically enable or disable error tracking
   * @param enabled - Whether to enable or disable tracking
   */
  setEnabled(enabled: boolean): void {
    if (enabled) {
      if (!this.initialized) {
        this.init();
      } else {
        this.isEnabled = true;
      }
    } else {
      this.disable();
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isEnabled) {
      console.error("[Sentry] Not enabled, error:", error);
      return;
    }

    Sentry.captureException(error, {
      extra: context,
    });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: Sentry.SeverityLevel = "info"): void {
    if (!this.isEnabled) return;

    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context (after login)
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.isEnabled) return;

    Sentry.setUser(user);
  }

  /**
   * Clear user context (on logout)
   */
  clearUser(): void {
    if (!this.isEnabled) return;

    Sentry.setUser(null);
  }

  /**
   * Add breadcrumb for debugging
   */
  addBreadcrumb(
    message: string,
    category: string,
    data?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: "info",
    });
  }

  /**
   * Set extra context
   */
  setContext(name: string, context: Record<string, any>): void {
    if (!this.isEnabled) return;

    Sentry.setContext(name, context);
  }

  /**
   * Set tag
   */
  setTag(key: string, value: string): void {
    if (!this.isEnabled) return;

    Sentry.setTag(key, value);
  }

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction(name: string, op: string): Sentry.Span | undefined {
    if (!this.isEnabled) return undefined;

    return Sentry.startInactiveSpan({ name, op });
  }
}

// Export singleton instance
export const errorTracking = new ErrorTrackingService();

export default errorTracking;
