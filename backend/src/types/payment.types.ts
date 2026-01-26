/**
 * Payment System Type Definitions
 * Handles Stripe and Apple IAP transactions
 */

export enum PaymentProvider {
  STRIPE = "stripe",
  APPLE_IAP = "apple_iap",
}

export enum TransactionType {
  ONE_SHOT_PURCHASE = "one_shot_purchase",
  SUBSCRIPTION_CHARGE = "subscription_charge",
  SUBSCRIPTION_RENEWAL = "subscription_renewal",
  REFUND = "refund",
  CREDIT_ADJUSTMENT = "credit_adjustment",
}

export enum TransactionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
  CANCELLED = "cancelled",
}

export enum SubscriptionPlan {
  MONTHLY = "monthly",
  ANNUAL = "annual",
  ENTERPRISE = "enterprise",
  PASS_48H = "pass_48h",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIALING = "trialing",
  GRACE_PERIOD = "grace_period",
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  currency: string;
  name: string;
  description?: string;
}

export interface PricingConfig {
  ONE_SHOT: number;
  PACK_5: number;
  PACK_10: number;
  PACK_20: number;
  MONTHLY: number;
  ANNUAL: number;
  ENTERPRISE: number;
  PASS_48H: number;
  IOS_MARKUP: number;
}

export enum Platform {
  WEB = "web",
  IOS = "ios",
  ANDROID = "android",
}

export interface PlatformPrice {
  platform: Platform;
  price: number;
  currency: string;
  originalPrice?: number;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: PaymentProvider;
  providerPaymentId: string;
  clientSecret?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  providerSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  creditsPerMonth?: number;
  connectedAccountsLimit?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  provider: PaymentProvider;
  providerTransactionId: string;
  amount: number;
  currency: string;
  credits: number;
  description: string;
  metadata?: Record<string, any>;
  refundedAmount?: number;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEvent {
  id: string;
  provider: PaymentProvider;
  eventType: string;
  payload: any;
  signature: string;
  processed: boolean;
  processedAt?: Date;
  error?: string;
  createdAt: Date;
}

export interface AppleReceipt {
  receiptData: string;
  transactionId: string;
  productId: string;
  purchaseDate: string;
  expirationDate?: string;
}

export interface CreditTransaction {
  userId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason: string;
}

export interface PaymentError extends Error {
  code: string;
  statusCode: number;
  provider?: PaymentProvider;
  providerError?: any;
}
