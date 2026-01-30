/**
 * Public Promo Code API
 * Validation endpoint for users to check promo codes before checkout
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../../middleware/auth.middleware';
import { promoCodeService } from '../../services/promo-code.service';
import { logger } from '../../utils/logger';

const router = Router();

// Validation schema
const validatePromoSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  purchaseType: z.enum(['SUBSCRIPTION', 'CREDITS', 'PASS_48H']),
  amount: z.number().positive('Amount must be positive'),
  planId: z.string().optional(),
});

/**
 * POST /payments/promo/validate
 * Validate a promo code for the current user
 */
router.post('/validate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = validatePromoSchema.parse(req.body);

    const result = await promoCodeService.validatePromoCode(
      data.code,
      req.user!.id,
      data.purchaseType,
      data.amount,
      data.planId,
    );

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.error,
      });
    }

    res.json({
      valid: true,
      code: result.promoCode!.code,
      discountType: result.promoCode!.discountType,
      discountValue: Number(result.promoCode!.discountValue),
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid request',
        details: error.issues,
      });
    }
    logger.error('Failed to validate promo code', { error: error.message });
    res.status(500).json({
      valid: false,
      error: 'Failed to validate promo code',
    });
  }
});

/**
 * GET /payments/promo/check/:code
 * Quick check if a promo code exists and is active (no auth required)
 * Does NOT reveal discount details - just existence
 */
router.get('/check/:code', async (req: Request, res: Response) => {
  try {
    const code = req.params.code.toUpperCase().trim();

    const stripePromoId = await promoCodeService.getStripePromoId(code);

    res.json({
      exists: !!stripePromoId,
    });
  } catch (error: any) {
    logger.error('Failed to check promo code', { error: error.message });
    res.status(500).json({ exists: false });
  }
});

export default router;
