/**
 * Payment Service - Stripe Integration
 * Handles one-shot purchases, subscriptions, webhooks, and credit management
 */

import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentProvider,
  TransactionType,
  TransactionStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  PaymentIntent,
  Subscription,
  Transaction,
  CreditPack,
  PricingConfig,
  CreditTransaction,
  RefundRequest,
  PaymentError
} from '../types/payment.types';

export class PaymentService {
  private stripe: Stripe;
  private webhookSecret: string;

  private readonly PRICING: PricingConfig = {
    ONE_SHOT: 1.99,      // Updated to match PDF pricing
    PACK_5: 8.00,
    PACK_10: 15.00,
    PACK_20: 28.00,
    MONTHLY: 19.99,
    ANNUAL: 199.00,
    ENTERPRISE: 49.00,
    PASS_48H: 12.99,     // New 48-hour pass
    IOS_MARKUP: 1.30     // +30% for Apple commission
  };

  private readonly CREDIT_PACKS: CreditPack[] = [
    { id: 'one_shot', credits: 1, price: this.PRICING.ONE_SHOT, currency: 'EUR', name: 'Single Credit' },
    { id: 'pack_5', credits: 5, price: this.PRICING.PACK_5, currency: 'EUR', name: '5 Credits Pack' },
    { id: 'pack_10', credits: 10, price: this.PRICING.PACK_10, currency: 'EUR', name: '10 Credits Pack' },
    { id: 'pack_20', credits: 20, price: this.PRICING.PACK_20, currency: 'EUR', name: '20 Credits Pack' }
  ];

  private readonly SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { price: number; credits: number; accounts: number; duration?: number }> = {
    [SubscriptionPlan.MONTHLY]: { price: this.PRICING.MONTHLY, credits: 10, accounts: 3 },
    [SubscriptionPlan.ANNUAL]: { price: this.PRICING.ANNUAL, credits: 120, accounts: 5 },
    [SubscriptionPlan.ENTERPRISE]: { price: this.PRICING.ENTERPRISE, credits: 30, accounts: 10 },
    [SubscriptionPlan.PASS_48H]: { price: this.PRICING.PASS_48H, credits: 0, accounts: 1, duration: 48 } // 48 hours in hours
  };

  constructor(
    private db: any, // Database connection (e.g., Prisma, TypeORM)
    private emailService: any // Email notification service
  ) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia'
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  /**
   * Create one-time payment for credit purchase
   */
  async createOneTimePayment(userId: string, creditPackId: string): Promise<PaymentIntent> {
    const pack = this.CREDIT_PACKS.find(p => p.id === creditPackId);
    if (!pack) {
      throw this.createError('Invalid credit pack ID', 'INVALID_PACK', 400);
    }

    try {
      // Create Stripe PaymentIntent
      const stripeIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(pack.price * 100), // Convert to cents
        currency: pack.currency.toLowerCase(),
        metadata: {
          userId,
          creditPackId: pack.id,
          credits: pack.credits.toString(),
          type: TransactionType.ONE_SHOT_PURCHASE
        },
        description: `${pack.name} for user ${userId}`
      });

      // Save payment intent to database
      const paymentIntent: PaymentIntent = {
        id: uuidv4(),
        userId,
        amount: pack.price,
        currency: pack.currency,
        status: TransactionStatus.PENDING,
        provider: PaymentProvider.STRIPE,
        providerPaymentId: stripeIntent.id,
        clientSecret: stripeIntent.client_secret || undefined,
        metadata: {
          creditPackId: pack.id,
          credits: pack.credits
        },
        createdAt: new Date()
      };

      await this.db.paymentIntent.create({ data: paymentIntent });

      // Create pending transaction
      await this.createTransaction({
        userId,
        type: TransactionType.ONE_SHOT_PURCHASE,
        status: TransactionStatus.PENDING,
        provider: PaymentProvider.STRIPE,
        providerTransactionId: stripeIntent.id,
        amount: pack.price,
        currency: pack.currency,
        credits: pack.credits,
        description: `Purchase: ${pack.name}`
      });

