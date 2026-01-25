# Payment System Quick Reference

## 🚀 Quick Start

```typescript
// Initialize services
const paymentService = new PaymentService(db, emailService);
const appleIAPService = new AppleIAPService(db, paymentService, emailService);
const subscriptionService = new SubscriptionService(db, paymentService, emailService);
```

## 📦 Credit Packs

| Pack ID | Credits | Price | Best For |
|---------|---------|-------|----------|
| `one_shot` | 1 | €2.49 | Single use |
| `pack_5` | 5 | €8.00 | Light users |
| `pack_10` | 10 | €15.00 | Regular users ⭐ |
| `pack_20` | 20 | €28.00 | Power users |

## 💳 Subscription Plans

| Plan | Price | Credits/Month | Accounts | Features |
|------|-------|---------------|----------|----------|
| **Monthly** | €19.99/mo | 10 | 3 | Analytics |
| **Annual** | €199.00/yr | 120 | 5 | Priority Support, API ⭐ |
| **Enterprise** | €49.00/mo | 30 | 10 | All features, Custom |

## 🔑 Key Methods

### PaymentService

```typescript
// One-time purchase
await paymentService.createOneTimePayment(userId, 'pack_10');

// Create subscription
await paymentService.createSubscription(userId, SubscriptionPlan.MONTHLY);

// Cancel subscription
await paymentService.cancelSubscription(subscriptionId);

// Update subscription
await paymentService.updateSubscription(subscriptionId, SubscriptionPlan.ANNUAL);

// Handle webhook
await paymentService.handleStripeWebhook(rawBody, signature);

// Credit management
await paymentService.addCredits(userId, 10, 'Purchase');
await paymentService.deductCredits(userId, 1);

// Transaction history
const txns = await paymentService.getTransactionHistory(userId);

// Refund
await paymentService.processRefund({
  transactionId: 'tx_123',
  reason: 'Customer request'
});
```

### AppleIAPService

```typescript
// Validate receipt
await appleIAPService.validateReceipt(receiptData, userId);

// Check renewals
await appleIAPService.checkSubscriptionRenewals(userId);

// Handle cancellation
await appleIAPService.handleSubscriptionCancellation(transactionId);

// Get iOS pricing
const products = appleIAPService.getIOSProducts();

// Calculate iOS price
const iosPrice = appleIAPService.getIOSPricing(15.00); // €19.50 (+30%)
```

### SubscriptionService

```typescript
// Check subscription
const hasSubscription = await subscriptionService.hasActiveSubscription(userId);

// Get active subscription
const subscription = await subscriptionService.getActiveSubscription(userId);

// Check status
const status = await subscriptionService.checkSubscriptionStatus(userId);
// Returns: { hasSubscription, status, plan, daysRemaining, connectedAccountsLimit, creditsPerMonth }

// Check account limits
const canConnect = await subscriptionService.canConnectAccount(userId);
const limit = await subscriptionService.getConnectedAccountsLimit(userId);

// Allocate monthly credits
await subscriptionService.allocateMonthlyCredits(subscriptionId);

// Process grace periods
await subscriptionService.processGracePeriods();

// Get analytics
const analytics = await subscriptionService.getSubscriptionAnalytics(userId);
// Returns: { totalSpent, totalCreditsReceived, subscriptionDuration, averageCreditsPerMonth }

// Send renewal reminders
await subscriptionService.checkRenewalReminders();

// Get features
const features = subscriptionService.getSubscriptionFeatures(SubscriptionPlan.MONTHLY);
```

## 🌐 API Endpoints

### Credit Purchases
```bash
# Purchase credits
POST /api/payments/credits/purchase
Body: { "creditPackId": "pack_10" }

# Get packs
GET /api/payments/credits/packs
```

### Subscriptions
```bash
# Create
POST /api/payments/subscriptions/create
Body: { "plan": "monthly" }

# Cancel
POST /api/payments/subscriptions/:id/cancel

# Update
POST /api/payments/subscriptions/:id/update
Body: { "newPlan": "annual" }

# Status
GET /api/payments/subscriptions/status

# Plans
GET /api/payments/subscriptions/plans
```

### Apple IAP
```bash
# Validate receipt
POST /api/payments/apple/validate
Body: { "receiptData": "base64..." }

# Get products
GET /api/payments/apple/products
```

### Transactions
```bash
# History
GET /api/payments/transactions?limit=50&offset=0

# Single transaction
GET /api/payments/transactions/:id

# Request refund
POST /api/payments/refunds/request
Body: { "transactionId": "...", "reason": "..." }

# Analytics
GET /api/payments/analytics
```

