/**
 * React hook for analytics tracking
 * Provides easy access to analytics methods in components
 */
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import analytics from "../services/analytics";

/**
 * Hook to track page views automatically
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);
}

/**
 * Hook to access analytics methods
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (event: string, properties?: Record<string, any>) => {
      analytics.track(event, properties);
    },
    []
  );

  const trackButtonClick = useCallback(
    (buttonName: string, context?: string) => {
      analytics.trackButtonClicked(buttonName, context);
    },
    []
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean) => {
      analytics.trackFormSubmitted(formName, success);
    },
    []
  );

  const trackError = useCallback(
    (errorType: string, message: string, context?: string) => {
      analytics.trackError(errorType, message, context);
    },
    []
  );

  const identifyUser = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      analytics.identify(userId, properties);
    },
    []
  );

  const resetUser = useCallback(() => {
    analytics.reset();
  }, []);

  return {
    trackEvent,
    trackButtonClick,
    trackFormSubmit,
    trackError,
    identifyUser,
    resetUser,
    // Direct access to specific tracking methods
    trackDrawCreated: analytics.trackDrawCreated.bind(analytics),
    trackDrawCompleted: analytics.trackDrawCompleted.bind(analytics),
    trackCheckoutStarted: analytics.trackCheckoutStarted.bind(analytics),
    trackPaymentCompleted: analytics.trackPaymentCompleted.bind(analytics),
    trackSignup: analytics.trackSignup.bind(analytics),
    trackLogin: analytics.trackLogin.bind(analytics),
    trackLogout: analytics.trackLogout.bind(analytics),
  };
}

export default useAnalytics;
