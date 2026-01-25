# Payment and Subscription Enhancements

## Overview

This document describes the payment and subscription enhancements implemented for ContestDraw, including the 48-hour pass, iOS pricing adjustments, welcome bonus system, and free trial system.

## Features Implemented

### 1. 48-Hour Pass Subscription Tier

**Description**: Temporary subscription that provides unlimited draws for 48 hours.

**Pricing**: €12.99 (base price, subject to platform-specific adjustments)

**Features**:
- Unlimited draws during the 48-hour period
- No credit consumption during active period
- Auto-expires after 48 hours
- Email notifications on expiration
- 1 connected social account

**Implementation Files**:
- `/backend/src/types/payment.types.ts` - Added `PASS_48H` enum
- `/backend/src/services/subscription.service.ts` - 48h pass logic
- `/backend/src/services/payment.service.ts` - Payment handling
- `/backend/prisma/schema.prisma` - Database schema updates

**Usage**:
```typescript
// Check if user has active 48h pass
const hasPass = await subscriptionService.hasActive48HPass(userId);

// Check if subscription allows unlimited draws
const unlimited = await subscriptionService.allowsUnlimitedDraws(userId);

// Process expired passes (cron job)
await subscriptionService.processExpired48HPasses();
```

**Stripe Integration**:
- Set environment variable: `STRIPE_PRICE_PASS_48H`
- Create Stripe Price in dashboard with 48-hour interval
- Webhook handlers auto-expire passes

### 2. iOS Pricing Adjustment

**Description**: Automatic 30% markup for iOS App Store purchases to account for Apple's commission.

**Pricing Service** (`/backend/src/services/pricing.service.ts`):
```typescript
const pricingService = new PricingService();

// Get platform-specific price
const price = pricingService.getPlatformPrice(10.00, Platform.IOS);
// Returns: { platform: 'ios', price: 13.00, originalPrice: 10.00, currency: 'EUR' }

// Detect platform from user agent
const platform = pricingService.detectPlatform(req.headers['user-agent']);

// Get credit pack with platform pricing
const pack = pricingService.getCreditPackDetails('pack_10', platform);
```

**Platform Detection**:
- Automatic detection from User-Agent header
- Manual override via `clientPlatform` parameter
- Supports: Web, iOS, Android

**Price Examples**:
| Item | Web Price | iOS Price | Android Price |
|------|-----------|-----------|---------------|
| 1 Credit | €1.99 | €2.59 | €1.99 |
| 10 Credits | €15.00 | €19.50 | €15.00 |
| 48h Pass | €12.99 | €16.89 | €12.99 |

### 3. Welcome Bonus System

**Description**: New users receive 3 free credits upon registration.

**Implementation**:
- Credits added automatically during registration
- One-time bonus tracked with `bonus_granted` field
- Prevents abuse by checking existing users

**Files Modified**:
- `/backend/src/api/auth/auth.controller.ts`
- `/backend/prisma/schema.prisma` - Added `bonus_granted` field

**Database Schema**:
```prisma
model User {
  credits       Int     @default(3)
  bonus_granted Boolean @default(true)
  // ...
}
```

**Registration Flow**:
```typescript
// User registers
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response includes 3 credits
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "credits": 3,
    "bonus_granted": true
  }
}
```

### 4. Free Trial System

**Description**: First-time users can perform one free draw with 100-200 participants.

**Trial Limits**:
- **Minimum participants**: 100
- **Maximum participants**: 200
- **Usage**: One-time only per user
- **Tracked via**: `trial_used` boolean field

**Implementation Files**:
- `/backend/src/services/draw.service.ts` - Trial logic
- `/backend/prisma/schema.prisma` - Added `trial_used` field

**Trial Eligibility Check**:
```typescript
// Check if user can perform draw
const canDraw = await drawService.canPerformDraw(userId, db, subscriptionService);

// Returns:
{
  allowed: true,
  reason: "Free trial available (100-200 participants)",
  useTrial: true
}
```

**Trial Flow**:
1. User has no credits and hasn't used trial
2. Draw has 100-200 participants
3. System allows draw and marks `trial_used = true`
4. Subsequent draws require credits or subscription

**Error Messages**:
- "Free trial already used. Please purchase credits to continue."
- "Free trial requires at least 100 participants. Current: X"
- "Free trial limited to 200 participants. Current: X. Please purchase credits for larger draws."

## Database Migrations

**Migration Required**: Yes

**New Fields**:
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN trial_used BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN bonus_granted BOOLEAN DEFAULT TRUE;
ALTER TABLE users ALTER COLUMN credits SET DEFAULT 3;

-- Add to subscriptions table
ALTER TABLE subscriptions ADD COLUMN planType VARCHAR(50) DEFAULT 'monthly';
ALTER TABLE subscriptions ADD COLUMN is48HPass BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_subscriptions_48h_pass ON subscriptions(is48HPass, currentPeriodEnd);
```

**Run Migration**:
```bash
npx prisma migrate dev --name add_payment_enhancements
npx prisma generate
```

## Testing

**Test Files Created**:
- `/backend/tests/services/pricing.service.test.ts` - iOS pricing tests
- `/backend/tests/services/subscription.service.test.ts` - 48h pass tests
- `/backend/tests/services/draw.service.test.ts` - Free trial tests

**Run Tests**:
```bash
npm test
npm test -- --coverage
```

**Test Coverage**:
- Pricing Service: Platform detection, markup calculation, price validation
- Subscription Service: 48h pass activation, expiration, unlimited draws
- Draw Service: Trial eligibility, participant limits, usage tracking

## API Endpoints

### Create 48h Pass Subscription
```http
POST /api/payments/subscriptions
Content-Type: application/json

