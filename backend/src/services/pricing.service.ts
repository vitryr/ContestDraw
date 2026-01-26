/**
 * Pricing Service
 * Handles platform-specific pricing with iOS App Store markup
 */

import {
  Platform,
  PlatformPrice,
  PricingConfig,
  SubscriptionPlan,
  CreditPack,
} from "../types/payment.types";

export class PricingService {
  private readonly PRICING: PricingConfig = {
    ONE_SHOT: 1.99, // Updated to match PDF pricing €1.99-€2.99
    PACK_5: 8.0,
    PACK_10: 15.0,
    PACK_20: 28.0,
    MONTHLY: 19.99,
    ANNUAL: 199.0,
    ENTERPRISE: 49.0,
    PASS_48H: 12.99, // New 48-hour pass pricing
    IOS_MARKUP: 1.3, // +30% for Apple App Store commission
  };

  private readonly DEFAULT_CURRENCY = "EUR";

  /**
   * Get price for a specific platform
   * Applies iOS markup if platform is iOS
   */
  getPlatformPrice(basePrice: number, platform: Platform): PlatformPrice {
    const isIOS = platform === Platform.IOS;
    const finalPrice = isIOS ? basePrice * this.PRICING.IOS_MARKUP : basePrice;

    return {
      platform,
      price: Math.round(finalPrice * 100) / 100, // Round to 2 decimals
      currency: this.DEFAULT_CURRENCY,
      originalPrice: isIOS ? basePrice : undefined,
    };
  }

  /**
   * Get credit pack pricing for all platforms
   */
  getCreditPackPricing(
    creditPackId: string,
    platform: Platform,
  ): PlatformPrice | null {
    const basePrice = this.getCreditPackBasePrice(creditPackId);
    if (!basePrice) return null;

    return this.getPlatformPrice(basePrice, platform);
  }

  /**
   * Get subscription pricing for all platforms
   */
  getSubscriptionPricing(
    plan: SubscriptionPlan,
    platform: Platform,
  ): PlatformPrice | null {
    const basePrice = this.getSubscriptionBasePrice(plan);
    if (!basePrice) return null;

    return this.getPlatformPrice(basePrice, platform);
  }

  /**
   * Get all platform prices for a credit pack
   */
  getAllPlatformPrices(creditPackId: string): PlatformPrice[] {
    const basePrice = this.getCreditPackBasePrice(creditPackId);
    if (!basePrice) return [];

    return [
      this.getPlatformPrice(basePrice, Platform.WEB),
      this.getPlatformPrice(basePrice, Platform.IOS),
      this.getPlatformPrice(basePrice, Platform.ANDROID),
    ];
  }

  /**
   * Get all platform prices for a subscription
   */
  getAllSubscriptionPlatformPrices(plan: SubscriptionPlan): PlatformPrice[] {
    const basePrice = this.getSubscriptionBasePrice(plan);
    if (!basePrice) return [];

    return [
      this.getPlatformPrice(basePrice, Platform.WEB),
      this.getPlatformPrice(basePrice, Platform.IOS),
      this.getPlatformPrice(basePrice, Platform.ANDROID),
    ];
  }

  /**
   * Detect platform from user agent or client info
   */
  detectPlatform(userAgent?: string, clientPlatform?: string): Platform {
    if (clientPlatform) {
      const platform = clientPlatform.toLowerCase();
      if (platform === "ios") return Platform.IOS;
      if (platform === "android") return Platform.ANDROID;
    }

    if (userAgent) {
      const ua = userAgent.toLowerCase();
      if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
        return Platform.IOS;
      }
      if (ua.includes("android")) {
        return Platform.ANDROID;
      }
    }

