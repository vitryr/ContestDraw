/**
 * GDPR-Compliant Consent Management Service for React Native
 * For French company compliance with RGPD (French GDPR implementation)
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Consent category types
export enum ConsentCategory {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  PREFERENCES = 'preferences',
}

// Consent state for each category
export interface ConsentState {
  [ConsentCategory.ESSENTIAL]: boolean;
  [ConsentCategory.ANALYTICS]: boolean;
  [ConsentCategory.MARKETING]: boolean;
  [ConsentCategory.PREFERENCES]: boolean;
}

// Stored consent data structure
export interface StoredConsent {
  state: ConsentState;
  timestamp: string;
  version: string;
  deviceInfo: string;
}

// Storage keys
const CONSENT_STORAGE_KEY = 'gdpr_consent';

// Current consent version - increment when privacy policy changes
const CONSENT_VERSION = '1.0.0';

/**
 * Default consent state - only essential enabled by default
 * Per GDPR/RGPD: non-essential tracking requires explicit consent
 */
export const DEFAULT_CONSENT_STATE: ConsentState = {
  [ConsentCategory.ESSENTIAL]: true,
  [ConsentCategory.ANALYTICS]: false,
  [ConsentCategory.MARKETING]: false,
  [ConsentCategory.PREFERENCES]: false,
};

// Event listeners for consent changes
type ConsentChangeListener = (state: ConsentState) => void;
const listeners: Set<ConsentChangeListener> = new Set();

class ConsentService {
  private cachedConsent: StoredConsent | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the consent service
   * Must be called before using other methods
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadFromStorage();
      this.initialized = true;
      console.log('[ConsentService] Initialized');
    } catch (error) {
      console.error('[ConsentService] Failed to initialize:', error);
      this.initialized = true; // Mark as initialized to prevent infinite loops
    }
  }

  /**
   * Load consent from AsyncStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed: StoredConsent = JSON.parse(stored);
        // Check if consent version matches current version
        if (parsed.version === CONSENT_VERSION) {
          this.cachedConsent = parsed;
        } else {
          // Version mismatch - consent needs to be renewed
          this.cachedConsent = null;
        }
      }
    } catch (error) {
      console.error('[ConsentService] Failed to load consent from storage:', error);
      this.cachedConsent = null;
    }
  }

  /**
   * Save consent to AsyncStorage
   */
  private async saveToStorage(consent: StoredConsent): Promise<void> {
    try {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
      this.cachedConsent = consent;
    } catch (error) {
      console.error('[ConsentService] Failed to save consent to storage:', error);
    }
  }

  /**
   * Get device info string for audit purposes
   */
  private getDeviceInfo(): string {
    const deviceName = Device.deviceName || 'Unknown';
    const osName = Device.osName || Platform.OS;
    const osVersion = Device.osVersion || Platform.Version;
    return `${deviceName} (${osName} ${osVersion})`;
  }

  /**
   * Get current consent state
   * Returns default state if no consent has been given
   */
  getConsent(): ConsentState {
    if (this.cachedConsent) {
      return { ...this.cachedConsent.state };
    }
    return { ...DEFAULT_CONSENT_STATE };
  }

  /**
   * Set consent state for all categories
   * Essential is always enabled (required for app functionality)
   */
  async setConsent(state: Partial<ConsentState>): Promise<void> {
    const newState: ConsentState = {
      ...DEFAULT_CONSENT_STATE,
      ...state,
      // Essential is always true per GDPR - required for basic functionality
      [ConsentCategory.ESSENTIAL]: true,
    };

    const storedConsent: StoredConsent = {
      state: newState,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
      deviceInfo: this.getDeviceInfo(),
    };

    await this.saveToStorage(storedConsent);

    // Notify listeners
    this.notifyListeners(newState);
  }

  /**
   * Check if a specific category has consent
   */
  hasConsent(category: ConsentCategory): boolean {
    const consent = this.getConsent();
    return consent[category] === true;
  }

  /**
   * Revoke all consent (except essential)
   * Clears stored consent data
   */
  async revokeConsent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONSENT_STORAGE_KEY);
      this.cachedConsent = null;

      // Notify listeners with default state (only essential)
      this.notifyListeners(DEFAULT_CONSENT_STATE);
    } catch (error) {
      console.error('[ConsentService] Failed to revoke consent:', error);
    }
  }

  /**
   * Check if user has made a consent choice
   * Returns false if consent modal should be shown
   */
  isConsentGiven(): boolean {
    return this.cachedConsent !== null;
  }

  /**
   * Get timestamp when consent was given
   * Returns null if no consent has been given
   */
  getConsentTimestamp(): Date | null {
    if (this.cachedConsent?.timestamp) {
      return new Date(this.cachedConsent.timestamp);
    }
    return null;
  }

  /**
   * Get the current consent version
   */
  getConsentVersion(): string {
    return CONSENT_VERSION;
  }

  /**
   * Get the stored consent version (if any)
   * Useful for checking if re-consent is needed
   */
  getStoredConsentVersion(): string | null {
    return this.cachedConsent?.version ?? null;
  }

  /**
   * Check if consent needs to be renewed (version mismatch)
   */
  needsConsentRenewal(): boolean {
    if (!this.cachedConsent) {
      return true;
    }
    return this.cachedConsent.version !== CONSENT_VERSION;
  }

  /**
   * Accept all consent categories
   */
  async acceptAll(): Promise<void> {
    await this.setConsent({
      [ConsentCategory.ESSENTIAL]: true,
      [ConsentCategory.ANALYTICS]: true,
      [ConsentCategory.MARKETING]: true,
      [ConsentCategory.PREFERENCES]: true,
    });
  }

  /**
   * Reject all non-essential consent categories
   */
  async rejectAll(): Promise<void> {
    await this.setConsent({
      [ConsentCategory.ESSENTIAL]: true,
      [ConsentCategory.ANALYTICS]: false,
      [ConsentCategory.MARKETING]: false,
      [ConsentCategory.PREFERENCES]: false,
    });
  }

  /**
   * Get full stored consent data (for debugging/export)
   */
  getStoredConsentData(): StoredConsent | null {
    return this.cachedConsent ? { ...this.cachedConsent } : null;
  }

  /**
   * Notify all registered listeners
   */
  private notifyListeners(state: ConsentState): void {
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('[ConsentService] Listener error:', error);
      }
    });
  }

  /**
   * Subscribe to consent changes
   * Returns unsubscribe function
   */
  onConsentChange(callback: ConsentChangeListener): () => void {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  }
}

// Export singleton instance
export const consentService = new ConsentService();

// Export class for testing purposes
export { ConsentService };
