# 🎫 Plan d'Implémentation - Codes Promo Cleack

## Vue d'ensemble

Intégration complète des codes promo avec synchronisation Stripe pour :
- Réductions pourcentage ou montant fixe
- Applicable aux subscriptions ET credit packs
- Gestion admin complète
- Tracking analytics

---

## 📊 1. DATABASE SCHEMA

### Nouvelle table `promo_codes`

```prisma
// Ajouter dans schema.prisma

model PromoCode {
  id                String           @id @default(uuid())
  code              String           @unique          // "SUMMER24", "INFLUENCER50"
  
  // Type de réduction
  discountType      DiscountType     @default(PERCENTAGE)
  discountValue     Decimal          @db.Decimal(10, 2)  // 20 pour 20% ou 20€
  
  // Contraintes
  maxUses           Int?             // null = illimité
  maxUsesPerUser    Int              @default(1)
  currentUses       Int              @default(0)
  
  // Validité
  validFrom         DateTime         @default(now())
  validUntil        DateTime?        // null = pas d'expiration
  isActive          Boolean          @default(true)
  
  // Restrictions
  minPurchaseAmount Decimal?         @db.Decimal(10, 2)  // Montant minimum
  applicableTo      ApplicableTo     @default(ALL)       // ALL, SUBSCRIPTION, CREDITS
  allowedPlans      String[]         @default([])        // ["monthly", "annual"] ou vide = tous
  
  // Stripe sync
  stripeCouponId    String?          @unique
  stripePromoId     String?          @unique
  
  // Metadata
  description       String?
  createdBy         String?          // Admin qui l'a créé
  metadata          Json?            // Données arbitraires (campagne, source, etc.)
  
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  // Relations
  usages            PromoCodeUsage[]

  @@index([code])
  @@index([isActive, validUntil])
  @@map("promo_codes")
}

model PromoCodeUsage {
  id              String      @id @default(uuid())
  promoCodeId     String
  userId          String
  
  // Transaction associée
  transactionType String      // "subscription" | "credit_pack" | "48h_pass"
  transactionId   String?     // ID de la transaction Stripe
  
  // Montant économisé
  discountAmount  Decimal     @db.Decimal(10, 2)
  originalAmount  Decimal     @db.Decimal(10, 2)
  finalAmount     Decimal     @db.Decimal(10, 2)
  
  usedAt          DateTime    @default(now())
  
  // Relations
  promoCode       PromoCode   @relation(fields: [promoCodeId], references: [id], onDelete: Cascade)
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([promoCodeId, userId, transactionId])
  @@index([promoCodeId])
  @@index([userId])
  @@map("promo_code_usages")
}

enum DiscountType {
  PERCENTAGE    // 20% off
  FIXED_AMOUNT  // 20€ off
}

enum ApplicableTo {
  ALL           // Tout
  SUBSCRIPTION  // Subscriptions seulement
  CREDITS       // Packs de crédits seulement
  PASS_48H      // Pass 48h seulement
}

// Ajouter relation dans User
model User {
  // ... existing fields
  promoCodeUsages   PromoCodeUsage[]
}
```

---

## 🔧 2. BACKEND - Services & API

### 2.1 PromoCode Service

