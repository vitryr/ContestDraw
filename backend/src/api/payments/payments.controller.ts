import { Request, Response } from "express";
import { stripeService } from "../../services/stripe.service";
import { logger } from "../../utils/logger";
import config from "../../config/config";
import { prisma } from "../../utils/prisma";

/**
 * Payment controller for Stripe integration
 */
export const paymentsController = {
  /**
   * Create checkout session for subscription
   */
  createCheckoutSession: async (req: Request, res: Response) => {
    try {
      const { priceId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      if (!priceId) {
        return res.status(400).json({
          status: "error",
          message: "Price ID is required",
        });
      }

      const successUrl = `${config.server.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${config.server.frontendUrl}/payment/cancel`;

      const session = await stripeService.createCheckoutSession(
        userId,
        priceId,
        successUrl,
        cancelUrl,
      );

      res.status(200).json({
        status: "success",
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error: any) {
      logger.error("Failed to create checkout session", {
        error: error.message,
      });
      res.status(500).json({
        status: "error",
        message: "Failed to create checkout session",
      });
    }
  },

  /**
   * Create checkout session for credit pack purchase
   */
  createCreditPackSession: async (req: Request, res: Response) => {
    try {
      const { packId, credits, price, name } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      if (!packId || !credits || !price) {
        return res.status(400).json({
          status: "error",
          message: "Pack ID, credits, and price are required",
        });
      }

      const successUrl = `${config.server.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${config.server.frontendUrl}/payment/cancel`;

      const session = await stripeService.createCreditPackSession(
        userId,
        packId,
        credits,
        Math.round(price * 100), // Convert to cents
        name || `${credits} Credits Pack`,
        successUrl,
        cancelUrl,
      );

      res.status(200).json({
        status: "success",
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error: any) {
      logger.error("Failed to create credit pack checkout session", {
        error: error.message,
      });
      res.status(500).json({
        status: "error",
        message: "Failed to create checkout session",
      });
    }
  },

  /**
   * Create checkout session for 48h pass
   */
  create48hPassSession: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const priceId = config.payment.stripe.prices.pass48h;

      if (!priceId) {
        return res.status(500).json({
          status: "error",
          message: "48h pass not configured",
        });
      }

      const successUrl = `${config.server.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${config.server.frontendUrl}/payment/cancel`;

      const session = await stripeService.createOneTimePaymentSession(
        userId,
        priceId,
        successUrl,
        cancelUrl,
      );

      res.status(200).json({
        status: "success",
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    } catch (error: any) {
      logger.error("Failed to create 48h pass session", {
        error: error.message,
      });
      res.status(500).json({
        status: "error",
        message: "Failed to create payment session",
      });
    }
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeSubscriptionId: true },
      });

      if (!user?.stripeSubscriptionId) {
        return res.status(404).json({
          status: "error",
          message: "No active subscription found",
        });
      }

      const subscription = await stripeService.cancelSubscription(
        user.stripeSubscriptionId,
      );

      res.status(200).json({
        status: "success",
        data: {
          subscription: {
            id: subscription.id,
            status: subscription.status,
            canceledAt: subscription.canceled_at,
          },
        },
      });
    } catch (error: any) {
      logger.error("Failed to cancel subscription", { error: error.message });
      res.status(500).json({
        status: "error",
        message: "Failed to cancel subscription",
      });
    }
  },

  /**
   * Get subscription details
   */
  getSubscription: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          stripeSubscriptionId: true,
          subscriptionStatus: true,
          subscriptionType: true,
          subscriptionExpiresAt: true,
        },
      });

      if (!user?.stripeSubscriptionId) {
        return res.status(404).json({
          status: "error",
          message: "No active subscription found",
        });
      }

      const subscription = await stripeService.getSubscription(
        user.stripeSubscriptionId,
      );

      res.status(200).json({
        status: "success",
        data: {
          subscription: {
            id: subscription.id,
            status: subscription.status,
            type: user.subscriptionType,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            expiresAt: user.subscriptionExpiresAt,
          },
        },
      });
    } catch (error: any) {
      logger.error("Failed to get subscription", { error: error.message });
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve subscription",
      });
    }
  },

  /**
   * Create billing portal session
   */
  createPortalSession: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      });

      if (!user?.stripeCustomerId) {
        return res.status(404).json({
          status: "error",
          message: "No customer found",
        });
      }

      const returnUrl = `${config.server.frontendUrl}/account/subscription`;
      const session = await stripeService.createPortalSession(
        user.stripeCustomerId,
        returnUrl,
      );

      res.status(200).json({
        status: "success",
        data: {
          url: session.url,
        },
      });
    } catch (error: any) {
      logger.error("Failed to create portal session", { error: error.message });
      res.status(500).json({
        status: "error",
        message: "Failed to create portal session",
      });
    }
  },

  /**
   * Get available products and prices
   */
  getProducts: async (req: Request, res: Response) => {
    try {
      const products = await stripeService.getProducts();

      res.status(200).json({
        status: "success",
        data: {
          products: products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            defaultPrice: product.default_price,
          })),
        },
      });
    } catch (error: any) {
      logger.error("Failed to get products", { error: error.message });
      res.status(500).json({
        status: "error",
        message: "Failed to retrieve products",
      });
    }
  },

  /**
   * Stripe webhook handler
   */
  handleWebhook: async (req: Request, res: Response) => {
    try {
      const signature = req.headers["stripe-signature"] as string;

      if (!signature) {
        return res.status(400).json({
          status: "error",
          message: "Missing stripe-signature header",
        });
      }

      await stripeService.handleWebhook(req.body, signature);

      res.status(200).json({ received: true });
    } catch (error: any) {
      logger.error("Webhook processing failed", { error: error.message });
      res.status(400).json({
        status: "error",
        message: "Webhook processing failed",
      });
    }
  },
};