      return paymentIntent;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(userId: string, plan: SubscriptionPlan): Promise<Subscription> {
    const planConfig = this.SUBSCRIPTION_PLANS[plan];
    if (!planConfig) {
      throw this.createError('Invalid subscription plan', 'INVALID_PLAN', 400);
    }

    try {
      // Get or create Stripe customer
      const customer = await this.getOrCreateStripeCustomer(userId);

      // Create Stripe subscription
      const stripeSubscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: this.getStripePriceId(plan) }],
        metadata: {
          userId,
          plan,
          credits: planConfig.credits.toString(),
          accounts: planConfig.accounts.toString()
        },
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });

      // Save subscription to database
      const subscription: Subscription = {
        id: uuidv4(),
        userId,
        plan,
        status: SubscriptionStatus.TRIALING,
        provider: PaymentProvider.STRIPE,
        providerSubscriptionId: stripeSubscription.id,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
        creditsPerMonth: planConfig.credits,
        connectedAccountsLimit: planConfig.accounts,
        metadata: { stripeCustomerId: customer.id },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.db.subscription.create({ data: subscription });

      // Send welcome email
      await this.emailService.sendSubscriptionWelcome(userId, subscription);

      return subscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const subscription = await this.db.subscription.findUnique({
        where: { id: subscriptionId }
      });

      if (!subscription) {
        throw this.createError('Subscription not found', 'NOT_FOUND', 404);
      }

      // Cancel at period end (don't charge refund)
      await this.stripe.subscriptions.update(subscription.providerSubscriptionId, {
        cancel_at_period_end: true
      });

      // Update database
      await this.db.subscription.update({
        where: { id: subscriptionId },
        data: {
          cancelAtPeriodEnd: true,
          updatedAt: new Date()
        }
      });

      // Send cancellation email
      await this.emailService.sendSubscriptionCancelled(subscription.userId, subscription);

      // Log audit event
      await this.logAuditEvent({
        userId: subscription.userId,
        action: 'subscription_cancelled',
        metadata: { subscriptionId, cancelAtPeriodEnd: true }
      });
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(subscriptionId: string, newPlan: SubscriptionPlan): Promise<Subscription> {
    try {
      const subscription = await this.db.subscription.findUnique({
        where: { id: subscriptionId }
      });

      if (!subscription) {
        throw this.createError('Subscription not found', 'NOT_FOUND', 404);
      }

      const planConfig = this.SUBSCRIPTION_PLANS[newPlan];
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        subscription.providerSubscriptionId
      );

      // Update Stripe subscription
      await this.stripe.subscriptions.update(subscription.providerSubscriptionId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: this.getStripePriceId(newPlan)
        }],
        metadata: {
          plan: newPlan,
          credits: planConfig.credits.toString(),
          accounts: planConfig.accounts.toString()
        },
        proration_behavior: 'create_prorations'
      });

      // Update database
      const updatedSubscription = await this.db.subscription.update({
        where: { id: subscriptionId },
        data: {
          plan: newPlan,
          creditsPerMonth: planConfig.credits,
          connectedAccountsLimit: planConfig.accounts,
          updatedAt: new Date()
        }
      });

      // Send update email
      await this.emailService.sendSubscriptionUpdated(subscription.userId, updatedSubscription);

      return updatedSubscription;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleStripeWebhook(payload: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
    } catch (error) {
      throw this.createError('Invalid webhook signature', 'INVALID_SIGNATURE', 400);
    }

    // Check for duplicate processing (idempotency)
    const existingEvent = await this.db.webhookEvent.findUnique({
      where: { providerEventId: event.id }
    });

    if (existingEvent?.processed) {
      console.log(`[Webhook] Duplicate event ${event.id}, skipping`);
      return;
    }

    // Save webhook event
    await this.db.webhookEvent.create({
      data: {
        id: uuidv4(),
        provider: PaymentProvider.STRIPE,
        providerEventId: event.id,
        eventType: event.type,
        payload: event,
        signature,
        processed: false,
        createdAt: new Date()
      }
    });

    try {
      // Handle event based on type
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'charge.refunded':
          await this.handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }

      // Mark event as processed
      await this.db.webhookEvent.update({
        where: { providerEventId: event.id },
        data: { processed: true, processedAt: new Date() }
      });
    } catch (error) {
      // Log error but don't throw (allow webhook retry)
      console.error(`[Webhook] Error processing event ${event.id}:`, error);
      await this.db.webhookEvent.update({
        where: { providerEventId: event.id },
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  /**
   * Add credits to user account
   */
  async addCredits(userId: string, amount: number, reason: string, metadata?: Record<string, any>): Promise<void> {
    if (amount <= 0) {
      throw this.createError('Credit amount must be positive', 'INVALID_AMOUNT', 400);
    }

    const transaction = await this.db.$transaction(async (tx: any) => {
      // Update user credits
      const user = await tx.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } }
      });

      // Create transaction record
      const txRecord = await tx.transaction.create({
        data: {
          id: uuidv4(),
          userId,
          type: TransactionType.CREDIT_ADJUSTMENT,
          status: TransactionStatus.COMPLETED,
          provider: PaymentProvider.STRIPE,
          providerTransactionId: `credit_${uuidv4()}`,
          amount: 0,
          currency: 'EUR',
          credits: amount,
          description: reason,
          metadata,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Log audit event
      await tx.auditLog.create({
        data: {
          userId,
          action: 'credits_added',
          metadata: { amount, reason, newBalance: user.credits }
        }
      });

      return txRecord;
    });

    console.log(`[Credits] Added ${amount} credits to user ${userId}: ${reason}`);
  }

  /**
   * Deduct credits from user account
   */
  async deductCredits(userId: string, amount: number): Promise<void> {
    if (amount <= 0) {
      throw this.createError('Credit amount must be positive', 'INVALID_AMOUNT', 400);
    }

    await this.db.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw this.createError('User not found', 'NOT_FOUND', 404);
      }

      if (user.credits < amount) {
        throw this.createError('Insufficient credits', 'INSUFFICIENT_CREDITS', 400);
      }

      // Deduct credits
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } }
      });

      // Log audit event
      await tx.auditLog.create({
        data: {
          userId,
          action: 'credits_deducted',
          metadata: { amount, newBalance: user.credits - amount }
        }
      });
    });
  }

  /**
   * Get transaction history for user
   */
  async getTransactionHistory(userId: string, limit = 50, offset = 0): Promise<Transaction[]> {
    return await this.db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  /**
   * Process refund request
   */
  async processRefund(request: RefundRequest): Promise<Transaction> {
    const transaction = await this.db.transaction.findUnique({
      where: { id: request.transactionId }
    });

    if (!transaction) {
      throw this.createError('Transaction not found', 'NOT_FOUND', 404);
    }

    if (transaction.status === TransactionStatus.REFUNDED) {
      throw this.createError('Transaction already refunded', 'ALREADY_REFUNDED', 400);
    }

    try {
      const refundAmount = request.amount || transaction.amount;

      // Process Stripe refund
      const refund = await this.stripe.refunds.create({
        payment_intent: transaction.providerTransactionId,
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        reason: 'requested_by_customer',
        metadata: { reason: request.reason }
      });

      // Update transaction
      const updatedTransaction = await this.db.transaction.update({
        where: { id: request.transactionId },
        data: {
          status: TransactionStatus.REFUNDED,
          refundedAmount: refundAmount,
          refundedAt: new Date(),
          metadata: { ...transaction.metadata, refundReason: request.reason }
        }
      });

      // Deduct refunded credits
      if (transaction.credits > 0) {
        await this.deductCredits(transaction.userId, transaction.credits);
      }

      // Send refund email
      await this.emailService.sendRefundProcessed(transaction.userId, updatedTransaction);

      return updatedTransaction;
    } catch (error) {
      throw this.handleStripeError(error);
    }
  }

  // Private helper methods

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { userId, credits } = paymentIntent.metadata;

    await this.db.$transaction(async (tx: any) => {
      // Update transaction status
      await tx.transaction.updateMany({
        where: { providerTransactionId: paymentIntent.id },
        data: { status: TransactionStatus.COMPLETED, updatedAt: new Date() }
      });

      // Add credits to user
      await this.addCredits(userId, parseInt(credits), 'Credit pack purchase', {
        paymentIntentId: paymentIntent.id
      });

      // Send success email
      await this.emailService.sendPaymentSuccess(userId, {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        credits: parseInt(credits)
      });
    });
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { userId } = paymentIntent.metadata;

    await this.db.transaction.updateMany({
      where: { providerTransactionId: paymentIntent.id },
      data: {
        status: TransactionStatus.FAILED,
        metadata: { error: paymentIntent.last_payment_error?.message }
      }
    });

    await this.emailService.sendPaymentFailed(userId, {
      reason: paymentIntent.last_payment_error?.message || 'Unknown error'
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    const subscription = await this.db.subscription.findFirst({
      where: { providerSubscriptionId: invoice.subscription as string }
    });

    if (!subscription) return;

    // Allocate monthly credits
    await this.addCredits(
      subscription.userId,
      subscription.creditsPerMonth || 0,
      'Monthly subscription credits',
      { invoiceId: invoice.id }
    );

    await this.emailService.sendSubscriptionRenewed(subscription.userId, subscription);
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription) return;

    const subscription = await this.db.subscription.findFirst({
      where: { providerSubscriptionId: invoice.subscription as string }
    });

    if (!subscription) return;

    // Update subscription status
    await this.db.subscription.update({
      where: { id: subscription.id },
      data: { status: SubscriptionStatus.PAST_DUE }
    });

    await this.emailService.sendPaymentFailed(subscription.userId, {
      reason: 'Subscription payment failed'
    });
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription): Promise<void> {
    await this.db.subscription.updateMany({
      where: { providerSubscriptionId: stripeSubscription.id },
      data: {
        status: this.mapStripeSubscriptionStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        updatedAt: new Date()
      }
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this.db.subscription.findFirst({
      where: { providerSubscriptionId: stripeSubscription.id }
    });

    if (subscription) {
      await this.db.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.EXPIRED, updatedAt: new Date() }
      });

      await this.emailService.sendSubscriptionExpired(subscription.userId, subscription);
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
    await this.db.transaction.updateMany({
      where: { providerTransactionId: charge.payment_intent as string },
      data: {
        status: TransactionStatus.REFUNDED,
        refundedAmount: charge.amount_refunded / 100,
        refundedAt: new Date()
      }
    });
  }

  private async getOrCreateStripeCustomer(userId: string): Promise<Stripe.Customer> {
    const user = await this.db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw this.createError('User not found', 'NOT_FOUND', 404);
    }

    if (user.stripeCustomerId) {
      return await this.stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      metadata: { userId }
    });

    await this.db.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    });

    return customer;
  }

  private getStripePriceId(plan: SubscriptionPlan): string {
    const priceIds: Record<SubscriptionPlan, string> = {
      [SubscriptionPlan.MONTHLY]: process.env.STRIPE_PRICE_MONTHLY || '',
      [SubscriptionPlan.ANNUAL]: process.env.STRIPE_PRICE_ANNUAL || '',
      [SubscriptionPlan.ENTERPRISE]: process.env.STRIPE_PRICE_ENTERPRISE || '',
      [SubscriptionPlan.PASS_48H]: process.env.STRIPE_PRICE_PASS_48H || ''
    };

    return priceIds[plan];
  }

  private mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const mapping: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELLED,
      unpaid: SubscriptionStatus.EXPIRED,
      trialing: SubscriptionStatus.TRIALING
    };

    return mapping[status] || SubscriptionStatus.EXPIRED;
  }

  private async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    return await this.db.transaction.create({
      data: {
        id: uuidv4(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  private async logAuditEvent(data: { userId: string; action: string; metadata?: any }): Promise<void> {
    await this.db.auditLog.create({
      data: {
        id: uuidv4(),
        ...data,
        createdAt: new Date()
      }
    });
  }

  private createError(message: string, code: string, statusCode: number): PaymentError {
    const error = new Error(message) as PaymentError;
    error.code = code;
    error.statusCode = statusCode;
    error.provider = PaymentProvider.STRIPE;
    return error;
  }

  private handleStripeError(error: any): PaymentError {
    if (error.type === 'StripeCardError') {
      return this.createError(error.message, error.code, 400);
    }
    if (error.type === 'StripeInvalidRequestError') {
      return this.createError(error.message, 'INVALID_REQUEST', 400);
    }
    if (error.type === 'StripeAPIError') {
      return this.createError('Payment service error', 'API_ERROR', 500);
    }
    return this.createError(error.message || 'Payment error', 'UNKNOWN_ERROR', 500);
  }
}
