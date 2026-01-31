/**
 * Error Tracking Service using Sentry for React Native
 * Captures errors, exceptions, and performance data
 * Supports GDPR consent-based initialization
 */
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { consentService, ConsentCategory } from './consent';

class ErrorTrackingService {
  private initialized = false;
  private isEnabled = false;

  /**
   * Initialize Sentry
   * @param forceInit - If true, bypasses consent check and initializes anyway
   */
  init(forceInit?: boolean): void {
    // Check consent unless forceInit is true
    if (!forceInit) {
      const hasConsent = consentService.hasConsent(ConsentCategory.ANALYTICS);
      if (!hasConsent) {
        console.log('[Sentry] Analytics consent not granted, skipping initialization');
        return;
      }
    }

    const dsn = Constants.expoConfig?.extra?.sentryDsn;
    const environment = Constants.expoConfig?.extra?.environment || 'development';

    if (!dsn) {
      console.warn('[Sentry] DSN not configured');
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        // Performance monitoring
        tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
        // Release tracking
        release: Constants.expoConfig?.version || '1.0.0',
        // Enable native crash reporting
        enableNative: true,
        // Auto session tracking
        enableAutoSessionTracking: true,
        // Attach screenshots on crash
        attachScreenshot: true,
        // Don't send in dev
        beforeSend(event) {
          if (__DEV__) {
            console.log('[Sentry] Would send:', event.message);
            return null;
          }
          return event;
        },
      });

      this.initialized = true;
      this.isEnabled = true;
      console.log('[Sentry] Initialized for', environment);
    } catch (error) {
      console.error('[Sentry] Init failed:', error);
    }
  }

  /**
   * Disable error tracking and stop sending events
   */
  disable(): void {
    if (this.initialized) {
      Sentry.close();
      console.log('[Sentry] Disabled and closed');
    }
    this.initialized = false;
    this.isEnabled = false;
  }

  /**
   * Dynamically enable or disable error tracking
   * @param enabled - Whether to enable or disable error tracking
   */
  setEnabled(enabled: boolean): void {
    if (enabled && !this.initialized) {
      // If enabling and not initialized, try to initialize
      this.init();
    } else if (!enabled && this.initialized) {
      // If disabling and initialized, disable
      this.disable();
    } else {
      // Just update the enabled flag
      this.isEnabled = enabled;
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isEnabled) {
      console.error('[Sentry] Not enabled:', error);
      return;
    }

    Sentry.captureException(error, { extra: context });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    if (!this.isEnabled) return;

    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (!this.isEnabled) return;

    Sentry.setUser(user);
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    if (!this.isEnabled) return;

    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }

  /**
   * Set context
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
   * Wrap component with error boundary
   */
  wrap(component: React.ComponentType<any>): React.ComponentType<any> {
    return Sentry.wrap(component);
  }
}

export const errorTracking = new ErrorTrackingService();
export default errorTracking;
