/**
 * Analytics Service using Mixpanel for React Native
 * Tracks user behavior, conversion funnels, and product usage
 * Supports GDPR consent-based initialization
 */
import { Mixpanel } from 'mixpanel-react-native';
import Constants from 'expo-constants';
import { consentService, ConsentCategory } from './consent';

// Types
interface UserProperties {
  email?: string;
  name?: string;
  plan?: string;
  [key: string]: any;
}

interface DrawEventProperties {
  drawId: string;
  platform?: string;
  participantCount?: number;
  winnerCount?: number;
  [key: string]: any;
}

class AnalyticsService {
  private mixpanel: Mixpanel | null = null;
  private initialized = false;
  private isEnabled = false;

  /**
   * Initialize Mixpanel with GDPR consent check
   * @param forceInit - If true, skip consent check and initialize anyway
   */
  async init(forceInit?: boolean): Promise<void> {
    // Check consent before initializing (unless forced)
    if (!forceInit) {
      const hasConsent = consentService.hasConsent(ConsentCategory.ANALYTICS);
      if (!hasConsent) {
        console.log('[Analytics] No consent for analytics, skipping initialization');
        return;
      }
    }

    const token = Constants.expoConfig?.extra?.mixpanelToken;

    if (!token) {
      console.warn('[Analytics] Mixpanel token not configured');
      return;
    }

    try {
      this.mixpanel = new Mixpanel(token, true);
      await this.mixpanel.init();
      this.initialized = true;
      this.isEnabled = true;
      console.log('[Analytics] Mixpanel initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize:', error);
    }
  }

  /**
   * Disable analytics and clear mixpanel instance
   */
  disable(): void {
    this.initialized = false;
    this.isEnabled = false;
    this.mixpanel = null;
    console.log('[Analytics] Analytics disabled');
  }

  /**
   * Dynamically enable or disable analytics tracking
   * @param enabled - Whether analytics should be enabled
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`[Analytics] Analytics ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Track a custom event
   */
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.isEnabled || !this.mixpanel) return;

    try {
      this.mixpanel.track(event, {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: 'mobile',
      });
    } catch (error) {
      console.error('[Analytics] Track error:', error);
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, properties: UserProperties = {}): void {
    if (!this.isEnabled || !this.mixpanel) return;

    try {
      this.mixpanel.identify(userId);
      this.mixpanel.getPeople().set(properties);
    } catch (error) {
      console.error('[Analytics] Identify error:', error);
    }
  }

  /**
   * Reset on logout
   */
  reset(): void {
    if (!this.isEnabled || !this.mixpanel) return;

    try {
      this.mixpanel.reset();
    } catch (error) {
      console.error('[Analytics] Reset error:', error);
    }
  }

  // ============================================
  // USER EVENTS
  // ============================================

  trackSignup(method: string): void {
    this.track('User Signed Up', { method });
  }

  trackLogin(method: string): void {
    this.track('User Logged In', { method });
  }

  trackLogout(): void {
    this.track('User Logged Out');
    this.reset();
  }

  // ============================================
  // DRAW EVENTS
  // ============================================

  trackDrawCreated(properties: DrawEventProperties): void {
    this.track('Draw Created', properties);
  }

  trackDrawStarted(properties: DrawEventProperties): void {
    this.track('Draw Started', properties);
  }

  trackDrawCompleted(properties: DrawEventProperties): void {
    this.track('Draw Completed', properties);
  }

  // ============================================
  // SCREEN EVENTS
  // ============================================

  trackScreenView(screenName: string): void {
    this.track('Screen Viewed', { screen: screenName });
  }

  // ============================================
  // PAYMENT EVENTS
  // ============================================

  trackPurchaseStarted(productId: string, price: number): void {
    this.track('Purchase Started', { productId, price });
  }

  trackPurchaseCompleted(productId: string, price: number): void {
    this.track('Purchase Completed', { productId, price });
  }

  trackPurchaseFailed(productId: string, error: string): void {
    this.track('Purchase Failed', { productId, error });
  }
}

export const analytics = new AnalyticsService();
export default analytics;