    return Platform.WEB;
  }

  /**
   * Calculate iOS App Store price (reverse calculation)
   * Given a desired net revenue, calculate the App Store price
   */
  calculateIOSStorePrice(desiredNetRevenue: number): number {
    // Apple takes 30%, so we need to charge more to get desired net revenue
    // Net Revenue = Store Price * 0.70
    // Store Price = Net Revenue / 0.70
    return Math.round((desiredNetRevenue / 0.7) * 100) / 100;
  }

  /**
   * Get pricing configuration
   */
  getPricingConfig(): PricingConfig {
    return { ...this.PRICING };
  }

  /**
   * Validate platform-specific pricing
   */
  validatePlatformPrice(
    price: number,
    platform: Platform,
    expectedBasePrice: number,
  ): boolean {
    const calculatedPrice = this.getPlatformPrice(expectedBasePrice, platform);
    return Math.abs(calculatedPrice.price - price) < 0.01; // Allow 1 cent difference
  }

  // Private helper methods

  private getCreditPackBasePrice(creditPackId: string): number | null {
    const priceMap: Record<string, number> = {
      one_shot: this.PRICING.ONE_SHOT,
      pack_5: this.PRICING.PACK_5,
      pack_10: this.PRICING.PACK_10,
      pack_20: this.PRICING.PACK_20,
    };

    return priceMap[creditPackId] || null;
  }

  private getSubscriptionBasePrice(plan: SubscriptionPlan): number | null {
    const priceMap: Record<SubscriptionPlan, number> = {
      [SubscriptionPlan.MONTHLY]: this.PRICING.MONTHLY,
      [SubscriptionPlan.ANNUAL]: this.PRICING.ANNUAL,
      [SubscriptionPlan.ENTERPRISE]: this.PRICING.ENTERPRISE,
      [SubscriptionPlan.PASS_48H]: this.PRICING.PASS_48H,
    };

    return priceMap[plan] || null;
  }

  /**
   * Get credit pack details with platform pricing
   */
  getCreditPackDetails(
    creditPackId: string,
    platform: Platform,
  ): {
    id: string;
    credits: number;
    pricing: PlatformPrice;
    name: string;
    description?: string;
  } | null {
    const packs: Record<
      string,
      { credits: number; name: string; description?: string }
    > = {
      one_shot: {
        credits: 1,
        name: "Single Credit",
        description: "Perfect for one-time contests",
      },
      pack_5: {
        credits: 5,
        name: "5 Credits Pack",
        description: "Save 20% on bulk purchase",
      },
      pack_10: {
        credits: 10,
        name: "10 Credits Pack",
        description: "Save 25% on bulk purchase",
      },
      pack_20: {
        credits: 20,
        name: "20 Credits Pack",
        description: "Best value - Save 30%",
      },
    };

    const pack = packs[creditPackId];
    if (!pack) return null;

    const pricing = this.getCreditPackPricing(creditPackId, platform);
    if (!pricing) return null;

    return {
      id: creditPackId,
      ...pack,
      pricing,
    };
  }

  /**
   * Get subscription details with platform pricing
   */
  getSubscriptionDetails(
    plan: SubscriptionPlan,
    platform: Platform,
  ): {
    plan: SubscriptionPlan;
    pricing: PlatformPrice;
    credits: number;
    duration: string;
    features: string[];
  } | null {
    const subscriptionDetails: Record<
      SubscriptionPlan,
      {
        credits: number;
        duration: string;
        features: string[];
      }
    > = {
      [SubscriptionPlan.MONTHLY]: {
        credits: 10,
        duration: "1 month",
        features: [
          "10 credits per month",
          "3 connected accounts",
          "Advanced analytics",
        ],
      },
      [SubscriptionPlan.ANNUAL]: {
        credits: 120,
        duration: "12 months",
        features: [
          "120 credits per year",
          "5 connected accounts",
          "Priority support",
          "API access",
        ],
      },
      [SubscriptionPlan.ENTERPRISE]: {
        credits: 30,
        duration: "1 month",
        features: [
          "30 credits per month",
          "10 connected accounts",
          "Priority support",
          "API access",
          "Custom branding",
        ],
      },
      [SubscriptionPlan.PASS_48H]: {
        credits: 0, // Unlimited for 48 hours
        duration: "48 hours",
        features: [
          "Unlimited draws for 48h",
          "All contest types",
          "No credit consumption",
        ],
      },
    };

    const details = subscriptionDetails[plan];
    if (!details) return null;

    const pricing = this.getSubscriptionPricing(plan, platform);
    if (!pricing) return null;

    return {
      plan,
      pricing,
      ...details,
    };
  }
}
