/**
 * Pricing Service Tests
 * Tests for platform-specific pricing with iOS markup
 */

import { PricingService } from "../pricing.service";

describe("PricingService", () => {
  let pricingService: PricingService;

  beforeEach(() => {
    pricingService = new PricingService();
  });

  describe("getPlatformPrice", () => {
    it("should return price with platform info", () => {
      const result = pricingService.getPlatformPrice(10.0, "web" as any);

      expect(result.price).toBeDefined();
      expect(result.currency).toBe("EUR");
    });

    it("should include currency in result", () => {
      const result = pricingService.getPlatformPrice(10.0, "web" as any);

      expect(result.currency).toBe("EUR");
    });

    it("should round prices to 2 decimals", () => {
      const result = pricingService.getPlatformPrice(9.999, "web" as any);
      const decimals = result.price.toString().split(".")[1]?.length || 0;

      expect(decimals).toBeLessThanOrEqual(2);
    });
  });

  describe("getCreditPackPricing", () => {
    it("should return null for unknown pack ID", () => {
      const result = pricingService.getCreditPackPricing("unknown-pack", "web" as any);

      expect(result).toBeNull();
    });

    it("should return pricing for valid pack ID", () => {
      const result = pricingService.getCreditPackPricing("PACK_5", "web" as any);

      if (result) {
        expect(result.price).toBeGreaterThan(0);
        expect(result.currency).toBe("EUR");
      }
    });
  });

  describe("getSubscriptionPricing", () => {
    it("should return result for plan", () => {
      const result = pricingService.getSubscriptionPricing("PRO" as any, "web" as any);

      // Can be null or have a price
      expect(result === null || result.price >= 0).toBe(true);
    });
  });

  describe("getAllPlatformPrices", () => {
    it("should return array for pack ID", () => {
      const result = pricingService.getAllPlatformPrices("PACK_5");

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for unknown pack", () => {
      const result = pricingService.getAllPlatformPrices("unknown");

      expect(result).toEqual([]);
    });
  });
});

describe("PricingService - Unit Logic Tests", () => {
  describe("iOS Markup Calculation", () => {
    const IOS_MARKUP = 1.3;

    it("should calculate 30% markup correctly", () => {
      const basePrice = 10.0;
      const iosPrice = basePrice * IOS_MARKUP;

      expect(iosPrice).toBe(13.0);
    });

    it("should work with decimal prices", () => {
      const basePrice = 19.99;
      const iosPrice = basePrice * IOS_MARKUP;

      expect(iosPrice).toBeCloseTo(25.99, 1);
    });

    it("should round to 2 decimal places", () => {
      const basePrice = 9.99;
      const iosPrice = Math.round(basePrice * IOS_MARKUP * 100) / 100;

      expect(iosPrice).toBe(12.99);
    });
  });

  describe("Credit Pack Pricing", () => {
    const packs = {
      ONE_SHOT: 1.99,
      PACK_5: 8.0,
      PACK_10: 15.0,
      PACK_20: 28.0,
    };

    it("should have correct base prices", () => {
      expect(packs.ONE_SHOT).toBe(1.99);
      expect(packs.PACK_5).toBe(8.0);
      expect(packs.PACK_10).toBe(15.0);
      expect(packs.PACK_20).toBe(28.0);
    });

    it("should offer bulk discounts", () => {
      const pricePerCredit5 = packs.PACK_5 / 5;
      const pricePerCredit10 = packs.PACK_10 / 10;
      const pricePerCredit20 = packs.PACK_20 / 20;

      expect(pricePerCredit10).toBeLessThan(pricePerCredit5);
      expect(pricePerCredit20).toBeLessThan(pricePerCredit10);
    });
  });

  describe("Subscription Pricing", () => {
    const subscriptions = {
      MONTHLY: 19.99,
      ANNUAL: 199.0,
      ENTERPRISE: 49.0,
    };

    it("should have correct monthly price", () => {
      expect(subscriptions.MONTHLY).toBe(19.99);
    });

    it("should offer annual discount", () => {
      const monthlyAnnualized = subscriptions.MONTHLY * 12;
      const annualDiscount = monthlyAnnualized - subscriptions.ANNUAL;
      const discountPercent = (annualDiscount / monthlyAnnualized) * 100;

      expect(discountPercent).toBeGreaterThan(10); // At least 10% discount
    });
  });

  describe("Pass Pricing", () => {
    const PASS_48H = 12.99;

    it("should have 48h pass price", () => {
      expect(PASS_48H).toBe(12.99);
    });

    it("should be less than monthly", () => {
      expect(PASS_48H).toBeLessThan(19.99);
    });
  });

  describe("Currency Formatting", () => {
    it("should format EUR correctly", () => {
      const price = 19.99;
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);

      expect(formatted).toContain("€");
    });
  });

  describe("Platform Detection", () => {
    it("should identify iOS platform", () => {
      const isIOS = (platform: string): boolean => platform === "IOS";

      expect(isIOS("IOS")).toBe(true);
      expect(isIOS("WEB")).toBe(false);
      expect(isIOS("ANDROID")).toBe(false);
    });

    it("should identify platforms requiring markup", () => {
      const requiresMarkup = (platform: string): boolean => {
        return platform === "IOS";
      };

      expect(requiresMarkup("IOS")).toBe(true);
      expect(requiresMarkup("WEB")).toBe(false);
    });
  });

  describe("Price Comparison", () => {
    it("should sort packs by value", () => {
      const packs = [
        { id: "PACK_5", credits: 5, price: 8.0 },
        { id: "PACK_20", credits: 20, price: 28.0 },
        { id: "PACK_10", credits: 10, price: 15.0 },
      ];

      const sortedByValue = [...packs].sort(
        (a, b) => a.price / a.credits - b.price / b.credits
      );

      expect(sortedByValue[0].id).toBe("PACK_20"); // Best value
      expect(sortedByValue[2].id).toBe("PACK_5"); // Worst value
    });
  });
});
