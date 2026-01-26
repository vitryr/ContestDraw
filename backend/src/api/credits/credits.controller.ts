import { Response } from "express";
import {
  AuthRequest,
  CreditTransactionType,
  PaginatedResponse,
} from "../../types";
import { asyncHandler, AppError } from "../../middleware/error.middleware";
import { logger } from "../../utils/logger";

/**
 * GET /api/credits/balance
 * Get current credit balance
 */
export const getBalance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    // In production, fetch from database
    const balance = {
      userId: req.user.id,
      credits: 150,
      subscriptionCredits: 50,
      totalCredits: 200,
      subscriptionActive: true,
      subscriptionPlan: "pro",
      nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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
    const type = req.query.type as string | undefined;

    // In production, fetch from database with pagination
    const transactions = [
      {
        id: "txn_001",
        type: CreditTransactionType.PURCHASE,
        credits: 100,
        amount: 9.99,
        currency: "USD",
        description: "Starter Pack",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "txn_002",
        type: CreditTransactionType.CONSUMPTION,
        credits: -10,
        description: "Instagram Draw - 500 participants",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "txn_003",
        type: CreditTransactionType.SUBSCRIPTION,
        credits: 50,
        description: "Monthly Pro Subscription",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    const response: PaginatedResponse<any> = {
      data: transactions,
      meta: {
        total: transactions.length,
        page,
        limit,
        totalPages: Math.ceil(transactions.length / limit),
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