```typescript
// backend/src/services/promo-code.service.ts

import Stripe from 'stripe';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import config from '../config/config';

interface CreatePromoCodeInput {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses?: number;
  maxUsesPerUser?: number;
  validFrom?: Date;
  validUntil?: Date;
  minPurchaseAmount?: number;
  applicableTo?: 'ALL' | 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H';
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

class PromoCodeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.payment.stripe.secretKey, {
      apiVersion: '2025-10-29.clover',
    });
  }

  /**
   * Créer un code promo (admin)
   */
  async createPromoCode(input: CreatePromoCodeInput, adminId: string) {
    // 1. Validation
    if (input.discountType === 'PERCENTAGE' && input.discountValue > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    // 2. Créer le coupon Stripe
    const stripeCoupon = await this.stripe.coupons.create({
      ...(input.discountType === 'PERCENTAGE'
        ? { percent_off: input.discountValue }
        : { amount_off: Math.round(input.discountValue * 100), currency: 'eur' }),
      duration: 'once', // Pour les subscriptions: 'once' | 'repeating' | 'forever'
      max_redemptions: input.maxUses || undefined,
      redeem_by: input.validUntil ? Math.floor(input.validUntil.getTime() / 1000) : undefined,
      metadata: {
        cleack_code: input.code,
        applicable_to: input.applicableTo || 'ALL',
      },
    });

    // 3. Créer le promotion code Stripe (code visible par l'utilisateur)
    const stripePromoCode = await this.stripe.promotionCodes.create({
      coupon: stripeCoupon.id,
      code: input.code.toUpperCase(),
      max_redemptions: input.maxUses || undefined,
      expires_at: input.validUntil ? Math.floor(input.validUntil.getTime() / 1000) : undefined,
      restrictions: {
        first_time_transaction: false,
        minimum_amount: input.minPurchaseAmount
          ? Math.round(input.minPurchaseAmount * 100)
          : undefined,
        minimum_amount_currency: input.minPurchaseAmount ? 'eur' : undefined,
      },
    });

    // 4. Créer en base de données
    const promoCode = await prisma.promoCode.create({
      data: {
        code: input.code.toUpperCase(),
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
        stripeCouponId: stripeCoupon.id,
        stripePromoId: stripePromoCode.id,
        createdBy: adminId,
        metadata: input.metadata,
      },
    });

    logger.info('Promo code created', { code: input.code, adminId });
    return promoCode;
  }

  /**
   * Valider un code promo pour un utilisateur
   */
  async validatePromoCode(
    code: string,
    userId: string,
    purchaseType: 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H',
    amount: number,
    planId?: string,
  ): Promise<ValidatePromoCodeResult> {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        usages: {
          where: { userId },
        },
      },
    });

    // Vérifications
    if (!promoCode) {
      return { valid: false, error: 'Code promo invalide' };
    }

    if (!promoCode.isActive) {
      return { valid: false, error: 'Ce code promo n\'est plus actif' };
    }

    const now = new Date();
    if (promoCode.validFrom > now) {
      return { valid: false, error: 'Ce code promo n\'est pas encore valide' };
    }

    if (promoCode.validUntil && promoCode.validUntil < now) {
      return { valid: false, error: 'Ce code promo a expiré' };
    }

    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return { valid: false, error: 'Ce code promo a atteint sa limite d\'utilisation' };
    }

    // Vérifier usage par user
    if (promoCode.usages.length >= promoCode.maxUsesPerUser) {
      return { valid: false, error: 'Vous avez déjà utilisé ce code promo' };
    }

    // Vérifier le type d'achat
    if (promoCode.applicableTo !== 'ALL' && promoCode.applicableTo !== purchaseType) {
      const typeNames = {
        SUBSCRIPTION: 'abonnements',
        CREDITS: 'packs de crédits',
        PASS_48H: 'pass 48h',
      };
      return { valid: false, error: `Ce code est valable uniquement pour les ${typeNames[promoCode.applicableTo]}` };
    }

    // Vérifier le plan spécifique
    if (promoCode.allowedPlans.length > 0 && planId && !promoCode.allowedPlans.includes(planId)) {
      return { valid: false, error: 'Ce code n\'est pas valable pour ce plan' };
    }

    // Vérifier montant minimum
    if (promoCode.minPurchaseAmount && amount < Number(promoCode.minPurchaseAmount)) {
      return {
        valid: false,
        error: `Montant minimum requis: ${promoCode.minPurchaseAmount}€`,
      };
    }

    // Calculer la réduction
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
   * Appliquer un code promo (après paiement réussi)
   */
  async applyPromoCode(
    code: string,
    userId: string,
    transactionType: string,
    transactionId: string,
    originalAmount: number,
    discountAmount: number,
    finalAmount: number,
  ) {
    return await prisma.$transaction(async (tx) => {
      // Créer l'usage
      const usage = await tx.promoCodeUsage.create({
        data: {
          promoCode: { connect: { code: code.toUpperCase() } },
          user: { connect: { id: userId } },
          transactionType,
          transactionId,
          originalAmount,
          discountAmount,
          finalAmount,
        },
      });

      // Incrémenter le compteur
      await tx.promoCode.update({
        where: { code: code.toUpperCase() },
        data: { currentUses: { increment: 1 } },
      });

      logger.info('Promo code applied', { code, userId, discountAmount });
      return usage;
    });
  }

  /**
   * Liste des codes promo (admin)
   */
  async listPromoCodes(options: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
  }) {
    const { page = 1, limit = 20, isActive, search } = options;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [codes, total] = await Promise.all([
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
      promoCodes: codes,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Stats d'un code promo
   */
  async getPromoCodeStats(codeId: string) {
    const [promoCode, usages] = await Promise.all([
      prisma.promoCode.findUnique({ where: { id: codeId } }),
      prisma.promoCodeUsage.findMany({
        where: { promoCodeId: codeId },
        include: { user: { select: { email: true } } },
        orderBy: { usedAt: 'desc' },
      }),
    ]);

    const totalDiscount = usages.reduce(
      (sum, u) => sum + Number(u.discountAmount),
      0,
    );

    return {
      promoCode,
      totalUsages: usages.length,
      totalDiscountGiven: totalDiscount,
      recentUsages: usages.slice(0, 20),
    };
  }

  /**
   * Désactiver un code promo
   */
  async deactivatePromoCode(codeId: string) {
    const promoCode = await prisma.promoCode.update({
      where: { id: codeId },
      data: { isActive: false },
    });

    // Désactiver aussi sur Stripe
    if (promoCode.stripePromoId) {
      await this.stripe.promotionCodes.update(promoCode.stripePromoId, {
        active: false,
      });
    }

    return promoCode;
  }

  /**
   * Supprimer un code promo
   */
  async deletePromoCode(codeId: string) {
    const promoCode = await prisma.promoCode.findUnique({
      where: { id: codeId },
      include: { _count: { select: { usages: true } } },
    });

    if (!promoCode) throw new Error('Promo code not found');
    
    if (promoCode._count.usages > 0) {
      throw new Error('Cannot delete a promo code that has been used. Deactivate it instead.');
    }

    // Supprimer sur Stripe
    if (promoCode.stripeCouponId) {
      await this.stripe.coupons.del(promoCode.stripeCouponId);
    }

    await prisma.promoCode.delete({ where: { id: codeId } });
    return { success: true };
  }
}

export const promoCodeService = new PromoCodeService();
```

