/**
 * Apple In-App Purchase Service
 * Handles iOS receipt validation, subscription management, and credit synchronization
 */

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  PaymentProvider,
  TransactionType,
  TransactionStatus,
  SubscriptionStatus,
  AppleReceipt,
  Transaction,
  Subscription,
  PaymentError,
} from "../types/payment.types";

interface AppleVerificationResponse {
  status: number;
  receipt: any;
  latest_receipt_info?: any[];
  pending_renewal_info?: any[];
}

export class AppleIAPService {
  private readonly APPLE_PRODUCTION_URL =
    "https://buy.itunes.apple.com/verifyReceipt";
  private readonly APPLE_SANDBOX_URL =
    "https://sandbox.itunes.apple.com/verifyReceipt";
  private readonly IOS_MARKUP = 1.3; // +30% Apple commission

  private readonly PRODUCT_IDS = {
    ONE_SHOT: "com.contestdraw.credits.oneshot",
    PACK_5: "com.contestdraw.credits.pack5",
    PACK_10: "com.contestdraw.credits.pack10",
    PACK_20: "com.contestdraw.credits.pack20",
    MONTHLY_SUB: "com.contestdraw.subscription.monthly",
    ANNUAL_SUB: "com.contestdraw.subscription.annual",
    ENTERPRISE_SUB: "com.contestdraw.subscription.enterprise",
  };

  private readonly PRODUCT_CREDITS: Record<string, number> = {
    [this.PRODUCT_IDS.ONE_SHOT]: 1,
    [this.PRODUCT_IDS.PACK_5]: 5,
    [this.PRODUCT_IDS.PACK_10]: 10,
    [this.PRODUCT_IDS.PACK_20]: 20,
    [this.PRODUCT_IDS.MONTHLY_SUB]: 10,
    [this.PRODUCT_IDS.ANNUAL_SUB]: 120,
    [this.PRODUCT_IDS.ENTERPRISE_SUB]: 30,
  };

  constructor(
    private db: any,
    private paymentService: any, // Reference to PaymentService for credit management
    private emailService: any,
  ) {
    if (!process.env.APPLE_SHARED_SECRET) {
      console.warn(
        "APPLE_SHARED_SECRET not set - Apple IAP validation will fail",
      );
    }
  }