{
  "plan": "pass_48h",
  "platform": "ios"  // Optional: web, ios, android
}
```

### Get Platform-Specific Pricing
```http
GET /api/payments/pricing?platform=ios&pack=pack_10
```

**Response**:
```json
{
  "platform": "ios",
  "price": 19.50,
  "originalPrice": 15.00,
  "currency": "EUR",
  "credits": 10
}
```

### Check Draw Eligibility
```http
GET /api/draws/eligibility
```

**Response**:
```json
{
  "allowed": true,
  "reason": "Free trial available (100-200 participants)",
  "useTrial": true,
  "credits": 0,
  "hasPass": false
}
```

## Stripe Webhook Handlers

**48h Pass Expiration**:
```typescript
// Webhook event: subscription.updated
// Automatically expires passes after 48 hours
await subscriptionService.processExpired48HPasses();
```

**Webhook Setup**:
1. Configure Stripe webhook endpoint: `/api/payments/webhook`
2. Add events: `subscription.created`, `subscription.updated`, `subscription.deleted`
3. Set `STRIPE_WEBHOOK_SECRET` environment variable

## Cron Jobs

**48h Pass Expiration Check**:
```typescript
// Run every hour
cron.schedule('0 * * * *', async () => {
  await subscriptionService.processExpired48HPasses();
});
```

## Environment Variables

**Required**:
```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_ANNUAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...
STRIPE_PRICE_PASS_48H=price_...  # NEW
```

## Monitoring and Logs

**Key Log Messages**:
- `[Subscription] 48h pass {id} expired for user {userId}`
- `[Draw] User {userId} using free trial for draw with {count} participants`
- `Welcome bonus: 3 credits granted to new user {email}`

**Metrics to Track**:
- 48h pass purchase rate
- 48h pass conversion to regular subscription
- Free trial usage rate
- Free trial to paid conversion rate
- iOS vs Web revenue split

## Pricing Summary

| Item | Web/Android | iOS | Notes |
|------|-------------|-----|-------|
| **Credit Packs** ||||
| 1 Credit | €1.99 | €2.59 | One-shot purchase |
| 5 Credits | €8.00 | €10.40 | 20% savings |
| 10 Credits | €15.00 | €19.50 | 25% savings |
| 20 Credits | €28.00 | €36.40 | 30% savings |
| **Subscriptions** ||||
| Monthly | €19.99 | €25.99 | 10 credits/month |
| Annual | €199.00 | €258.70 | 120 credits/year |
| Enterprise | €49.00 | €63.70 | 30 credits/month |
| **48h Pass** | **€12.99** | **€16.89** | **Unlimited draws for 48h** |
| **Welcome Bonus** | 3 credits | 3 credits | One-time, automatic |
| **Free Trial** | 1 draw | 1 draw | 100-200 participants |

## Security Considerations

1. **Trial Abuse Prevention**:
   - One trial per user (tracked by `trial_used`)
   - Participant limits enforced (100-200)
   - Cannot be reset by user

2. **Bonus Abuse Prevention**:
   - One-time grant on registration
   - Tracked with `bonus_granted` field
   - Email verification recommended

3. **Platform Price Validation**:
   - Validate received prices against expected platform markup
   - Use `validatePlatformPrice()` method
   - Log discrepancies for fraud detection

4. **48h Pass Management**:
   - Auto-expires after period ends
   - Cannot be extended or renewed (must purchase new)
   - Cron job ensures timely expiration

## Future Enhancements

1. **Referral System**: Give bonus credits for successful referrals
2. **Seasonal Promotions**: Temporary pricing adjustments
3. **Gift Cards**: Purchasable credit vouchers
4. **Family Plans**: Shared subscriptions for multiple users
5. **Trial Extensions**: Allow extension for high-value users

## Support and Troubleshooting

**Common Issues**:

1. **Trial Not Working**:
   - Check `trial_used` field in database
   - Verify participant count is 100-200
   - Ensure user has no credits

2. **48h Pass Not Expiring**:
   - Check cron job is running
   - Verify `currentPeriodEnd` timestamp
   - Run manual expiration: `processExpired48HPasses()`

3. **iOS Prices Incorrect**:
   - Verify platform detection
   - Check `IOS_MARKUP` constant (should be 1.30)
   - Validate user agent parsing

4. **Welcome Bonus Not Granted**:
   - Check `bonus_granted` field
   - Verify credits default is 3 in schema
   - Check registration logs

## Related Documentation

- [Stripe Integration Guide](./STRIPE_INTEGRATION.md)
- [Subscription Management](./SUBSCRIPTION_MANAGEMENT.md)
- [Credit System](./CREDIT_SYSTEM.md)
- [Draw API Reference](./API_REFERENCE.md#draws)

---

**Last Updated**: 2025-11-05
**Version**: 1.0.0
**Author**: Backend Development Team
