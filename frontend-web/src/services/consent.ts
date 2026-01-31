/**
 * Consent Management Service
 * Handles GDPR-compliant cookie consent storage and retrieval
 */

export enum ConsentCategory {
  ESSENTIAL = "essential",
  ANALYTICS = "analytics",
  MARKETING = "marketing",
}

export interface ConsentPreferences {
  essential: boolean; // Always true - required for site function
  analytics: boolean; // Mixpanel, Sentry
  marketing: boolean; // Future use
}

export interface ConsentState {
  given: boolean;
  timestamp: string | null;
  preferences: ConsentPreferences;
}

const CONSENT_STORAGE_KEY = "cleack_cookie_consent";
const CONSENT_VERSION = "1.0";

class ConsentService {
  private listeners: Set<(state: ConsentState) => void> = new Set();

  /**
   * Get default consent preferences (all optional cookies disabled)
   */
  getDefaultPreferences(): ConsentPreferences {
    return {
      essential: true, // Always required
      analytics: false,
      marketing: false,
    };
  }

  /**
   * Get current consent state from localStorage
   */
  getConsentState(): ConsentState {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate structure
        if (parsed.version === CONSENT_VERSION && parsed.given && parsed.preferences) {
          return {
            given: true,
            timestamp: parsed.timestamp,
            preferences: {
              essential: true, // Always force essential to true
              analytics: Boolean(parsed.preferences.analytics),
              marketing: Boolean(parsed.preferences.marketing),
            },
          };
        }
      }
    } catch (error) {
      console.error("[Consent] Failed to read consent state:", error);
    }

    return {
      given: false,
      timestamp: null,
      preferences: this.getDefaultPreferences(),
    };
  }

  /**
   * Check if consent has been given for a specific category
   * @param category - Optional: specific category to check. If omitted, checks if any consent was given.
   */
  hasConsent(category?: ConsentCategory): boolean {
    const state = this.getConsentState();

    // If no category specified, just check if any consent decision was made
    if (category === undefined) {
      return state.given;
    }

    // If no consent given yet, only essential is allowed
    if (!state.given) {
      return category === ConsentCategory.ESSENTIAL;
    }

    // Check specific category
    return state.preferences[category];
  }

  /**
   * Check if a specific consent category is allowed
   * @deprecated Use hasConsent(category) instead
   */
  isAllowed(category: keyof ConsentPreferences): boolean {
    const state = this.getConsentState();
    if (!state.given) return category === "essential";
    return state.preferences[category];
  }

  /**
   * Save consent preferences
   */
  saveConsent(preferences: Partial<ConsentPreferences>): void {
    const fullPreferences: ConsentPreferences = {
      essential: true, // Always true
      analytics: preferences.analytics ?? false,
      marketing: preferences.marketing ?? false,
    };

    const consentData = {
      version: CONSENT_VERSION,
      given: true,
      timestamp: new Date().toISOString(),
      preferences: fullPreferences,
    };

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));

      // Notify listeners
      const newState: ConsentState = {
        given: true,
        timestamp: consentData.timestamp,
        preferences: fullPreferences,
      };
      this.listeners.forEach((listener) => listener(newState));

      console.log("[Consent] Preferences saved:", fullPreferences);
    } catch (error) {
      console.error("[Consent] Failed to save consent:", error);
    }
  }

  /**
   * Accept all cookies
   */
  acceptAll(): void {
    this.saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
  }

  /**
   * Reject all optional cookies (only essential)
   */
  rejectAll(): void {
    this.saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
  }

  /**
   * Clear consent (for testing or user request)
   */
  clearConsent(): void {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      console.log("[Consent] Consent cleared");
    } catch (error) {
      console.error("[Consent] Failed to clear consent:", error);
    }
  }

  /**
   * Subscribe to consent changes
   */
  subscribe(listener: (state: ConsentState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Export singleton instance
export const consentService = new ConsentService();

export default consentService;
