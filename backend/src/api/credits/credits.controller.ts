import { Response } from "express";
import {
  AuthRequest,
  CreditTransactionType,
  PaginatedResponse,
} from "../../types";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";
import { prisma } from "../../utils/prisma";

/**
 * GET /api/credits/balance
 * Get current credit balance
 */
export const getBalance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // Fetch real balance from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        credits: true,
        subscription: {
          select: {
            status: true,
            planId: true,
            monthlyCredits: true,
            currentPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const subscriptionActive = user.subscription?.status === "ACTIVE";
    const subscriptionCredits = subscriptionActive ? (user.subscription?.monthlyCredits || 0) : 0;

    const balance = {
      userId: req.user.id,
      credits: user.credits,
      subscriptionCredits,
      totalCredits: user.credits + subscriptionCredits,
      subscriptionActive,
      subscriptionPlan: user.subscription?.planId || null,
      nextRenewal: user.subscription?.currentPeriodEnd || null,
    };

    res.status(200).json({
      status: "success",
      data: { balance },
    });
  },
);

/**
 * POST /api/credits/purchase
 * Purchase credits (one-shot or packs)
 */
export const purchaseCredits = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { packageId, paymentMethod } = req.body;

    // In production:
    // 1. Validate package exists
    // 2. Create Stripe/PayPal payment intent
    // 3. Process payment
    // 4. Add credits to user account
    // 5. Create transaction record

    logger.info(
      `Credit purchase initiated: ${req.user.id}, package: ${packageId}`,
    );

    res.status(201).json({
      status: "success",
      message: "Credit purchase successful",
      data: {
        transaction: {
          id: "txn_123456",
          type: CreditTransactionType.PURCHASE,
          credits: 100,
          amount: 9.99,
          currency: "USD",
          packageId,
          paymentMethod,
          createdAt: new Date(),
        },
      },
    });
  },
);

/**
 * GET /api/credits/history
 * Get credit transaction history
 */
export const getHistory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as CreditTransactionType | undefined;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: req.user.id };
    if (type) {
      where.type = type;
    }

    // Fetch from database with pagination
    const [transactions, total] = await Promise.all([
      prisma.creditTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          credits: true,
          amount: true,
          currency: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.creditTransaction.count({ where }),
    ]);

    const response: PaginatedResponse<any> = {
      data: transactions.map((t) => ({
        ...t,
        amount: t.amount ? Number(t.amount) : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.status(200).json({
      status: "success",
      ...response,
    });
  },
);

/**
 * POST /api/credits/subscription
 * Create a subscription plan
 */
export const createSubscription = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const { planId, paymentMethod } = req.body;

    // In production:
    // 1. Validate plan exists
    // 2. Create Stripe subscription
    // 3. Update user subscription status
    // 4. Add initial subscription credits

    logger.info(`Subscription created: ${req.user.id}, plan: ${planId}`);

    res.status(201).json({
      status: "success",
      message: "Subscription created successfully",
      data: {
        subscription: {
          id: "sub_123456",
          planId,
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          monthlyCredits: 50,
          paymentMethod,
        },
      },
    });
  },
);

/**
 * DELETE /api/credits/subscription
 * Cancel subscription
 */
export const cancelSubscription = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // In production:
    // 1. Cancel Stripe subscription
    // 2. Update user subscription status
    // 3. Keep credits until end of billing period

    logger.info(`Subscription cancelled: ${req.user.id}`);

    res.status(200).json({
      status: "success",
      message:
        "Subscription cancelled successfully. Credits remain available until end of billing period.",
    });
  },
);

/**
 * GET /api/credits/packages
 * Get available credit packages
 */
export const getPackages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const packages = [
      {
        id: "starter",
        name: "Starter Pack",
        credits: 100,
        price: 9.99,
        currency: "USD",
        popular: false,
      },
      {
        id: "pro",
        name: "Pro Pack",
        credits: 500,
        price: 39.99,
        currency: "USD",
        popular: true,
        savings: 20,
      },
      {
        id: "enterprise",
        name: "Enterprise Pack",
        credits: 2000,
        price: 129.99,
        currency: "USD",
        popular: false,
        savings: 35,
      },
    ];

    const subscriptions = [
      {
        id: "basic",
        name: "Basic Subscription",
        monthlyCredits: 50,
        price: 4.99,
        currency: "USD",
        billingPeriod: "monthly",
      },
      {
        id: "pro",
        name: "Pro Subscription",
        monthlyCredits: 200,
        price: 14.99,
        currency: "USD",
        billingPeriod: "monthly",
        popular: true,
      },
      {
        id: "enterprise",
        name: "Enterprise Subscription",
        monthlyCredits: 1000,
        price: 49.99,
        currency: "USD",
        billingPeriod: "monthly",
      },
    ];

    res.status(200).json({
      status: "success",
      data: {
        packages,
        subscriptions,
      },
    });
  },
);
