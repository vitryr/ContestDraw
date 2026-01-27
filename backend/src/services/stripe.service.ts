import Stripe from "stripe";
import config from "../config/config";
import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

/**
 * Payment service using Stripe
 * Handles subscriptions, one-time payments, and webhook processing
 */
class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    const secretKey = config.payment?.stripe?.secretKey;
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: "2025-10-29.clover",
      });
    } else {
      logger.warn("Stripe API key not configured - payment features disabled");
    }
  }

  private ensureStripe(): Stripe {
    if (!this.stripe) {
      throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY environment variable.");
    }
    return this.stripe;
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      // Get user email from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const session = await this.ensureStripe().checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: userId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
          metadata: {
            userId,
          },
        },
        metadata: {
          userId,
        },
      });

      logger.info("Checkout session created", {
        userId,
        sessionId: session.id,
      });

      return session;
    } catch (error: any) {
      logger.error("Failed to create checkout session", {
        error: error.message,
        userId,
        priceId,
      });
      throw new Error("Failed to create checkout session");
    }
  }

  /**
   * Create a checkout session for one-time payment (48h pass)
   */
  async createOneTimePaymentSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const session = await this.ensureStripe().checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: userId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          type: "48h_pass",
        },
      });

      logger.info("One-time payment session created", {
        userId,
        sessionId: session.id,
      });

      return session;
    } catch (error: any) {
      logger.error("Failed to create payment session", {
        error: error.message,
        userId,
        priceId,
      });
      throw new Error("Failed to create payment session");
    }
  }

  /**
   * Create a checkout session for credit pack purchase
   */
  async createCreditPackSession(
    userId: string,
    packId: string,
    credits: number,
    priceInCents: number,
    packName: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const session = await this.ensureStripe().checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: userId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${packName} - ${credits} Credits`,
                description: `${credits} credits for ContestDraw`,
              },
              unit_amount: priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          type: "credit_pack",
          packId,
          credits: credits.toString(),
        },
      });

      logger.info("Credit pack checkout session created", {
        userId,
        sessionId: session.id,
        packId,
        credits,
      });

      return session;
    } catch (error: any) {
      logger.error("Failed to create credit pack session", {
        error: error.message,
        userId,
        packId,
      });
      throw new Error("Failed to create credit pack session");
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    try {
      const subscription =
        await this.ensureStripe().subscriptions.cancel(subscriptionId);

      logger.info("Subscription cancelled", { subscriptionId });

      return subscription;
    } catch (error: any) {
      logger.error("Failed to cancel subscription", {
        error: error.message,
        subscriptionId,
      });
      throw new Error("Failed to cancel subscription");
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription =
        await this.ensureStripe().subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error: any) {
      logger.error("Failed to retrieve subscription", {
        error: error.message,
        subscriptionId,
      });
      throw new Error("Failed to retrieve subscription");
    }
  }

  /**
   * Create a portal session for subscription management
   */
  async createPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    try {
      const session = await this.ensureStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      logger.info("Portal session created", { customerId });

      return session;
    } catch (error: any) {
      logger.error("Failed to create portal session", {
        error: error.message,
        customerId,
      });
      throw new Error("Failed to create portal session");
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string,
  ): Promise<void> {
    try {
      const event = this.ensureStripe().webhooks.constructEvent(
        payload,
        signature,
        config.payment.stripe.webhookSecret,
      );

      logger.info("Stripe webhook received", {
        type: event.type,
        id: event.id,
      });

      switch (event.type) {
        case "checkout.session.completed":
          await this.handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription,
          );
          break;

        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;

        case "invoice.payment_succeeded":
          await this.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice,
          );
          break;

        case "invoice.payment_failed":
          await this.handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice,
          );
          break;

        default:
          logger.info("Unhandled webhook event type", { type: event.type });
      }
    } catch (error: any) {
      logger.error("Webhook handling failed", {
        error: error.message,
      });
      throw new Error("Webhook handling failed");
    }
  }

  /**
   * Handle successful checkout completion
   */
  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.userId || session.client_reference_id;

    if (!userId) {
      logger.error("No userId in checkout session");
      return;
    }

    try {
      // Check if this is a credit pack purchase
      if (session.metadata?.type === "credit_pack") {
        const credits = parseInt(session.metadata.credits || "0", 10);
        const packId = session.metadata.packId;

        if (credits > 0) {
          // Add credits to user account
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: {
                credits: { increment: credits },
              },
            }),
            prisma.creditTransaction.create({
              data: {
                userId,
                type: "PURCHASE",
                credits,
                amount: session.amount_total ? session.amount_total / 100 : null,
                currency: session.currency?.toUpperCase() || "USD",
                description: `Credit Pack Purchase - ${packId}`,
                metadata: {
                  sessionId: session.id,
                  packId,
                  paymentIntent: session.payment_intent,
                },
              },
            }),
          ]);

          logger.info("Credits added to user account", {
            userId,
            credits,
            packId,
            sessionId: session.id,
          });
        }
      } else if (session.metadata?.type === "48h_pass") {
        // Grant 48h access via subscription
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 48);

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            status: "ACTIVE",
            is48HPass: true,
            currentPeriodEnd: expiresAt,
          },
          create: {
            userId,
            planId: "48h_pass",
            planType: "one_time",
            status: "ACTIVE",
            is48HPass: true,
            currentPeriodStart: new Date(),
            currentPeriodEnd: expiresAt,
            monthlyCredits: 0,
          },
        });

        logger.info("48h pass activated", { userId, expiresAt });
      } else if (session.subscription) {
        // Handle subscription
        const subscription = await this.ensureStripe().subscriptions.retrieve(
          session.subscription as string,
        );

        await prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeSubscriptionId: subscription.id,
            status: "ACTIVE",
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          create: {
            userId,
            planId: this.getSubscriptionType(subscription),
            planType: "monthly",
            status: "ACTIVE",
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            monthlyCredits: this.getMonthlyCredits(subscription),
          },
        });

        logger.info("Subscription activated", {
          userId,
          subscriptionId: subscription.id,
        });
      }
    } catch (error: any) {
      logger.error("Failed to handle checkout completion", {
        error: error.message,
        userId,
        sessionId: session.id,
      });
    }
  }

  /**
   * Get monthly credits based on subscription type
   */
  private getMonthlyCredits(subscription: Stripe.Subscription): number {
    const type = this.getSubscriptionType(subscription);
    switch (type) {
      case "monthly": return 50;
      case "annual": return 100;
      case "enterprise": return 500;
      default: return 0;
    }
  }

  /**
   * Handle subscription updates
   */
  private async handleSubscriptionUpdate(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      logger.error("No userId in subscription metadata");
      return;
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          subscriptionType: this.getSubscriptionType(subscription),
          subscriptionExpiresAt: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });

      logger.info("Subscription updated", {
        userId,
        subscriptionId: subscription.id,
      });
    } catch (error: any) {
      logger.error("Failed to handle subscription update", {
        error: error.message,
        subscriptionId: subscription.id,
      });
    }
  }

  /**
   * Handle subscription deletion
   */
  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      logger.error("No userId in subscription metadata");
      return;
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "cancelled",
          subscriptionExpiresAt: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });

      logger.info("Subscription deleted", {
        userId,
        subscriptionId: subscription.id,
      });
    } catch (error: any) {
      logger.error("Failed to handle subscription deletion", {
        error: error.message,
        subscriptionId: subscription.id,
      });
    }
  }

  /**
   * Handle successful invoice payment
   */
  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    logger.info("Invoice payment succeeded", {
      invoiceId: invoice.id,
      customerId: invoice.customer,
    });

    // Optionally send payment confirmation email
    // await emailService.sendPaymentConfirmation(...)
  }

  /**
   * Handle failed invoice payment
   */
  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice,
  ): Promise<void> {
    logger.warn("Invoice payment failed", {
      invoiceId: invoice.id,
      customerId: invoice.customer,
    });

    // Optionally send payment failure email
    // await emailService.sendPaymentFailureNotification(...)
  }

  /**
   * Get subscription type from Stripe subscription
   */
  private getSubscriptionType(subscription: Stripe.Subscription): string {
    const priceId = subscription.items.data[0]?.price.id;

    if (priceId === config.payment.stripe.prices.monthly) return "monthly";
    if (priceId === config.payment.stripe.prices.annual) return "annual";
    if (priceId === config.payment.stripe.prices.enterprise)
      return "enterprise";

    return "unknown";
  }

  /**
   * Get available products and prices
   */
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.ensureStripe().products.list({
        active: true,
        expand: ["data.default_price"],
      });

      return products.data;
    } catch (error: any) {
      logger.error("Failed to retrieve products", { error: error.message });
      throw new Error("Failed to retrieve products");
    }
  }

  /**
   * Get all prices for a product
   */
  async getPricesForProduct(productId: string): Promise<Stripe.Price[]> {
    try {
      const prices = await this.ensureStripe().prices.list({
        product: productId,
        active: true,
      });

      return prices.data;
    } catch (error: any) {
      logger.error("Failed to retrieve prices", {
        error: error.message,
        productId,
      });
      throw new Error("Failed to retrieve prices");
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();
