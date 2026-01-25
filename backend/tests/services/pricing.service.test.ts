/**
 * Pricing Service Tests
 * Test platform-specific pricing with iOS markup
 */

import { PricingService } from '../../src/services/pricing.service';
import { Platform, SubscriptionPlan } from '../../src/types/payment.types';

describe('PricingService', () => {
  let pricingService: PricingService;

  beforeEach(() => {
    pricingService = new PricingService();
  });

  describe('getPlatformPrice', () => {
    it('should return base price for web platform', () => {
      const result = pricingService.getPlatformPrice(10.00, Platform.WEB);

      expect(result.platform).toBe(Platform.WEB);
      expect(result.price).toBe(10.00);
      expect(result.currency).toBe('EUR');
      expect(result.originalPrice).toBeUndefined();
    });

    it('should apply 30% markup for iOS platform', () => {
      const result = pricingService.getPlatformPrice(10.00, Platform.IOS);

      expect(result.platform).toBe(Platform.IOS);
      expect(result.price).toBe(13.00); // 10 * 1.30
      expect(result.currency).toBe('EUR');
      expect(result.originalPrice).toBe(10.00);
    });

    it('should return base price for Android platform', () => {
      const result = pricingService.getPlatformPrice(10.00, Platform.ANDROID);

      expect(result.platform).toBe(Platform.ANDROID);
      expect(result.price).toBe(10.00);
      expect(result.currency).toBe('EUR');
      expect(result.originalPrice).toBeUndefined();
    });

    it('should round to 2 decimal places', () => {
      const result = pricingService.getPlatformPrice(9.99, Platform.IOS);

      expect(result.price).toBe(12.99); // 9.99 * 1.30 = 12.987 -> 12.99
    });
  });

  describe('getCreditPackPricing', () => {
    it('should return correct pricing for one_shot pack on web', () => {
      const result = pricingService.getCreditPackPricing('one_shot', Platform.WEB);

      expect(result).not.toBeNull();
      expect(result?.price).toBe(1.99);
      expect(result?.platform).toBe(Platform.WEB);
    });

    it('should return iOS markup pricing for one_shot pack', () => {
      const result = pricingService.getCreditPackPricing('one_shot', Platform.IOS);

      expect(result).not.toBeNull();
      expect(result?.price).toBe(2.59); // 1.99 * 1.30 = 2.587 -> 2.59
      expect(result?.originalPrice).toBe(1.99);
    });

    it('should return null for invalid credit pack ID', () => {
      const result = pricingService.getCreditPackPricing('invalid_pack', Platform.WEB);

      expect(result).toBeNull();
    });
  });

  describe('getSubscriptionPricing', () => {
    it('should return correct pricing for monthly subscription on web', () => {
      const result = pricingService.getSubscriptionPricing(SubscriptionPlan.MONTHLY, Platform.WEB);

      expect(result).not.toBeNull();
      expect(result?.price).toBe(19.99);
      expect(result?.platform).toBe(Platform.WEB);
    });

    it('should return iOS markup pricing for 48h pass', () => {
      const result = pricingService.getSubscriptionPricing(SubscriptionPlan.PASS_48H, Platform.IOS);

      expect(result).not.toBeNull();
      expect(result?.price).toBe(16.89); // 12.99 * 1.30 = 16.887 -> 16.89
      expect(result?.originalPrice).toBe(12.99);
    });
  });

  describe('detectPlatform', () => {
    it('should detect iOS from user agent', () => {
      const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      const platform = pricingService.detectPlatform(userAgent);

      expect(platform).toBe(Platform.IOS);
    });

    it('should detect Android from user agent', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 10)';
      const platform = pricingService.detectPlatform(userAgent);

      expect(platform).toBe(Platform.ANDROID);
    });

    it('should default to web for unknown user agent', () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      const platform = pricingService.detectPlatform(userAgent);

      expect(platform).toBe(Platform.WEB);
    });

    it('should use clientPlatform parameter if provided', () => {
      const platform = pricingService.detectPlatform('', 'ios');

      expect(platform).toBe(Platform.IOS);
    });
  });

  describe('calculateIOSStorePrice', () => {
    it('should calculate correct iOS store price', () => {
      const storePrice = pricingService.calculateIOSStorePrice(10.00);

      // To net $10, need to charge $10 / 0.70 = $14.29
      expect(storePrice).toBeCloseTo(14.29, 2);
    });

    it('should calculate iOS store price for small amounts', () => {
      const storePrice = pricingService.calculateIOSStorePrice(1.99);

      expect(storePrice).toBeCloseTo(2.84, 2);
    });
  });

  describe('getAllPlatformPrices', () => {
    it('should return prices for all platforms', () => {
      const prices = pricingService.getAllPlatformPrices('one_shot');

      expect(prices).toHaveLength(3);
      expect(prices[0].platform).toBe(Platform.WEB);
      expect(prices[1].platform).toBe(Platform.IOS);
      expect(prices[2].platform).toBe(Platform.ANDROID);
    });

    it('should apply iOS markup only to iOS platform', () => {
      const prices = pricingService.getAllPlatformPrices('one_shot');

      const webPrice = prices.find(p => p.platform === Platform.WEB);
      const iosPrice = prices.find(p => p.platform === Platform.IOS);
      const androidPrice = prices.find(p => p.platform === Platform.ANDROID);

      expect(webPrice?.price).toBe(1.99);
      expect(iosPrice?.price).toBe(2.59);
      expect(androidPrice?.price).toBe(1.99);
    });
  });

  describe('getCreditPackDetails', () => {
    it('should return complete credit pack details', () => {
      const details = pricingService.getCreditPackDetails('pack_10', Platform.WEB);

      expect(details).not.toBeNull();
      expect(details?.id).toBe('pack_10');
      expect(details?.credits).toBe(10);
      expect(details?.name).toBe('10 Credits Pack');
      expect(details?.pricing.price).toBe(15.00);
    });

    it('should include iOS markup in pricing details', () => {
      const details = pricingService.getCreditPackDetails('pack_10', Platform.IOS);

      expect(details?.pricing.price).toBe(19.50); // 15 * 1.30
      expect(details?.pricing.originalPrice).toBe(15.00);
    });
  });

  describe('getSubscriptionDetails', () => {
    it('should return complete subscription details for 48h pass', () => {
      const details = pricingService.getSubscriptionDetails(SubscriptionPlan.PASS_48H, Platform.WEB);

      expect(details).not.toBeNull();
      expect(details?.plan).toBe(SubscriptionPlan.PASS_48H);
      expect(details?.credits).toBe(0);
      expect(details?.duration).toBe('48 hours');
      expect(details?.features).toContain('Unlimited draws for 48h');
      expect(details?.pricing.price).toBe(12.99);
    });

    it('should apply iOS markup to subscription details', () => {
      const details = pricingService.getSubscriptionDetails(SubscriptionPlan.PASS_48H, Platform.IOS);

      expect(details?.pricing.price).toBe(16.89);
      expect(details?.pricing.originalPrice).toBe(12.99);
    });
  });

  describe('validatePlatformPrice', () => {
    it('should validate correct platform price', () => {
      const isValid = pricingService.validatePlatformPrice(13.00, Platform.IOS, 10.00);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect platform price', () => {
      const isValid = pricingService.validatePlatformPrice(15.00, Platform.IOS, 10.00);

      expect(isValid).toBe(false);
    });

    it('should allow 1 cent difference', () => {
      const isValid = pricingService.validatePlatformPrice(13.01, Platform.IOS, 10.00);

      expect(isValid).toBe(true);
    });
  });
});
