# Payment System Integration Guide

Complete guide for integrating the ContestDraw payment system into your application.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Service Dependencies](#service-dependencies)
3. [Database Schema](#database-schema)
4. [Integration Steps](#integration-steps)
5. [Frontend Integration](#frontend-integration)
6. [Testing Strategy](#testing-strategy)
7. [Production Checklist](#production-checklist)

## Architecture Overview

```
┌─────────────┐
│   Client    │
│ (Web/Mobile)│
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ PaymentsController│
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    ▼         ▼              ▼
┌──────────┐ ┌────────────┐ ┌────────────┐
│ Payment  │ │  Apple IAP │ │Subscription│
│ Service  │ │  Service   │ │  Service   │
└────┬─────┘ └─────┬──────┘ └─────┬──────┘
     │             │              │
     └─────────────┴──────────────┘
                   ▼
            ┌──────────────┐
            │   Database   │
            │  (PostgreSQL)│
            └──────────────┘
```

## Service Dependencies

### 1. PaymentService

**Dependencies:**
- Database connection (Prisma/TypeORM)
- Email service for notifications
- Stripe SDK

**Initialization:**
```typescript
import { PaymentService } from './services/payment.service';
import { PrismaClient } from '@prisma/client';
import { EmailService } from './services/email.service';

const db = new PrismaClient();
const emailService = new EmailService();
const paymentService = new PaymentService(db, emailService);
```

### 2. AppleIAPService

**Dependencies:**
- Database connection
- PaymentService (for credit management)
- Email service

**Initialization:**
```typescript
import { AppleIAPService } from './services/apple-iap.service';

const appleIAPService = new AppleIAPService(
  db,
  paymentService,
  emailService
);
```

### 3. SubscriptionService

**Dependencies:**
- Database connection
- PaymentService
- Email service

**Initialization:**
```typescript
import { SubscriptionService } from './services/subscription.service';

const subscriptionService = new SubscriptionService(
  db,
  paymentService,
  emailService
);
```

## Database Schema

### Required Tables

```sql
-- Users table (extend existing)
ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

-- Payment Intents
CREATE TABLE payment_intents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_payment_id VARCHAR(255) NOT NULL,
  client_secret TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_subscription_id VARCHAR(255) NOT NULL,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  credits_per_month INTEGER,
  connected_accounts_limit INTEGER,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_transaction_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  credits INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  refunded_amount DECIMAL(10,2),
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Events
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  provider_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_provider_event_id ON webhook_events(provider_event_id);
```

### Prisma Schema

```prisma
model User {
  id                String          @id @default(uuid())
  email             String          @unique
  credits           Int             @default(0)
  stripeCustomerId  String?         @map("stripe_customer_id")

  paymentIntents    PaymentIntent[]
  subscriptions     Subscription[]
  transactions      Transaction[]
  auditLogs         AuditLog[]

  @@map("users")
}

model PaymentIntent {
  id                 String   @id @default(uuid())
  userId             String   @map("user_id")
  amount             Decimal  @db.Decimal(10,2)
  currency           String
  status             String
  provider           String
  providerPaymentId  String   @map("provider_payment_id")
  clientSecret       String?  @map("client_secret")
  metadata           Json?
  createdAt          DateTime @default(now()) @map("created_at")

  user               User     @relation(fields: [userId], references: [id])

  @@map("payment_intents")
}

model Subscription {
  id                       String   @id @default(uuid())
  userId                   String   @map("user_id")
  plan                     String
  status                   String
  provider                 String
  providerSubscriptionId   String   @map("provider_subscription_id")
  currentPeriodStart       DateTime @map("current_period_start")
  currentPeriodEnd         DateTime @map("current_period_end")
  cancelAtPeriodEnd        Boolean  @default(false) @map("cancel_at_period_end")
  creditsPerMonth          Int?     @map("credits_per_month")
  connectedAccountsLimit   Int?     @map("connected_accounts_limit")
  metadata                 Json?
  createdAt                DateTime @default(now()) @map("created_at")
  updatedAt                DateTime @updatedAt @map("updated_at")

  user                     User     @relation(fields: [userId], references: [id])

  @@map("subscriptions")
}

model Transaction {
  id                     String    @id @default(uuid())
  userId                 String    @map("user_id")
  type                   String
  status                 String
  provider               String
  providerTransactionId  String    @map("provider_transaction_id")
  amount                 Decimal   @db.Decimal(10,2)
  currency               String
  credits                Int
  description            String
  metadata               Json?
  refundedAmount         Decimal?  @db.Decimal(10,2) @map("refunded_amount")
  refundedAt             DateTime? @map("refunded_at")
  createdAt              DateTime  @default(now()) @map("created_at")
  updatedAt              DateTime  @updatedAt @map("updated_at")

  user                   User      @relation(fields: [userId], references: [id])

  @@map("transactions")
}

model WebhookEvent {
  id              String    @id @default(uuid())
  provider        String
  providerEventId String    @unique @map("provider_event_id")
  eventType       String    @map("event_type")
  payload         Json
  signature       String?
  processed       Boolean   @default(false)
  processedAt     DateTime? @map("processed_at")
  error           String?
  createdAt       DateTime  @default(now()) @map("created_at")

  @@map("webhook_events")
}

model AuditLog {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  action    String
  metadata  Json?
  createdAt DateTime @default(now()) @map("created_at")

  user      User?    @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}
```

## Integration Steps

### Step 1: Install Dependencies

```bash
npm install stripe axios uuid
npm install --save-dev @types/uuid
```

### Step 2: Configure Environment

Create `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...
APPLE_SHARED_SECRET=your_secret
DATABASE_URL=postgresql://...
```

### Step 3: Initialize Services

```typescript
// src/index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PaymentService } from './services/payment.service';
import { AppleIAPService } from './services/apple-iap.service';
import { SubscriptionService } from './services/subscription.service';
import { createPaymentsRouter } from './api/payments/payments.controller';
import { createWebhookRouter } from './api/payments/webhook.controller';
import { EmailService } from './services/email.service';

const app = express();
const db = new PrismaClient();
const emailService = new EmailService();

// Initialize services
const paymentService = new PaymentService(db, emailService);
const appleIAPService = new AppleIAPService(db, paymentService, emailService);
const subscriptionService = new SubscriptionService(db, paymentService, emailService);

// Mount routers
app.use('/api/payments', createPaymentsRouter(
  paymentService,
  appleIAPService,
  subscriptionService
));

app.use('/api/payments', createWebhookRouter(
  paymentService,
  appleIAPService
));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Step 4: Set Up Webhooks

**Stripe:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.refunded`
4. Copy webhook signing secret to `.env`

**Apple:**
- Configure App Store Server Notifications in App Store Connect
- Set endpoint: `https://yourdomain.com/api/payments/webhook/apple`

## Frontend Integration

### React/TypeScript Example

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_...');

function CreditPurchaseForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (creditPackId: string) => {
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create payment intent
      const response = await fetch('/api/payments/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditPackId })
      });

      const { paymentIntent } = await response.json();

      // 2. Confirm payment
      const { error } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!
          }
        }
      );

      if (error) {
        console.error('Payment failed:', error);
      } else {
        console.log('Payment successful!');
        // Reload user credits
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <CardElement />
      <button onClick={() => handlePurchase('pack_10')} disabled={loading}>
        Purchase 10 Credits (€15.00)
      </button>
    </Elements>
  );
}
```

### iOS Integration (Swift)

```swift
import StoreKit

class IAPManager: NSObject, SKProductsRequestDelegate, SKPaymentTransactionObserver {
    static let shared = IAPManager()

    func purchaseCredits(productId: String) {
        let payment = SKPayment(product: /* SKProduct */)
        SKPaymentQueue.default().add(payment)
    }

    func paymentQueue(_ queue: SKPaymentQueue, updatedTransactions transactions: [SKPaymentTransaction]) {
        for transaction in transactions {
            switch transaction.transactionState {
            case .purchased:
                // Validate receipt with backend
                validateReceipt(transaction)
            case .failed:
                SKPaymentQueue.default().finishTransaction(transaction)
            default:
                break
            }
        }
    }

    func validateReceipt(_ transaction: SKPaymentTransaction) {
        guard let receiptURL = Bundle.main.appStoreReceiptURL,
              let receiptData = try? Data(contentsOf: receiptURL) else {
            return
        }

        let receiptString = receiptData.base64EncodedString()

        // Send to backend
        APIClient.validateReceipt(receiptString) { result in
            switch result {
            case .success:
                SKPaymentQueue.default().finishTransaction(transaction)
                // Reload user credits
            case .failure(let error):
                print("Validation failed:", error)
            }
        }
    }
}
```

## Testing Strategy

### Unit Tests

```typescript
// payment.service.test.ts
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockDb: any;
  let mockEmailService: any;

  beforeEach(() => {
    mockDb = createMockDb();
    mockEmailService = createMockEmailService();
    paymentService = new PaymentService(mockDb, mockEmailService);
  });

  it('should create one-time payment intent', async () => {
    const result = await paymentService.createOneTimePayment('user-123', 'pack_10');

    expect(result.amount).toBe(15.00);
    expect(result.provider).toBe('stripe');
    expect(mockDb.paymentIntent.create).toHaveBeenCalled();
  });

  it('should handle insufficient credits', async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: 'user-123', credits: 0 });

    await expect(
      paymentService.deductCredits('user-123', 10)
    ).rejects.toThrow('Insufficient credits');
  });
});
```

### Integration Tests

```typescript
// webhook.test.ts
describe('Stripe Webhooks', () => {
  it('should process payment_intent.succeeded', async () => {
    const event = createMockStripeEvent('payment_intent.succeeded', {
      metadata: { userId: 'user-123', credits: '10' }
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: JSON.stringify(event),
      secret: process.env.STRIPE_WEBHOOK_SECRET!
    });

    const response = await request(app)
      .post('/api/payments/webhook/stripe')
      .set('stripe-signature', signature)
      .send(event);

    expect(response.status).toBe(200);

    // Verify credits were added
    const user = await db.user.findUnique({ where: { id: 'user-123' } });
    expect(user.credits).toBe(10);
  });
});
```

## Production Checklist

### Security
- [ ] Environment variables secured
- [ ] Webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] API authentication required

### Monitoring
- [ ] Stripe Dashboard webhook monitoring enabled
- [ ] Error logging configured
- [ ] Failed payment alerts set up
- [ ] Subscription churn tracking
- [ ] Revenue metrics dashboard

### Testing
- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] End-to-end payment flow tested
- [ ] Refund process tested
- [ ] Webhook retry tested

### Documentation
- [ ] API documentation complete
- [ ] Integration guide available
- [ ] Support runbook created
- [ ] Error codes documented

### Compliance
- [ ] PCI compliance verified (Stripe handles)
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Refund policy documented
- [ ] GDPR considerations addressed

### Deployment
- [ ] Database migrations run
- [ ] Stripe products created
- [ ] Webhook endpoints configured
- [ ] Environment variables set
- [ ] Cron jobs scheduled
- [ ] Monitoring enabled

## Support & Troubleshooting

### Common Issues

**1. Webhook Signature Verification Fails**
- Verify webhook secret matches Stripe Dashboard
- Ensure raw body is used for signature verification
- Check HTTPS is configured correctly

**2. Credits Not Added After Payment**
- Check webhook event in database
- Verify transaction status
- Check audit logs for errors

**3. Subscription Not Renewing**
- Check subscription status in Stripe Dashboard
- Verify webhook delivery
- Check grace period status

### Getting Help

- Stripe Documentation: https://stripe.com/docs
- Apple IAP Guide: https://developer.apple.com/in-app-purchase/
- Support Email: support@contestdraw.com

---

**Version:** 1.0.0
**Last Updated:** 2025-11-05