### 2.2 API Routes Admin

```typescript
// backend/src/api/admin/promo-codes.ts

import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { promoCodeService } from '../../services/promo-code.service';
import { z } from 'zod';

const router = Router();
router.use(authMiddleware);
router.use(requireAdmin);

// Validation schemas
const createPromoCodeSchema = z.object({
  code: z.string().min(3).max(30).regex(/^[A-Z0-9_-]+$/i),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().optional(),
  maxUsesPerUser: z.number().int().positive().default(1),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
  minPurchaseAmount: z.number().positive().optional(),
  applicableTo: z.enum(['ALL', 'SUBSCRIPTION', 'CREDITS', 'PASS_48H']).default('ALL'),
  allowedPlans: z.array(z.string()).optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /admin/promo-codes
 * Créer un nouveau code promo
 */
router.post('/', async (req, res) => {
  try {
    const data = createPromoCodeSchema.parse(req.body);
    const promoCode = await promoCodeService.createPromoCode(
      {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
      req.user!.id,
    );
    res.status(201).json(promoCode);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /admin/promo-codes
 * Lister les codes promo
 */
router.get('/', async (req, res) => {
  try {
    const result = await promoCodeService.listPromoCodes({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      isActive: req.query.active === 'true' ? true : req.query.active === 'false' ? false : undefined,
      search: req.query.search as string,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /admin/promo-codes/:id/stats
 * Stats détaillées d'un code
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await promoCodeService.getPromoCodeStats(req.params.id);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /admin/promo-codes/:id/deactivate
 * Désactiver un code
 */
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const promoCode = await promoCodeService.deactivatePromoCode(req.params.id);
    res.json(promoCode);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /admin/promo-codes/:id
 * Supprimer un code (si jamais utilisé)
 */
router.delete('/:id', async (req, res) => {
  try {
    await promoCodeService.deletePromoCode(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
```

