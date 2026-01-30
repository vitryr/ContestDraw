# Stripe Payment Integration Setup

## Overview

The credit system is fully integrated with Stripe for payment processing. This guide explains how to configure Stripe for testing.

## Current Implementation

### Frontend Pages
- `/buy-credits` - Credit pack purchase page with 3 options (Starter $9, Pro $39, Business $129)
- `/payment/success` - Success page with confetti animation after payment
- `/payment/cancel` - Cancel page if user cancels checkout
- `/pricing` - Updated to link to buy credits page

### Backend Endpoints
- `POST /api/payments/checkout/credits` - Creates Stripe checkout session for credit pack
- `POST /api/payments/webhook` - Handles Stripe webhooks for payment completion
- `GET /api/credits/balance` - Returns real credit balance from database
- `GET /api/credits/history` - Returns credit transaction history from database

### Database Schema
- `User.credits` - Integer field storing user's credit balance (default: 3 trial credits)
- `CreditTransaction` - Records all credit transactions (purchases, consumption, refunds)

## Configuration

### 1. Get Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your test API keys:
   - Secret key: `sk_test_...`
   - Publishable key: `pk_test_...`

### 2. Configure Environment Variables

Add to your `.env` file or Docker environment:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here  # Optional for local testing
```

For Docker, add to `docker-compose.yml` or create `.env.docker`:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### 3. Restart Backend

```bash
docker compose up -d --build backend
```

### 4. Test the Flow

1. Login to the application
2. Navigate to `/buy-credits` or click "Buy Credits" from pricing page
3. Select a credit pack
4. Complete Stripe test checkout (use test card: 4242 4242 4242 4242)
5. Verify credits are added after successful payment

## Webhook Configuration (Production)

For production, configure webhooks in Stripe Dashboard:

1. Go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Email Receipts

Stripe automatically sends email receipts when:
- A payment is successful
- The customer's Stripe settings allow receipt emails

No additional configuration is needed - Stripe handles receipt delivery.

## Testing

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

### Verify Credits Added
After successful payment, check the user's credit balance:
```bash
curl -s http://localhost:3000/api/credits/balance \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Check Transaction History
```bash
curl -s http://localhost:3000/api/credits/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Credit Packs

| Pack | Credits | Price | Per Credit |
|------|---------|-------|------------|
| Starter | 10 | $9 | $0.90 |
| Professional | 50 | $39 | $0.78 |
| Business | 200 | $129 | $0.65 |

## Flow Diagram

```
User → Buy Credits Page → Select Pack → Stripe Checkout
                                              ↓
                              ← Payment Success Page ← Stripe Webhook
                                              ↓
                                    Credits Added to User Account
                                    Transaction Recorded in Database
                                    Stripe Sends Receipt Email
```