### Webhooks
```bash
# Stripe
POST /api/payments/webhook/stripe

# Apple
POST /api/payments/webhook/apple
```

## 🔐 Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# Apple
APPLE_SHARED_SECRET=your_secret
APPLE_BUNDLE_ID=com.contestdraw.app

# Database
DATABASE_URL=postgresql://...

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG...
```

## 🧪 Test Cards (Stripe)

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0025 0000 3155` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |

## 📊 Status Enums

### TransactionStatus
```typescript
PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED | CANCELLED
```

### SubscriptionStatus
```typescript
ACTIVE | PAST_DUE | CANCELLED | EXPIRED | TRIALING | GRACE_PERIOD
```

### TransactionType
```typescript
ONE_SHOT_PURCHASE | SUBSCRIPTION_CHARGE | SUBSCRIPTION_RENEWAL |
REFUND | CREDIT_ADJUSTMENT
```

## ⚠️ Error Codes

| Code | Meaning |
|------|---------|
| `INVALID_PACK` | Credit pack ID not found |
| `INVALID_PLAN` | Subscription plan invalid |
| `INSUFFICIENT_CREDITS` | User has too few credits |
| `NOT_FOUND` | Resource not found |
| `INVALID_SIGNATURE` | Webhook signature verification failed |
| `ALREADY_REFUNDED` | Transaction already refunded |
| `VALIDATION_FAILED` | Apple receipt validation failed |
| `CONFIG_ERROR` | Missing configuration |
| `SERVICE_UNAVAILABLE` | External service unavailable |

## 🔄 Webhook Events

### Stripe Events
- `payment_intent.succeeded` → Add credits
- `payment_intent.payment_failed` → Notify user
- `invoice.payment_succeeded` → Allocate subscription credits
- `invoice.payment_failed` → Mark past due
- `customer.subscription.updated` → Update subscription
- `customer.subscription.deleted` → Expire subscription
- `charge.refunded` → Mark refunded

### Apple Events
- `INITIAL_BUY` → Validate & process
- `DID_RENEW` → Process renewal
- `CANCEL` → Mark cancelled
- `DID_FAIL_TO_RENEW` → Check grace period
- `REFUND` → Handle refund

## 🛠️ Common Operations

### User Credit Check
```typescript
const user = await db.user.findUnique({ where: { id: userId } });
console.log(`Credits: ${user.credits}`);
```

### Check Subscription
```typescript
const status = await subscriptionService.checkSubscriptionStatus(userId);
if (status.hasSubscription) {
  console.log(`Plan: ${status.plan}, Days remaining: ${status.daysRemaining}`);
}
```

### Verify Account Limit
```typescript
const canConnect = await subscriptionService.canConnectAccount(userId);
if (!canConnect) {
  throw new Error('Account limit reached. Upgrade subscription.');
}
```

### Purchase Flow
```typescript
// 1. Create payment intent
const intent = await paymentService.createOneTimePayment(userId, packId);

// 2. Client confirms with Stripe
// stripe.confirmCardPayment(intent.clientSecret)

// 3. Webhook processes success
// payment_intent.succeeded → credits added automatically
```

## 📅 Cron Jobs

```bash
# Daily renewals check
0 0 * * * node dist/scripts/check-renewals.js

# Daily grace periods
0 1 * * * node dist/scripts/process-grace-periods.js

# Daily renewal reminders (9am)
0 9 * * * node dist/scripts/send-reminders.js

# Weekly webhook cleanup
0 0 * * 0 node dist/scripts/cleanup-webhooks.js
```

## 🔍 Debugging

### Check transaction status
```sql
SELECT * FROM transactions WHERE user_id = 'user-123' ORDER BY created_at DESC;
```

### Check webhook processing
```sql
SELECT * FROM webhook_events WHERE processed = false;
```

### Check subscription status
```sql
SELECT * FROM subscriptions WHERE user_id = 'user-123' AND status = 'ACTIVE';
```

### Check audit logs
```sql
SELECT * FROM audit_logs WHERE user_id = 'user-123' ORDER BY created_at DESC LIMIT 10;
```

## 📞 Support Checklist

When helping users with payment issues:

1. ✅ Check user credit balance
2. ✅ Review transaction history
3. ✅ Check webhook event processing
4. ✅ Verify Stripe payment status
5. ✅ Check subscription status
6. ✅ Review audit logs
7. ✅ Check for pending refunds

---

**Version:** 1.0.0 | **Updated:** 2025-11-05
