/**
 * Error Tracking Service using Sentry for React Native
 * Captures errors, exceptions, and performance data
 */
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

class ErrorTrackingService {
  private initialized = false;

  /**
   * Initialize Sentry
   */
  init(): void {
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
      console.log('[Sentry] Initialized for', environment);
    } catch (error) {
      console.error('[Sentry] Init failed:', error);
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.error('[Sentry] Not initialized:', error);
      return;
    }

    Sentry.captureException(error, { extra: context });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    if (!this.initialized) return;

    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string } | null): void {
    if (!this.initialized) return;

    Sentry.setUser(user);
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    if (!this.initialized) return;

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
   * Wrap component with error boundary
   */
  wrap(component: React.ComponentType<any>): React.ComponentType<any> {
    return Sentry.wrap(component);
  }
}

export const errorTracking = new ErrorTrackingService();
export default errorTracking;
