/**
 * Error Tracking Service using Sentry
 * Captures errors, exceptions, and performance data
 */
import * as Sentry from "@sentry/react";

class ErrorTrackingService {
  private initialized = false;

  /**
   * Initialize Sentry with DSN from environment
   */
  init(): void {
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
      console.log("[Sentry] Initialized for", environment);
    } catch (error) {
      console.error("[Sentry] Failed to initialize:", error);
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.error("[Sentry] Not initialized, error:", error);
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
    if (!this.initialized) return;

    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context (after login)
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.initialized) return;

    Sentry.setUser(user);
  }

  /**
   * Clear user context (on logout)
   */
  clearUser(): void {
    if (!this.initialized) return;

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
    if (!this.initialized) return;

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
    if (!this.initialized) return;

    Sentry.setContext(name, context);
  }

  /**
   * Set tag
   */
  setTag(key: string, value: string): void {
    if (!this.initialized) return;

    Sentry.setTag(key, value);
  }

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction(name: string, op: string): Sentry.Span | undefined {
    if (!this.initialized) return undefined;

    return Sentry.startInactiveSpan({ name, op });
  }
}

// Export singleton instance
export const errorTracking = new ErrorTrackingService();

// Auto-initialize on import
errorTracking.init();

export default errorTracking;
