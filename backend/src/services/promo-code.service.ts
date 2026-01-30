/**
 * Promo Code Service
 * Handles promo code creation, validation, and application with Stripe integration
 */

import Stripe from 'stripe';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import config from '../config/config';
import { DiscountType, ApplicableTo, Prisma } from '@prisma/client';

// Types
interface CreatePromoCodeInput {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  minPurchaseAmount?: number;
  applicableTo?: ApplicableTo;
  allowedPlans?: string[];
  description?: string;
  metadata?: Record<string, any>;
}

interface ValidatePromoCodeResult {
  valid: boolean;
  promoCode?: any;
  error?: string;
  discountAmount?: number;
  finalAmount?: number;
}

interface ListPromoCodesOptions {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

class PromoCodeService {
  private stripe: Stripe | null = null;

  constructor() {
    const secretKey = config.payment?.stripe?.secretKey;
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2025-10-29.clover' as any,
      });
    } else {
      logger.warn('Stripe not configured - promo code Stripe sync disabled');
    }
  }

  /**
   * Create a new promo code (admin only)
   */
  async createPromoCode(input: CreatePromoCodeInput, adminId: string) {
    const code = input.code.toUpperCase().trim();

    // Validation
    if (input.discountType === 'PERCENTAGE' && input.discountValue > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    if (input.discountValue <= 0) {
      throw new Error('Discount value must be positive');
    }

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      throw new Error('A promo code with this code already exists');
    }

    let stripeCouponId: string | undefined;
    let stripePromoId: string | undefined;

    // Create Stripe coupon and promotion code
    if (this.stripe) {
      try {
        const stripeCoupon = await this.stripe.coupons.create({
          ...(input.discountType === 'PERCENTAGE'
            ? { percent_off: input.discountValue }
            : { amount_off: Math.round(input.discountValue * 100), currency: 'eur' }),
          duration: 'once',
          max_redemptions: input.maxUses || undefined,
          redeem_by: input.validUntil
            ? Math.floor(input.validUntil.getTime() / 1000)
            : undefined,
          metadata: {
            cleack_code: code,
            applicable_to: input.applicableTo || 'ALL',
          },
        });

        stripeCouponId = stripeCoupon.id;

        const stripePromoCode = await this.stripe.promotionCodes.create({
          promotion: {
            type: 'coupon',
            coupon: stripeCoupon.id,
          },
          code: code,
          max_redemptions: input.maxUses || undefined,
          expires_at: input.validUntil
            ? Math.floor(input.validUntil.getTime() / 1000)
            : undefined,
          restrictions: {
            first_time_transaction: false,
            minimum_amount: input.minPurchaseAmount
              ? Math.round(input.minPurchaseAmount * 100)
              : undefined,
            minimum_amount_currency: input.minPurchaseAmount ? 'eur' : undefined,
          },
        });

        stripePromoId = stripePromoCode.id;

        logger.info('Stripe coupon and promo code created', {
          code,
          stripeCouponId,
          stripePromoId,
        });
      } catch (error: any) {
        logger.error('Failed to create Stripe coupon', { error: error.message, code });
        // Continue without Stripe sync - we can retry later
      }
    }

    // Create in database
    const promoCode = await prisma.promoCode.create({
      data: {
        code,
        discountType: input.discountType,
        discountValue: input.discountValue,
        maxUses: input.maxUses,
        maxUsesPerUser: input.maxUsesPerUser || 1,
        validFrom: input.validFrom || new Date(),
        validUntil: input.validUntil,
        minPurchaseAmount: input.minPurchaseAmount,
        applicableTo: input.applicableTo || 'ALL',
        allowedPlans: input.allowedPlans || [],
        description: input.description,
        stripeCouponId,
        stripePromoId,
        createdBy: adminId,
        metadata: input.metadata || {},
      },
    });

    logger.info('Promo code created', { code, adminId, id: promoCode.id });
    return promoCode;
  }

  /**
   * Validate a promo code for a user
   */
  async validatePromoCode(
    code: string,
    userId: string,
    purchaseType: 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H',
    amount: number,
    planId?: string,
  ): Promise<ValidatePromoCodeResult> {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
      include: {
        usages: {
          where: { userId },
        },
      },
    });

    // Basic validation
    if (!promoCode) {
      return { valid: false, error: 'Code promo invalide' };
    }

    if (!promoCode.isActive) {
      return { valid: false, error: "Ce code promo n'est plus actif" };
    }

    const now = new Date();
    if (promoCode.validFrom > now) {
      return { valid: false, error: "Ce code promo n'est pas encore valide" };
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return { valid: false, error: 'Ce code promo a expiré' };
    }

    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return { valid: false, error: "Ce code promo a atteint sa limite d'utilisation" };
    }

    // Check per-user usage
    if (promoCode.usages.length >= promoCode.maxUsesPerUser) {
      return { valid: false, error: 'Vous avez déjà utilisé ce code promo' };
    }

    // Check purchase type
    if (promoCode.applicableTo !== 'ALL') {
      const typeMap: Record<string, ApplicableTo> = {
        SUBSCRIPTION: 'SUBSCRIPTION',
        CREDITS: 'CREDITS',
        PASS_48H: 'PASS_48H',
      };

      if (promoCode.applicableTo !== typeMap[purchaseType]) {
        const typeNames: Record<string, string> = {
          SUBSCRIPTION: 'abonnements',
          CREDITS: 'packs de crédits',
          PASS_48H: 'pass 48h',
        };
        return {
          valid: false,
          error: `Ce code est valable uniquement pour les ${typeNames[promoCode.applicableTo]}`,
        };
      }
    }

    // Check allowed plans
    if (
      promoCode.allowedPlans.length > 0 &&
      planId &&
      !promoCode.allowedPlans.includes(planId)
    ) {
      return { valid: false, error: "Ce code n'est pas valable pour ce plan" };
    }

    // Check minimum purchase amount
    if (
      promoCode.minPurchaseAmount &&
      amount < Number(promoCode.minPurchaseAmount)
    ) {
      return {
        valid: false,
        error: `Montant minimum requis: ${promoCode.minPurchaseAmount}€`,
      };
    }

    // Calculate discount
    let discountAmount: number;
    if (promoCode.discountType === 'PERCENTAGE') {
      discountAmount = amount * (Number(promoCode.discountValue) / 100);
    } else {
      discountAmount = Math.min(Number(promoCode.discountValue), amount);
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return {
      valid: true,
      promoCode,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round(finalAmount * 100) / 100,
    };
  }

  /**
   * Apply a promo code after successful payment
   */
  async applyPromoCode(
    code: string,
    userId: string,
    transactionType: string,
    transactionId: string | null,
    originalAmount: number,
    discountAmount: number,
    finalAmount: number,
  ) {
    return await prisma.$transaction(async (tx) => {
      // Create usage record
      const usage = await tx.promoCodeUsage.create({
        data: {
          promoCode: { connect: { code: code.toUpperCase().trim() } },
          user: { connect: { id: userId } },
          transactionType,
          transactionId,
          originalAmount,
          discountAmount,
          finalAmount,
        },
      });

      // Increment usage counter
      await tx.promoCode.update({
        where: { code: code.toUpperCase().trim() },
        data: { currentUses: { increment: 1 } },
      });

      logger.info('Promo code applied', {
        code,
        userId,
        discountAmount,
        transactionId,
      });

      return usage;
    });
  }

  /**
   * List promo codes (admin)
   */
  async listPromoCodes(options: ListPromoCodesOptions = {}) {
    const { page = 1, limit = 20, isActive, search } = options;

    const where: Prisma.PromoCodeWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [promoCodes, total] = await Promise.all([
      prisma.promoCode.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { usages: true } },
        },
      }),
      prisma.promoCode.count({ where }),
    ]);

    return {
      promoCodes,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
  }

  /**
   * Get promo code by ID
   */
  async getPromoCodeById(id: string) {
    return prisma.promoCode.findUnique({
      where: { id },
      include: {
        _count: { select: { usages: true } },
      },
    });
  }

  /**
   * Get promo code stats
   */
  async getPromoCodeStats(codeId: string) {
    const [promoCode, usages] = await Promise.all([
      prisma.promoCode.findUnique({
        where: { id: codeId },
        include: { _count: { select: { usages: true } } },
      }),
      prisma.promoCodeUsage.findMany({
        where: { promoCodeId: codeId },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
        orderBy: { usedAt: 'desc' },
        take: 50,
      }),
    ]);

    if (!promoCode) {
      throw new Error('Promo code not found');
    }

    const totalDiscount = usages.reduce(
      (sum, u) => sum + Number(u.discountAmount),
      0,
    );

    const totalRevenue = usages.reduce(
      (sum, u) => sum + Number(u.finalAmount),
      0,
    );

    return {
      promoCode,
      totalUsages: usages.length,
      totalDiscountGiven: Math.round(totalDiscount * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentUsages: usages,
    };
  }

  /**
   * Update a promo code
   */
  async updatePromoCode(
    id: string,
    updates: Partial<{
      description: string;
      maxUses: number | null;
      maxUsesPerUser: number;
      validUntil: Date | null;
      minPurchaseAmount: number | null;
      isActive: boolean;
    }>,
  ) {
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: updates,
    });

    logger.info('Promo code updated', { id, updates });
    return promoCode;
  }

  /**
   * Deactivate a promo code
   */
  async deactivatePromoCode(id: string) {
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: { isActive: false },
    });

    // Deactivate on Stripe
    if (this.stripe && promoCode.stripePromoId) {
      try {
        await this.stripe.promotionCodes.update(promoCode.stripePromoId, {
          active: false,
        });
        logger.info('Stripe promo code deactivated', {
          id,
          stripePromoId: promoCode.stripePromoId,
        });
      } catch (error: any) {
        logger.error('Failed to deactivate Stripe promo code', {
          error: error.message,
          id,
        });
      }
    }

    logger.info('Promo code deactivated', { id, code: promoCode.code });
    return promoCode;
  }

  /**
   * Reactivate a promo code
   */
  async reactivatePromoCode(id: string) {
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: { isActive: true },
    });

    // Reactivate on Stripe
    if (this.stripe && promoCode.stripePromoId) {
      try {
        await this.stripe.promotionCodes.update(promoCode.stripePromoId, {
          active: true,
        });
      } catch (error: any) {
        logger.error('Failed to reactivate Stripe promo code', {
          error: error.message,
          id,
        });
      }
    }

    logger.info('Promo code reactivated', { id, code: promoCode.code });
    return promoCode;
  }

  /**
   * Delete a promo code (only if never used)
   */
  async deletePromoCode(id: string) {
    const promoCode = await prisma.promoCode.findUnique({
      where: { id },
      include: { _count: { select: { usages: true } } },
    });

    if (!promoCode) {
      throw new Error('Promo code not found');
    }

    if (promoCode._count.usages > 0) {
      throw new Error(
        'Cannot delete a promo code that has been used. Deactivate it instead.',
      );
    }

    // Delete from Stripe
    if (this.stripe && promoCode.stripeCouponId) {
      try {
        await this.stripe.coupons.del(promoCode.stripeCouponId);
        logger.info('Stripe coupon deleted', {
          id,
          stripeCouponId: promoCode.stripeCouponId,
        });
      } catch (error: any) {
        logger.error('Failed to delete Stripe coupon', {
          error: error.message,
          id,
        });
      }
    }

    await prisma.promoCode.delete({ where: { id } });
    logger.info('Promo code deleted', { id, code: promoCode.code });

    return { success: true };
  }

  /**
   * Get Stripe promo ID for checkout
   */
  async getStripePromoId(code: string): Promise<string | null> {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
      select: { stripePromoId: true, isActive: true },
    });

    if (!promoCode || !promoCode.isActive) {
      return null;
    }

    return promoCode.stripePromoId;
  }
}

// Export singleton instance
export const promoCodeService = new PromoCodeService();