  /**
   * Validate iOS receipt with Apple servers
   */
  async validateReceipt(
    receiptData: string,
    userId: string,
  ): Promise<AppleVerificationResponse> {
    const sharedSecret = process.env.APPLE_SHARED_SECRET;
    if (!sharedSecret) {
      throw this.createError(
        "Apple shared secret not configured",
        "CONFIG_ERROR",
        500,
      );
    }

    try {
      // Try production first
      let response = await this.verifyWithApple(
        this.APPLE_PRODUCTION_URL,
        receiptData,
        sharedSecret,
      );

      // If production returns sandbox receipt error, try sandbox
      if (response.data.status === 21007) {
        console.log(
          "[Apple IAP] Production returned sandbox receipt, retrying with sandbox",
        );
        response = await this.verifyWithApple(
          this.APPLE_SANDBOX_URL,
          receiptData,
          sharedSecret,
        );
      }

      const result = response.data;

      // Check validation status
      if (result.status !== 0) {
        throw this.createError(
          `Apple receipt validation failed: ${this.getAppleErrorMessage(result.status)}`,
          "VALIDATION_FAILED",
          400,
        );
      }

      // Process the validated receipt
      await this.processValidatedReceipt(result, userId);

      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.createError(
          "Apple verification service unavailable",
          "SERVICE_UNAVAILABLE",
          503,
        );
      }
      throw error;
    }
  }

  /**
   * Process a validated receipt and grant credits/subscriptions
   */
  private async processValidatedReceipt(
    verificationResponse: AppleVerificationResponse,
    userId: string,
  ): Promise<void> {
    const latestReceiptInfo = verificationResponse.latest_receipt_info || [];

    for (const purchase of latestReceiptInfo) {
      const transactionId = purchase.transaction_id;
      const productId = purchase.product_id;
      const purchaseDate = new Date(parseInt(purchase.purchase_date_ms));
      const expiresDate = purchase.expires_date_ms
        ? new Date(parseInt(purchase.expires_date_ms))
        : null;

      // Check if transaction already processed (idempotency)
      const existing = await this.db.transaction.findFirst({
        where: {
          providerTransactionId: transactionId,
          provider: PaymentProvider.APPLE_IAP,
        },
      });

      if (existing) {
        console.log(
          `[Apple IAP] Transaction ${transactionId} already processed`,
        );
        continue;
      }

      const credits = this.PRODUCT_CREDITS[productId] || 0;
      const isSubscription = this.isSubscriptionProduct(productId);

      if (isSubscription) {
        await this.processSubscriptionPurchase(
          userId,
          productId,
          transactionId,
          purchaseDate,
          expiresDate,
        );
      } else {
        await this.processOneTimePurchase(
          userId,
          productId,
          transactionId,
          credits,
          purchaseDate,
        );
      }
    }
  }

  /**
   * Process one-time credit purchase
   */
  private async processOneTimePurchase(
    userId: string,
    productId: string,
    transactionId: string,
    credits: number,
    purchaseDate: Date,
  ): Promise<void> {
    await this.db.$transaction(async (tx: any) => {
      // Create transaction record
      const transaction: Transaction = {
        id: uuidv4(),
        userId,
        type: TransactionType.ONE_SHOT_PURCHASE,
        status: TransactionStatus.COMPLETED,
        provider: PaymentProvider.APPLE_IAP,
        providerTransactionId: transactionId,
        amount: 0, // Amount not available from Apple
        currency: "USD",
        credits,
        description: `Apple IAP: ${productId}`,
        metadata: { productId, purchaseDate: purchaseDate.toISOString() },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await tx.transaction.create({ data: transaction });

      // Add credits to user account
      await this.paymentService.addCredits(
        userId,
        credits,
        "Apple IAP purchase",
        { transactionId, productId },
      );

      // Send confirmation email
      await this.emailService.sendPaymentSuccess(userId, {
        credits,
        provider: "Apple App Store",
      });

      console.log(
        `[Apple IAP] Processed one-time purchase: ${credits} credits for user ${userId}`,
      );
    });
  }

  /**
   * Process subscription purchase
   */
  private async processSubscriptionPurchase(
    userId: string,
    productId: string,
    transactionId: string,
    purchaseDate: Date,
    expiresDate: Date | null,
  ): Promise<void> {
    if (!expiresDate) {
      throw this.createError(
        "Subscription must have expiration date",
        "INVALID_SUBSCRIPTION",
        400,
      );
    }

    const plan = this.mapProductIdToSubscriptionPlan(productId);
    const credits = this.PRODUCT_CREDITS[productId] || 0;
    const accountsLimit = this.getAccountsLimitForProduct(productId);

    await this.db.$transaction(async (tx: any) => {
      // Check for existing subscription
      const existingSubscription = await tx.subscription.findFirst({
        where: {
          userId,
          providerSubscriptionId: transactionId,
          provider: PaymentProvider.APPLE_IAP,
        },
      });

      if (existingSubscription) {
        // Update existing subscription
        await tx.subscription.update({
          where: { id: existingSubscription.id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: purchaseDate,
            currentPeriodEnd: expiresDate,
            updatedAt: new Date(),
          },
        });

        console.log(`[Apple IAP] Updated subscription ${transactionId}`);
      } else {
        // Create new subscription
        const subscription: Subscription = {
          id: uuidv4(),
          userId,
          plan,
          status: SubscriptionStatus.ACTIVE,
          provider: PaymentProvider.APPLE_IAP,
          providerSubscriptionId: transactionId,
          currentPeriodStart: purchaseDate,
          currentPeriodEnd: expiresDate,
          cancelAtPeriodEnd: false,
          creditsPerMonth: credits,
          connectedAccountsLimit: accountsLimit,
          metadata: { productId },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await tx.subscription.create({ data: subscription });

        // Allocate initial credits
        await this.paymentService.addCredits(
          userId,
          credits,
          "Subscription activation",
          { subscriptionId: subscription.id, productId },
        );

        // Send welcome email
        await this.emailService.sendSubscriptionWelcome(userId, subscription);

        console.log(`[Apple IAP] Created subscription ${transactionId}`);
      }

      // Create transaction record
      await tx.transaction.create({
        data: {
          id: uuidv4(),
          userId,
          type: TransactionType.SUBSCRIPTION_CHARGE,
          status: TransactionStatus.COMPLETED,
          provider: PaymentProvider.APPLE_IAP,
          providerTransactionId: transactionId,
          amount: 0,
          currency: "USD",
          credits,
          description: `Apple IAP Subscription: ${productId}`,
          metadata: { productId, expiresDate: expiresDate.toISOString() },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    });
  }

  /**
   * Check and renew subscriptions
   * Should be called periodically to check for renewals
   */
  async checkSubscriptionRenewals(userId: string): Promise<void> {
    const subscriptions = await this.db.subscription.findMany({
      where: {
        userId,
        provider: PaymentProvider.APPLE_IAP,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    for (const subscription of subscriptions) {
      const now = new Date();
      const gracePeriodEnd = new Date(subscription.currentPeriodEnd);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3); // 3-day grace period

      if (now > subscription.currentPeriodEnd && now < gracePeriodEnd) {
        // Enter grace period
        await this.db.subscription.update({
          where: { id: subscription.id },
          data: { status: SubscriptionStatus.GRACE_PERIOD },
        });

        await this.emailService.sendSubscriptionGracePeriod(
          userId,
          subscription,
        );
      } else if (now > gracePeriodEnd) {
        // Expire subscription
        await this.db.subscription.update({
          where: { id: subscription.id },
          data: { status: SubscriptionStatus.EXPIRED },
        });

        await this.emailService.sendSubscriptionExpired(userId, subscription);
      }
    }
  }

  /**
   * Handle subscription cancellation from Apple
   */
  async handleSubscriptionCancellation(transactionId: string): Promise<void> {
    const subscription = await this.db.subscription.findFirst({
      where: {
        providerSubscriptionId: transactionId,
        provider: PaymentProvider.APPLE_IAP,
      },
    });

    if (!subscription) {
      console.warn(
        `[Apple IAP] Subscription not found for transaction ${transactionId}`,
      );
      return;
    }

    await this.db.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      },
    });

    await this.emailService.sendSubscriptionCancelled(
      subscription.userId,
      subscription,
    );
    console.log(
      `[Apple IAP] Subscription ${transactionId} marked for cancellation`,
    );
  }

  /**
   * Get adjusted pricing for iOS (with Apple's 30% commission)
   */
  getIOSPricing(basePrice: number): number {
    return Math.round(basePrice * this.IOS_MARKUP * 100) / 100;
  }

  /**
   * Get all available iOS products with adjusted pricing
   */
  getIOSProducts() {
    return {
      credits: [
        {
          productId: this.PRODUCT_IDS.ONE_SHOT,
          credits: 1,
          price: this.getIOSPricing(2.49),
          currency: "EUR",
        },
        {
          productId: this.PRODUCT_IDS.PACK_5,
          credits: 5,
          price: this.getIOSPricing(8.0),
          currency: "EUR",
        },
        {
          productId: this.PRODUCT_IDS.PACK_10,
          credits: 10,
          price: this.getIOSPricing(15.0),
          currency: "EUR",
        },
        {
          productId: this.PRODUCT_IDS.PACK_20,
          credits: 20,
          price: this.getIOSPricing(28.0),
          currency: "EUR",
        },
      ],
      subscriptions: [
        {
          productId: this.PRODUCT_IDS.MONTHLY_SUB,
          plan: "monthly",
          credits: 10,
          price: this.getIOSPricing(19.99),
          currency: "EUR",
        },
        {
          productId: this.PRODUCT_IDS.ANNUAL_SUB,
          plan: "annual",
          credits: 120,
          price: this.getIOSPricing(199.0),
          currency: "EUR",
        },
        {
          productId: this.PRODUCT_IDS.ENTERPRISE_SUB,
          plan: "enterprise",
          credits: 30,
          price: this.getIOSPricing(49.0),
          currency: "EUR",
        },
      ],
    };
  }

  // Private helper methods

  private async verifyWithApple(
    url: string,
    receiptData: string,
    sharedSecret: string,
  ): Promise<any> {
    return await axios.post(url, {
      "receipt-data": receiptData,
      password: sharedSecret,
      "exclude-old-transactions": false,
    });
  }

  private isSubscriptionProduct(productId: string): boolean {
    return [
      this.PRODUCT_IDS.MONTHLY_SUB,
      this.PRODUCT_IDS.ANNUAL_SUB,
      this.PRODUCT_IDS.ENTERPRISE_SUB,
    ].includes(productId);
  }

  private mapProductIdToSubscriptionPlan(productId: string): string {
    const mapping: Record<string, string> = {
      [this.PRODUCT_IDS.MONTHLY_SUB]: "monthly",
      [this.PRODUCT_IDS.ANNUAL_SUB]: "annual",
      [this.PRODUCT_IDS.ENTERPRISE_SUB]: "enterprise",
    };
    return mapping[productId] || "monthly";
  }

  private getAccountsLimitForProduct(productId: string): number {
    const limits: Record<string, number> = {
      [this.PRODUCT_IDS.MONTHLY_SUB]: 3,
      [this.PRODUCT_IDS.ANNUAL_SUB]: 5,
      [this.PRODUCT_IDS.ENTERPRISE_SUB]: 10,
    };
    return limits[productId] || 3;
  }

  private getAppleErrorMessage(status: number): string {
    const messages: Record<number, string> = {
      21000: "The App Store could not read the JSON object you provided.",
      21002: "The data in the receipt-data property was malformed or missing.",
      21003: "The receipt could not be authenticated.",
      21004:
        "The shared secret you provided does not match the shared secret on file.",
      21005: "The receipt server is not currently available.",
      21006: "This receipt is valid but the subscription has expired.",
      21007: "This receipt is from the test environment.",
      21008: "This receipt is from the production environment.",
      21010: "This receipt could not be authorized.",
    };
    return messages[status] || `Unknown error (status ${status})`;
  }

  private createError(
    message: string,
    code: string,
    statusCode: number,
  ): PaymentError {
    const error = new Error(message) as PaymentError;
    error.code = code;
    error.statusCode = statusCode;
    error.provider = PaymentProvider.APPLE_IAP;
    return error;
  }
}
