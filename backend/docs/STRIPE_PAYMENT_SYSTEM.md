# ContestDraw - Stripe Payment System Documentation

## Overview

Complete Stripe payment integration for ContestDraw platform including subscriptions, one-time payments (48h pass), and webhook handling.

## Setup Date
Created: November 6, 2025

## Stripe Account Configuration

### Live API Keys
- **Publishable Key**: `pk_live_515YxXRACypQoxvt3AscdE45mKoP6BwpUK7q62OFxJaTpHGaPN7ldt9v8AgX35toP9TRsoZ1c2k0PO3BR04XsOrLp00sbDWFCBK`
- **Secret Key**: `sk_live_YOUR_STRIPE_SECRET_KEY` (set in .env)

### Products & Prices Created

#### 1. 48H Pass (One-time Payment)
- **Product ID**: `prod_TNG6r2ZV3j0El7`
- **Price ID**: `price_1SQVaNACypQoxvt3cpxWf36e`
- **Amount**: €9.99 (999 cents)
- **Type**: One-time payment
- **Duration**: 48 hours access

#### 2. Monthly Pro Subscription
- **Product ID**: `prod_TNG6Rfu2N9IuT9`
- **Price ID**: `price_1SQVaNACypQoxvt3KwLN8jVA`
- **Amount**: €29.99/month
- **Type**: Recurring subscription
- **Billing**: Monthly

#### 3. Annual Pro Subscription
- **Product ID**: `prod_TNG67MVvJJQIoQ`
- **Price ID**: `price_1SQVaOACypQoxvt3IwAAanL7`
- **Amount**: €299.99/year (2 months free)
- **Type**: Recurring subscription
- **Billing**: Annually

#### 4. Enterprise Plan
- **Product ID**: `prod_TNG6WF8hAetjk8`
- **Price ID**: `price_1SQVaPACypQoxvt3gJBn1ygp`
- **Amount**: €999.99/month
- **Type**: Recurring subscription
- **Billing**: Monthly

## API Endpoints

### Base URL: `/api/payments`

#### 1. Get Products
```http
GET /api/payments/products
```
- **Auth**: Not required
- **Response**: List of available products and prices

#### 2. Create Checkout Session (Subscription)
```http
POST /api/payments/checkout
```
- **Auth**: Required (Bearer token)
- **Body**:
```json
{
  "priceId": "price_1SQVaNACypQoxvt3KwLN8jVA"
}
```
- **Response**: Checkout session URL

#### 3. Create 48h Pass Session
```http
POST /api/payments/checkout/48h-pass
```
- **Auth**: Required
- **Response**: Checkout session URL for 48h pass

#### 4. Get Subscription Details
```http
GET /api/payments/subscription
```
- **Auth**: Required
- **Response**: Current user subscription details

#### 5. Cancel Subscription
```http
POST /api/payments/subscription/cancel
```
- **Auth**: Required
- **Response**: Cancelled subscription details

#### 6. Create Billing Portal Session
```http
POST /api/payments/portal
```
- **Auth**: Required
- **Response**: Stripe billing portal URL

#### 7. Webhook Handler
```http
POST /api/payments/webhook
```
- **Auth**: Stripe signature verification
- **Headers**: `stripe-signature`
- **Response**: `{ received: true }`

## Webhook Events Handled

The system handles the following Stripe webhook events:

1. **checkout.session.completed**
   - Activates subscriptions or 48h passes
   - Updates user database records

2. **customer.subscription.created**
   - Records new subscription in database

3. **customer.subscription.updated**
   - Updates subscription status and expiration

4. **customer.subscription.deleted**
   - Marks subscription as cancelled

5. **invoice.payment_succeeded**
   - Logs successful payments

6. **invoice.payment_failed**
   - Logs payment failures for follow-up

## Database Fields

The following fields should be added to the User model:

```typescript
{
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  subscriptionStatus: string | null,  // 'active', 'cancelled', 'past_due', etc.
  subscriptionType: string | null,    // 'monthly', 'annual', 'enterprise', '48h_pass'
  subscriptionExpiresAt: Date | null
}
```

## Files Created

### Services
- `/src/services/stripe.service.ts` - Main Stripe integration service

### Controllers & Routes
- `/src/api/payments/payments.controller.ts` - Payment endpoints controller
- `/src/api/payments/payments.routes.ts` - Payment routes definition
- `/src/api/payments/index.ts` - Module exports

### Scripts
- `/src/scripts/setup-stripe-products.ts` - Script to create products and prices

### Configuration
- Updated `/src/config/config.ts` with Stripe configuration
- Updated `/backend/.env` with live keys and product IDs

## Setup Instructions

### 1. Webhook Configuration

You need to configure a webhook endpoint in your Stripe Dashboard:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set URL: `https://your-domain.com/api/payments/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 2. Database Migration

Run the necessary database migrations to add subscription fields to the User table.

### 3. Testing

#### Test Checkout Flow:
```bash
# Get products
curl http://localhost:8000/api/payments/products

# Create checkout (requires auth token)
curl -X POST http://localhost:8000/api/payments/checkout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"priceId": "price_1SQVaNACypQoxvt3KwLN8jVA"}'
```

#### Test Webhook Locally:
Use Stripe CLI to forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:8000/api/payments/webhook
```

## Security Considerations

1. **API Keys**: Live keys are configured - handle with extreme care
2. **Webhook Verification**: All webhooks are verified using Stripe signatures
3. **Authentication**: All payment endpoints (except webhook) require valid JWT tokens
4. **HTTPS**: Webhooks require HTTPS in production

## Integration Examples

### Frontend Integration

```typescript
// Create checkout session
const response = await fetch('/api/payments/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    priceId: 'price_1SQVaNACypQoxvt3KwLN8jVA' // Monthly plan
  })
});

const { data } = await response.json();

// Redirect to Stripe Checkout
window.location.href = data.url;
```

### Mobile Integration

```typescript
// React Native / Expo
import { Linking } from 'react-native';

const handleSubscribe = async (priceId: string) => {
  const response = await apiService.post('/payments/checkout', { priceId });
  const { url } = response.data.data;

  // Open Stripe Checkout in browser
  await Linking.openURL(url);
};
```

## Monitoring & Logs

All payment operations are logged using the Winston logger:
- Successful checkouts
- Subscription updates
- Webhook events
- Payment failures

Check logs in `/backend/logs/` directory.

## Support

For Stripe-related issues:
1. Check Stripe Dashboard: https://dashboard.stripe.com
2. View webhook logs for delivery status
3. Check application logs for processing errors
4. Stripe support: https://support.stripe.com

## Next Steps

1. **Test thoroughly** in Stripe test mode before going live
2. **Configure webhooks** in Stripe Dashboard
3. **Run database migrations** for subscription fields
4. **Implement frontend** payment UI
5. **Set up monitoring** for failed payments
6. **Create email templates** for payment confirmations
7. **Add analytics** tracking for subscription events

---

**Status**: ✅ Complete and Ready for Integration
**Created**: November 6, 2025
**Last Updated**: November 6, 2025