### 2.3 API Routes Public (validation)

```typescript
// backend/src/api/payments/promo.controller.ts

import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { promoCodeService } from '../../services/promo-code.service';

const router = Router();

/**
 * POST /payments/promo/validate
 * Valider un code promo (utilisateur connecté)
 */
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, purchaseType, amount, planId } = req.body;

    if (!code || !purchaseType || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await promoCodeService.validatePromoCode(
      code,
      req.user!.id,
      purchaseType,
      amount,
      planId,
    );

    if (!result.valid) {
      return res.status(400).json({ valid: false, error: result.error });
    }

    res.json({
      valid: true,
      discountType: result.promoCode!.discountType,
      discountValue: Number(result.promoCode!.discountValue),
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### 2.4 Intégration Checkout Stripe

```typescript
// Modifier stripe.service.ts - createCheckoutSession

async createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  promoCode?: string,  // Nouveau paramètre
): Promise<Stripe.Checkout.Session> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) throw new Error('User not found');

  // Construire les options checkout
  const sessionOptions: Stripe.Checkout.SessionCreateParams = {
    customer_email: user.email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: { userId },
    },
    metadata: { userId },
  };

  // Ajouter le code promo si fourni
  if (promoCode) {
    const promo = await prisma.promoCode.findUnique({
      where: { code: promoCode.toUpperCase() },
    });
    
    if (promo?.stripePromoId) {
      sessionOptions.discounts = [{ promotion_code: promo.stripePromoId }];
    }
  } else {
    // Permettre à l'utilisateur de saisir un code dans Stripe Checkout
    sessionOptions.allow_promotion_codes = true;
  }

  return this.ensureStripe().checkout.sessions.create(sessionOptions);
}
```

---

## 🎨 3. FRONTEND WEB - Admin

### 3.1 Page Admin Promo Codes

```tsx
// frontend-web/src/pages/admin/AdminPromoCodesPage.tsx

import React, { useEffect, useState } from 'react';
import { AdminTable } from '../../components/admin/AdminTable';
import { AdminStatsCard } from '../../components/admin/AdminStatsCard';
import api from '../../services/api';
import { CreatePromoCodeModal } from '../../components/admin/CreatePromoCodeModal';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  maxUses: number | null;
  currentUses: number;
  validUntil: string | null;
  isActive: boolean;
  applicableTo: string;
  createdAt: string;
  _count: { usages: number };
}

