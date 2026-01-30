/**
 * Promo Code Service Tests
 */

import { promoCodeService } from '../promo-code.service';
import { prisma } from '../../utils/prisma';
import { DiscountType, ApplicableTo } from '@prisma/client';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  prisma: {
    promoCode: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    promoCodeUsage: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock config
jest.mock('../../config/config', () => ({
  default: {
    payment: {
      stripe: {
        secretKey: null, // Disable Stripe in tests
      },
    },
  },
}));

describe('PromoCodeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePromoCode', () => {
    const mockUserId = 'user-123';
    // Use dates in the future to avoid expiration issues in tests
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const pastDate = new Date('2020-01-01');
    
    const mockPromoCode = {
      id: 'promo-123',
      code: 'TEST20',
      discountType: 'PERCENTAGE' as DiscountType,
      discountValue: 20,
      maxUses: 100,
      maxUsesPerUser: 1,
      currentUses: 10,
      validFrom: pastDate,
      validUntil: futureDate,
      isActive: true,
      minPurchaseAmount: null,
      applicableTo: 'ALL' as ApplicableTo,
      allowedPlans: [],
      usages: [],
    };

    it('should return valid for a valid promo code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue(mockPromoCode);

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBeCloseTo(6.0); // 20% of 29.99
      expect(result.finalAmount).toBeCloseTo(23.99);
    });

    it('should return invalid for non-existent code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await promoCodeService.validatePromoCode(
        'INVALID',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code promo invalide');
    });

    it('should return invalid for inactive code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        isActive: false,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Ce code promo n'est plus actif");
    });

    it('should return invalid for expired code', async () => {
      const expiredDate = new Date('2020-01-01');
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: expiredDate,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Ce code promo a expiré');
    });

    it('should return invalid when max uses reached', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        maxUses: 10,
        currentUses: 10,
        validUntil: futureDate,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Ce code promo a atteint sa limite d'utilisation");
    });

    it('should return invalid when user has already used the code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: futureDate,
        usages: [{ userId: mockUserId }], // User has 1 usage, maxUsesPerUser is 1
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Vous avez déjà utilisé ce code promo');
    });

    it('should return invalid for wrong purchase type', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: futureDate,
        applicableTo: 'SUBSCRIPTION' as ApplicableTo,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'CREDITS',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Ce code est valable uniquement pour les abonnements');
    });

    it('should return invalid for amount below minimum', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: futureDate,
        minPurchaseAmount: 50,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Montant minimum requis: 50€');
    });

    it('should calculate fixed amount discount correctly', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: futureDate,
        discountType: 'FIXED_AMOUNT' as DiscountType,
        discountValue: 10,
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(10);
      expect(result.finalAmount).toBeCloseTo(19.99);
    });

    it('should not allow discount greater than amount for fixed discount', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        ...mockPromoCode,
        validUntil: futureDate,
        discountType: 'FIXED_AMOUNT' as DiscountType,
        discountValue: 50, // Greater than amount
      });

      const result = await promoCodeService.validatePromoCode(
        'TEST20',
        mockUserId,
        'SUBSCRIPTION',
        29.99,
      );

      expect(result.valid).toBe(true);
      expect(result.discountAmount).toBe(29.99); // Capped at amount
      expect(result.finalAmount).toBe(0);
    });
  });

  describe('createPromoCode', () => {
    const mockAdminId = 'admin-123';

    it('should create a promo code successfully', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.promoCode.create as jest.Mock).mockResolvedValue({
        id: 'new-promo-123',
        code: 'NEWCODE',
        discountType: 'PERCENTAGE',
        discountValue: 15,
      });

      const result = await promoCodeService.createPromoCode(
        {
          code: 'NEWCODE',
          discountType: 'PERCENTAGE',
          discountValue: 15,
        },
        mockAdminId,
      );

      expect(prisma.promoCode.create).toHaveBeenCalled();
      expect(result.code).toBe('NEWCODE');
    });

    it('should throw error for duplicate code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing',
        code: 'EXISTING',
      });

      await expect(
        promoCodeService.createPromoCode(
          {
            code: 'EXISTING',
            discountType: 'PERCENTAGE',
            discountValue: 15,
          },
          mockAdminId,
        ),
      ).rejects.toThrow('A promo code with this code already exists');
    });

    it('should throw error for percentage > 100', async () => {
      await expect(
        promoCodeService.createPromoCode(
          {
            code: 'INVALID',
            discountType: 'PERCENTAGE',
            discountValue: 150,
          },
          mockAdminId,
        ),
      ).rejects.toThrow('Percentage discount cannot exceed 100%');
    });

    it('should throw error for non-positive discount value', async () => {
      await expect(
        promoCodeService.createPromoCode(
          {
            code: 'INVALID',
            discountType: 'FIXED_AMOUNT',
            discountValue: 0,
          },
          mockAdminId,
        ),
      ).rejects.toThrow('Discount value must be positive');
    });

    it('should uppercase the code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.promoCode.create as jest.Mock).mockImplementation(({ data }) => ({
        id: 'new-promo',
        ...data,
      }));

      await promoCodeService.createPromoCode(
        {
          code: 'lowercase',
          discountType: 'PERCENTAGE',
          discountValue: 10,
        },
        mockAdminId,
      );

      expect(prisma.promoCode.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            code: 'LOWERCASE',
          }),
        }),
      );
    });
  });

  describe('applyPromoCode', () => {
    it('should create usage and increment counter', async () => {
      const mockUsage = {
        id: 'usage-123',
        promoCodeId: 'promo-123',
        userId: 'user-123',
      };

      (prisma.promoCodeUsage.create as jest.Mock).mockResolvedValue(mockUsage);
      (prisma.promoCode.update as jest.Mock).mockResolvedValue({});

      const result = await promoCodeService.applyPromoCode(
        'TEST20',
        'user-123',
        'SUBSCRIPTION',
        'txn-123',
        29.99,
        6.0,
        23.99,
      );

      expect(prisma.promoCodeUsage.create).toHaveBeenCalled();
      expect(prisma.promoCode.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { currentUses: { increment: 1 } },
        }),
      );
      expect(result).toEqual(mockUsage);
    });
  });

  describe('listPromoCodes', () => {
    it('should list promo codes with pagination', async () => {
      const mockCodes = [
        { id: '1', code: 'CODE1' },
        { id: '2', code: 'CODE2' },
      ];

      (prisma.promoCode.findMany as jest.Mock).mockResolvedValue(mockCodes);
      (prisma.promoCode.count as jest.Mock).mockResolvedValue(25);

      const result = await promoCodeService.listPromoCodes({
        page: 1,
        limit: 20,
      });

      expect(result.promoCodes).toEqual(mockCodes);
      expect(result.total).toBe(25);
      expect(result.totalPages).toBe(2);
    });

    it('should filter by active status', async () => {
      (prisma.promoCode.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.promoCode.count as jest.Mock).mockResolvedValue(0);

      await promoCodeService.listPromoCodes({
        isActive: true,
      });

      expect(prisma.promoCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });

    it('should filter by search term', async () => {
      (prisma.promoCode.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.promoCode.count as jest.Mock).mockResolvedValue(0);

      await promoCodeService.listPromoCodes({
        search: 'summer',
      });

      expect(prisma.promoCode.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { code: { contains: 'summer', mode: 'insensitive' } },
              { description: { contains: 'summer', mode: 'insensitive' } },
            ],
          }),
        }),
      );
    });
  });

  describe('deactivatePromoCode', () => {
    it('should deactivate a promo code', async () => {
      const mockCode = {
        id: 'promo-123',
        code: 'TEST',
        isActive: false,
        stripePromoId: null,
      };

      (prisma.promoCode.update as jest.Mock).mockResolvedValue(mockCode);

      const result = await promoCodeService.deactivatePromoCode('promo-123');

      expect(prisma.promoCode.update).toHaveBeenCalledWith({
        where: { id: 'promo-123' },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('deletePromoCode', () => {
    it('should delete a promo code with no usages', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        id: 'promo-123',
        code: 'TEST',
        stripeCouponId: null,
        _count: { usages: 0 },
      });
      (prisma.promoCode.delete as jest.Mock).mockResolvedValue({});

      const result = await promoCodeService.deletePromoCode('promo-123');

      expect(prisma.promoCode.delete).toHaveBeenCalledWith({
        where: { id: 'promo-123' },
      });
      expect(result.success).toBe(true);
    });

    it('should throw error when deleting code with usages', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue({
        id: 'promo-123',
        code: 'TEST',
        _count: { usages: 5 },
      });

      await expect(
        promoCodeService.deletePromoCode('promo-123'),
      ).rejects.toThrow('Cannot delete a promo code that has been used');
    });

    it('should throw error for non-existent code', async () => {
      (prisma.promoCode.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        promoCodeService.deletePromoCode('non-existent'),
      ).rejects.toThrow('Promo code not found');
    });
  });
});
