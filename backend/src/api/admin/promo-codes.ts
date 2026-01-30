/**
 * Admin Promo Codes API
 * CRUD operations for promo codes management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { promoCodeService } from '../../services/promo-code.service';
import { logger } from '../../utils/logger';

const router = Router();

// All routes require auth + admin
router.use(authMiddleware);
router.use(requireAdmin);

// Validation schemas
const createPromoCodeSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(30, 'Code must be at most 30 characters')
    .regex(/^[A-Z0-9_-]+$/i, 'Code can only contain letters, numbers, hyphens and underscores'),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().positive('Discount value must be positive'),
  maxUses: z.number().int().positive().optional().nullable(),
  maxUsesPerUser: z.number().int().positive().default(1),
  validFrom: z.string().optional(),
  validUntil: z.string().optional().nullable(),
  minPurchaseAmount: z.number().positive().optional().nullable(),
  applicableTo: z.enum(['ALL', 'SUBSCRIPTION', 'CREDITS', 'PASS_48H']).default('ALL'),
  allowedPlans: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const updatePromoCodeSchema = z.object({
  description: z.string().max(500).optional(),
  maxUses: z.number().int().positive().optional().nullable(),
  maxUsesPerUser: z.number().int().positive().optional(),
  validUntil: z.string().optional().nullable(),
  minPurchaseAmount: z.number().positive().optional().nullable(),
  isActive: z.boolean().optional(),
});

/**
 * POST /admin/promo-codes
 * Create a new promo code
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createPromoCodeSchema.parse(req.body);

    // Additional validation for percentage
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
      return res.status(400).json({ error: 'Percentage discount cannot exceed 100%' });
    }

    const promoCode = await promoCodeService.createPromoCode(
      {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        maxUses: data.maxUses ?? undefined,
        minPurchaseAmount: data.minPurchaseAmount ?? undefined,
      },
      req.user!.id,
    );

    res.status(201).json(promoCode);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      });
    }
    logger.error('Failed to create promo code', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /admin/promo-codes
 * List all promo codes with pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string | undefined;
    
    let isActive: boolean | undefined;
    if (req.query.active === 'true') isActive = true;
    else if (req.query.active === 'false') isActive = false;

    const result = await promoCodeService.listPromoCodes({
      page,
      limit,
      isActive,
      search,
    });

    res.json(result);
  } catch (error: any) {
    logger.error('Failed to list promo codes', { error: error.message });
    res.status(500).json({ error: 'Failed to list promo codes' });
  }
});

/**
 * GET /admin/promo-codes/:id
 * Get a single promo code
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const promoCode = await promoCodeService.getPromoCodeById(req.params.id);

    if (!promoCode) {
      return res.status(404).json({ error: 'Promo code not found' });
    }

    res.json(promoCode);
  } catch (error: any) {
    logger.error('Failed to get promo code', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get promo code' });
  }
});

/**
 * GET /admin/promo-codes/:id/stats
 * Get detailed stats for a promo code
 */
router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const stats = await promoCodeService.getPromoCodeStats(req.params.id);
    res.json(stats);
  } catch (error: any) {
    if (error.message === 'Promo code not found') {
      return res.status(404).json({ error: error.message });
    }
    logger.error('Failed to get promo code stats', { error: error.message, id: req.params.id });
    res.status(500).json({ error: 'Failed to get promo code stats' });
  }
});

/**
 * PATCH /admin/promo-codes/:id
 * Update a promo code
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = updatePromoCodeSchema.parse(req.body);

    const promoCode = await promoCodeService.updatePromoCode(req.params.id, {
      ...data,
      validUntil: data.validUntil ? new Date(data.validUntil) : data.validUntil === null ? null : undefined,
      maxUses: data.maxUses ?? undefined,
      minPurchaseAmount: data.minPurchaseAmount ?? undefined,
    });

    res.json(promoCode);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.issues,
      });
    }
    logger.error('Failed to update promo code', { error: error.message, id: req.params.id });
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /admin/promo-codes/:id/deactivate
 * Deactivate a promo code
 */
router.post('/:id/deactivate', async (req: Request, res: Response) => {
  try {
    const promoCode = await promoCodeService.deactivatePromoCode(req.params.id);
    res.json(promoCode);
  } catch (error: any) {
    logger.error('Failed to deactivate promo code', { error: error.message, id: req.params.id });
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /admin/promo-codes/:id/reactivate
 * Reactivate a promo code
 */
router.post('/:id/reactivate', async (req: Request, res: Response) => {
  try {
    const promoCode = await promoCodeService.reactivatePromoCode(req.params.id);
    res.json(promoCode);
  } catch (error: any) {
    logger.error('Failed to reactivate promo code', { error: error.message, id: req.params.id });
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /admin/promo-codes/:id
 * Delete a promo code (only if never used)
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await promoCodeService.deletePromoCode(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Promo code not found') {
      return res.status(404).json({ error: error.message });
    }
    logger.error('Failed to delete promo code', { error: error.message, id: req.params.id });
    res.status(400).json({ error: error.message });
  }
});

export default router;