export const AdminPromoCodesPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalCodes: 0,
    activeCodes: 0,
    totalUsages: 0,
    totalDiscount: 0,
  });

  useEffect(() => {
    loadPromoCodes();
  }, [page, filter, search]);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/promo-codes', {
        params: {
          page,
          active: filter === 'active' ? true : filter === 'expired' ? false : undefined,
          search,
        },
      });
      setPromoCodes(res.data.promoCodes);
      setTotalPages(res.data.totalPages);
      
      // Calculer les stats
      setStats({
        totalCodes: res.data.total,
        activeCodes: res.data.promoCodes.filter((p: PromoCode) => p.isActive).length,
        totalUsages: res.data.promoCodes.reduce((sum: number, p: PromoCode) => sum + p._count.usages, 0),
        totalDiscount: 0, // TODO: API séparée pour ce calcul
      });
    } catch (error) {
      console.error('Failed to load promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Désactiver ce code promo ?')) return;
    try {
      await api.patch(`/admin/promo-codes/${id}/deactivate`);
      loadPromoCodes();
    } catch (error) {
      console.error('Failed to deactivate:', error);
    }
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === 'PERCENTAGE') {
      return `${code.discountValue}%`;
    }
    return `${code.discountValue}€`;
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (code: PromoCode) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-accent-primary bg-accent-primary/10 px-3 py-1 rounded">
            {code.code}
          </span>
        </div>
      ),
    },
    {
      key: 'discount',
      label: 'Réduction',
      render: (code: PromoCode) => (
        <span className="font-semibold text-emerald-400">
          -{formatDiscount(code)}
        </span>
      ),
    },
    {
      key: 'applicableTo',
      label: 'Applicable à',
      render: (code: PromoCode) => {
        const labels: Record<string, string> = {
          ALL: '🌐 Tout',
          SUBSCRIPTION: '📅 Abonnements',
          CREDITS: '💳 Crédits',
          PASS_48H: '⏱️ Pass 48h',
        };
        return <span className="text-ink-secondary">{labels[code.applicableTo]}</span>;
      },
    },
    {
      key: 'usage',
      label: 'Utilisations',
      render: (code: PromoCode) => (
        <span className="text-ink-primary">
          {code.currentUses}
          {code.maxUses ? ` / ${code.maxUses}` : ' / ∞'}
        </span>
      ),
    },
    {
      key: 'validUntil',
      label: 'Expire',
      render: (code: PromoCode) => (
        <span className="text-ink-muted text-sm">
          {code.validUntil
            ? new Date(code.validUntil).toLocaleDateString('fr-FR')
            : '♾️ Jamais'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (code: PromoCode) => {
        const isExpired = code.validUntil && new Date(code.validUntil) < new Date();
        const isMaxed = code.maxUses && code.currentUses >= code.maxUses;
        
        if (!code.isActive || isExpired || isMaxed) {
          return (
            <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
              {isExpired ? '⏰ Expiré' : isMaxed ? '🚫 Épuisé' : '❌ Inactif'}
            </span>
          );
        }
        return (
          <span className="px-3 py-1 rounded-full text-sm bg-emerald-500/20 text-emerald-400">
            ✅ Actif
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (code: PromoCode) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(code.code)}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
            title="Copier"
          >
            📋
          </button>
          {code.isActive && (
            <button
              onClick={() => handleDeactivate(code.id)}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              title="Désactiver"
            >
              🚫
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AdminStatsCard title="Total codes" value={stats.totalCodes} icon="🎫" gradient="purple" />
        <AdminStatsCard title="Actifs" value={stats.activeCodes} icon="✅" gradient="green" />
        <AdminStatsCard title="Utilisations" value={stats.totalUsages} icon="📊" gradient="pink" />
        <AdminStatsCard title="Économies générées" value={`${stats.totalDiscount}€`} icon="💰" gradient="blue" />
      </div>

      {/* Header + Create button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-ink-primary">Codes Promo</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          ➕ Nouveau code
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Rechercher un code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 bg-bg-card border border-bg-hover rounded-xl text-ink-primary"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white'
                  : 'bg-bg-card border border-bg-hover text-ink-secondary'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : 'Expirés'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={promoCodes}
        loading={loading}
        pagination={{ page, totalPages, onPageChange: setPage }}
        emptyMessage="Aucun code promo"
      />

      {/* Modal création */}
      {showCreateModal && (
        <CreatePromoCodeModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadPromoCodes();
          }}
        />
      )}
    </div>
  );
};
```

### 3.2 Modal Création Code Promo

```tsx
// frontend-web/src/components/admin/CreatePromoCodeModal.tsx

import React, { useState } from 'react';
import api from '../../services/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreatePromoCodeModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    discountValue: 10,
    maxUses: '',
    maxUsesPerUser: 1,
    validUntil: '',
    minPurchaseAmount: '',
    applicableTo: 'ALL',
    allowedPlans: [] as string[],
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/admin/promo-codes', {
        ...form,
        code: form.code.toUpperCase(),
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        minPurchaseAmount: form.minPurchaseAmount ? parseFloat(form.minPurchaseAmount) : undefined,
        validUntil: form.validUntil || undefined,
      });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-bg-hover rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-bg-hover">
          <h2 className="text-xl font-bold text-ink-primary">Nouveau Code Promo</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Code promo *
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="SUMMER24"
              className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl font-mono uppercase"
              required
            />
          </div>

          {/* Type de réduction */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Type de réduction
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
              >
                <option value="PERCENTAGE">Pourcentage (%)</option>
                <option value="FIXED_AMOUNT">Montant fixe (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Valeur *
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) })}
                min={1}
                max={form.discountType === 'PERCENTAGE' ? 100 : 9999}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
                required
              />
            </div>
          </div>

          {/* Limites */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Utilisations max (total)
              </label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="Illimité"
                min={1}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Max par utilisateur
              </label>
              <input
                type="number"
                value={form.maxUsesPerUser}
                onChange={(e) => setForm({ ...form, maxUsesPerUser: parseInt(e.target.value) })}
                min={1}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
              />
            </div>
          </div>

          {/* Validité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Date d'expiration
              </label>
              <input
                type="datetime-local"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Montant min. (€)
              </label>
              <input
                type="number"
                value={form.minPurchaseAmount}
                onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })}
                placeholder="Aucun"
                min={0}
                step={0.01}
                className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
              />
            </div>
          </div>

          {/* Applicable à */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Applicable à
            </label>
            <select
              value={form.applicableTo}
              onChange={(e) => setForm({ ...form, applicableTo: e.target.value })}
              className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
            >
              <option value="ALL">Tout (abonnements + crédits)</option>
              <option value="SUBSCRIPTION">Abonnements uniquement</option>
              <option value="CREDITS">Packs de crédits uniquement</option>
              <option value="PASS_48H">Pass 48h uniquement</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-2">
              Description (interne)
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Campagne influenceur @xxx"
              className="w-full px-4 py-3 bg-bg-base border border-bg-hover rounded-xl"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? '⏳ Création...' : '✅ Créer le code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

## 🎨 4. FRONTEND WEB - Checkout User

### 4.1 Composant Saisie Code Promo

```tsx
// frontend-web/src/components/checkout/PromoCodeInput.tsx

import React, { useState } from 'react';
import api from '../../services/api';

interface Props {
  purchaseType: 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H';
  amount: number;
  planId?: string;
  onApply: (promoData: {
    code: string;
    discountAmount: number;
    finalAmount: number;
    discountType: string;
    discountValue: number;
  }) => void;
  onClear: () => void;
}

export const PromoCodeInput: React.FC<Props> = ({
  purchaseType,
  amount,
  planId,
  onApply,
  onClear,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/payments/promo/validate', {
        code: code.trim(),
        purchaseType,
        amount,
        planId,
      });

      if (res.data.valid) {
        setApplied({
          code: code.toUpperCase(),
          discountAmount: res.data.discountAmount,
          finalAmount: res.data.finalAmount,
        });
        onApply({
          code: code.toUpperCase(),
          ...res.data,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setApplied(null);
    setError('');
    onClear();
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 text-xl">🎫</span>
          <div>
            <span className="font-mono font-bold text-emerald-400">{applied.code}</span>
            <p className="text-sm text-emerald-400/80">
              -{applied.discountAmount.toFixed(2)}€ de réduction
            </p>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-400"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Code promo"
          className="flex-1 px-4 py-3 bg-bg-card border border-bg-hover rounded-xl font-mono uppercase text-ink-primary placeholder-ink-muted focus:border-accent-primary transition-colors"
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-6 py-3 bg-bg-hover rounded-xl text-ink-secondary hover:text-ink-primary disabled:opacity-50 transition-all"
        >
          {loading ? '⏳' : 'Appliquer'}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
```

### 4.2 Intégration dans PricingPage

```tsx
// Ajouter dans la page de pricing/checkout

import { PromoCodeInput } from '../components/checkout/PromoCodeInput';

// Dans le composant
const [promoData, setPromoData] = useState<{
  code: string;
  discountAmount: number;
  finalAmount: number;
} | null>(null);

// Dans le render, avant le bouton de paiement
<PromoCodeInput
  purchaseType="SUBSCRIPTION"
  amount={selectedPlan.price}
  planId={selectedPlan.id}
  onApply={(data) => setPromoData(data)}
  onClear={() => setPromoData(null)}
/>

{/* Afficher le prix final */}
<div className="mt-4 p-4 bg-bg-card rounded-xl">
  <div className="flex justify-between text-ink-secondary">
    <span>Sous-total</span>
    <span>{selectedPlan.price.toFixed(2)}€</span>
  </div>
  {promoData && (
    <div className="flex justify-between text-emerald-400">
      <span>Réduction ({promoData.code})</span>
      <span>-{promoData.discountAmount.toFixed(2)}€</span>
    </div>
  )}
  <div className="flex justify-between text-ink-primary font-bold text-lg mt-2 pt-2 border-t border-bg-hover">
    <span>Total</span>
    <span>{(promoData?.finalAmount ?? selectedPlan.price).toFixed(2)}€</span>
  </div>
</div>

// Passer le code promo au checkout
const handleCheckout = async () => {
  const res = await api.post('/payments/checkout', {
    planId: selectedPlan.id,
    promoCode: promoData?.code,
  });
  window.location.href = res.data.url;
};
```

---

## 📱 5. MOBILE (React Native)

### 5.1 Composant PromoCodeInput Mobile

```tsx
// mobile/src/components/checkout/PromoCodeInput.tsx

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../../services/api';
import { colors } from '../../theme';

interface Props {
  purchaseType: 'SUBSCRIPTION' | 'CREDITS' | 'PASS_48H';
  amount: number;
  planId?: string;
  onApply: (data: any) => void;
  onClear: () => void;
}

export const PromoCodeInput: React.FC<Props> = ({
  purchaseType,
  amount,
  planId,
  onApply,
  onClear,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<any>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/payments/promo/validate', {
        code: code.trim(),
        purchaseType,
        amount,
        planId,
      });

      if (res.data.valid) {
        setApplied({ code: code.toUpperCase(), ...res.data });
        onApply({ code: code.toUpperCase(), ...res.data });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setApplied(null);
    setError('');
    onClear();
  };

  if (applied) {
    return (
      <View style={styles.appliedContainer}>
        <View style={styles.appliedInfo}>
          <Text style={styles.appliedIcon}>🎫</Text>
          <View>
            <Text style={styles.appliedCode}>{applied.code}</Text>
            <Text style={styles.appliedDiscount}>
              -{applied.discountAmount.toFixed(2)}€ de réduction
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={code}
          onChangeText={(text) => setCode(text.toUpperCase())}
          placeholder="Code promo"
          placeholderTextColor={colors.inkMuted}
          style={styles.input}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          onPress={handleApply}
          disabled={loading || !code.trim()}
          style={[styles.applyButton, (loading || !code.trim()) && styles.applyButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.inkPrimary} />
          ) : (
            <Text style={styles.applyButtonText}>Appliquer</Text>
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.bgHover,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.inkPrimary,
    fontFamily: 'monospace',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: colors.bgHover,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    color: colors.inkSecondary,
    fontWeight: '600',
  },
  error: {
    color: colors.red,
    fontSize: 14,
    marginTop: 8,
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  appliedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appliedIcon: {
    fontSize: 24,
  },
  appliedCode: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#10B981',
    fontSize: 16,
  },
  appliedDiscount: {
    color: 'rgba(16, 185, 129, 0.8)',
    fontSize: 14,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#10B981',
    fontSize: 18,
  },
});
```

---

## 🔄 6. MIGRATION & DÉPLOIEMENT

### 6.1 Migration Prisma

```bash
# 1. Ajouter le schema ci-dessus dans schema.prisma

# 2. Générer la migration
cd backend
npx prisma migrate dev --name add_promo_codes

# 3. Générer le client
npx prisma generate
```

### 6.2 Routes à ajouter

```typescript
// backend/src/index.ts ou app.ts

import promoCodesAdminRouter from './api/admin/promo-codes';
import promoRouter from './api/payments/promo.controller';

// Admin routes
app.use('/admin/promo-codes', promoCodesAdminRouter);

// Public routes
app.use('/payments/promo', promoRouter);
```

### 6.3 Frontend - Route admin

```tsx
// frontend-web/src/App.tsx - ajouter la route

import { AdminPromoCodesPage } from './pages/admin/AdminPromoCodesPage';

// Dans les routes admin
<Route path="/admin/promo-codes" element={<AdminPromoCodesPage />} />
```

### 6.4 Navigation admin

```tsx
// Ajouter dans AdminLayout.tsx

const navItems = [
  // ... existing items
  { path: '/admin/promo-codes', label: 'Codes Promo', icon: '🎫' },
];
```

---

## ✅ 7. CHECKLIST DE DÉPLOIEMENT

### Backend
- [ ] Ajouter les modèles Prisma
- [ ] Exécuter la migration
- [ ] Créer `promo-code.service.ts`
- [ ] Créer les routes admin `/admin/promo-codes`
- [ ] Créer la route validation `/payments/promo/validate`
- [ ] Modifier `stripe.service.ts` pour supporter les codes promo
- [ ] Modifier les webhooks pour tracker les usages

### Frontend Web
- [ ] Créer `AdminPromoCodesPage.tsx`
- [ ] Créer `CreatePromoCodeModal.tsx`
- [ ] Créer `PromoCodeInput.tsx`
- [ ] Intégrer dans la page de pricing/checkout
- [ ] Ajouter la route admin
- [ ] Ajouter dans la navigation

### Mobile
- [ ] Créer `PromoCodeInput.tsx` (React Native)
- [ ] Intégrer dans les écrans de paiement
- [ ] Tester sur iOS et Android

### Tests
- [ ] Tests unitaires service
- [ ] Tests API endpoints
- [ ] Test E2E création code → utilisation → tracking

---

## 📈 8. ANALYTICS À TRACKER

```typescript
// Events à envoyer à ton analytics (Mixpanel/Plausible)

// Admin crée un code
analytics.track('promo_code_created', {
  code: promoCode.code,
  discountType: promoCode.discountType,
  discountValue: promoCode.discountValue,
  applicableTo: promoCode.applicableTo,
});

// User applique un code
analytics.track('promo_code_applied', {
  code: promoCode.code,
  discountAmount,
  purchaseType,
  userId,
});

// Code utilisé avec succès (après paiement)
analytics.track('promo_code_redeemed', {
  code: promoCode.code,
  discountAmount,
  revenue: finalAmount,
  userId,
});
```

---

## 🎯 RÉSUMÉ TECHNIQUE

| Composant | Fichiers à créer/modifier |
|-----------|---------------------------|
| **Database** | `schema.prisma` (+2 tables) |
| **Backend Service** | `promo-code.service.ts` |
| **Backend API Admin** | `api/admin/promo-codes.ts` |
| **Backend API Public** | `api/payments/promo.controller.ts` |
| **Backend Stripe** | `stripe.service.ts` (modifier) |
| **Frontend Admin** | `AdminPromoCodesPage.tsx`, `CreatePromoCodeModal.tsx` |
| **Frontend Checkout** | `PromoCodeInput.tsx` |
| **Mobile** | `PromoCodeInput.tsx` (RN) |

**Temps estimé :** 2-3 jours de dev

Tu veux que je lance un hive-mind pour implémenter ça ?
