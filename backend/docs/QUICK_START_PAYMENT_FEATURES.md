# Quick Start: Payment Enhancements

## TL;DR

Four new payment features implemented and ready to deploy:
1. **48h Pass** (€12.99) - Unlimited draws for 48 hours
2. **iOS Pricing** (+30%) - Automatic markup for App Store
3. **Welcome Bonus** (3 credits) - Auto-granted on signup
4. **Free Trial** (1 draw) - 100-200 participants limit

## 5-Minute Setup

### 1. Database Migration
```bash
cd backend
npx prisma migrate dev --name add_payment_enhancements
npx prisma generate
```

### 2. Environment Variables
Add to `.env`:
```env
STRIPE_PRICE_PASS_48H=price_xxxxxxxxxxxxx  # Create in Stripe Dashboard
```

### 3. Run Tests
```bash
npm test
# All tests should pass ✓
```

### 4. Configure Cron Job
Add to your cron service (e.g., node-cron):
```typescript
import cron from 'node-cron';
import { subscriptionService } from './services/subscription.service';

// Every hour, check for expired 48h passes
cron.schedule('0 * * * *', async () => {
  await subscriptionService.processExpired48HPasses();
});
```

### 5. Verify Installation
```bash
./scripts/verify-payment-enhancements.sh
# Should show: ✓ All checks passed!
```

## Usage Examples

### Check if User Has Active 48h Pass
```typescript
import { subscriptionService } from '@/services/subscription.service';

const hasPass = await subscriptionService.hasActive48HPass(userId);
if (hasPass) {
  // User has unlimited draws
}
```

### Get Platform-Specific Pricing
```typescript
import { pricingService } from '@/services/pricing.service';

const platform = pricingService.detectPlatform(req.headers['user-agent']);
const price = pricingService.getCreditPackPricing('pack_10', platform);

// Returns: { price: 19.50, originalPrice: 15.00, currency: 'EUR' } for iOS
```

### Check Draw Eligibility
```typescript
import { drawService } from '@/services/draw.service';

const eligibility = await drawService.canPerformDraw(userId, db, subscriptionService);

if (!eligibility.allowed) {
  throw new Error(eligibility.reason);
}

if (eligibility.useTrial) {
  // User is using free trial
  await drawService.checkFreeTrialEligibility(userId, participantCount, db);
}
```

### Create 48h Pass Subscription
```typescript
import { paymentService } from '@/services/payment.service';

const subscription = await paymentService.createSubscription(
  userId,
  SubscriptionPlan.PASS_48H
);

// Returns subscription with 48-hour validity
```

## API Endpoints (Recommended)

### GET /api/pricing
Get platform-specific pricing for all items.

**Query Parameters**:
- `platform` (optional): `web`, `ios`, `android`

**Response**:
```json
{
  "creditPacks": [
    { "id": "one_shot", "credits": 1, "price": 1.99, "iosPrice": 2.59 },
    { "id": "pack_10", "credits": 10, "price": 15.00, "iosPrice": 19.50 }
  ],
  "subscriptions": [
    { "plan": "pass_48h", "price": 12.99, "iosPrice": 16.89, "duration": "48 hours" }
  ]
}
```

### GET /api/users/me/eligibility
Check if user can perform a draw.

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

### POST /api/subscriptions/pass-48h
Purchase 48-hour pass.

**Body**:
```json
{
  "platform": "ios",
  "paymentMethodId": "pm_xxxxx"
}
```

## Price Table

| Item | Web/Android | iOS (+30%) |
|------|-------------|------------|
| 1 Credit | €1.99 | €2.59 |
| 5 Credits | €8.00 | €10.40 |
| 10 Credits | €15.00 | €19.50 |
| 20 Credits | €28.00 | €36.40 |
| Monthly Sub | €19.99 | €25.99 |
| **48h Pass** | **€12.99** | **€16.89** |

## Key Features

### 48-Hour Pass
- **Duration**: Exactly 48 hours from purchase
- **Access**: Unlimited draws (no credit deduction)
- **Expiration**: Automatic via cron job
- **Notifications**: Email sent on expiration
- **Social Accounts**: 1 connected account

### iOS Pricing
- **Markup**: 30% (configurable in `PricingService`)
- **Detection**: Automatic from User-Agent or manual
- **Display**: Shows both iOS and original price
- **Validation**: Server-side price verification

### Welcome Bonus
- **Amount**: 3 credits
- **Timing**: Granted immediately on registration
- **Tracking**: `bonus_granted` field prevents duplicates
- **Usage**: Same as purchased credits

### Free Trial
- **Eligibility**: New users with 0 credits
- **Limit**: 1 draw per user (lifetime)
- **Participants**: 100-200 required
- **Tracking**: `trial_used` field in database

## Monitoring

### Key Metrics
```sql
-- Active 48h passes
SELECT COUNT(*) FROM subscriptions
WHERE is48HPass = TRUE AND status = 'ACTIVE'
  AND currentPeriodEnd > NOW();

-- Users eligible for trial
SELECT COUNT(*) FROM users
WHERE trial_used = FALSE AND credits = 0;

-- Welcome bonuses granted
SELECT COUNT(*) FROM users WHERE bonus_granted = TRUE;
```

### Log Searches
```bash
# 48h pass activity
grep "48h pass" logs/app.log

# Trial usage
grep "free trial" logs/app.log

# Welcome bonus grants
grep "Welcome bonus" logs/app.log
```

## Troubleshooting

### Trial Not Working
```typescript
// Check user status
const user = await db.user.findUnique({ where: { id: userId } });
console.log({
  credits: user.credits,
  trial_used: user.trial_used,
  bonus_granted: user.bonus_granted
});
```

### 48h Pass Not Expiring
```bash
# Manually trigger expiration
node -e "
  import('./services/subscription.service').then(({ subscriptionService }) => {
    subscriptionService.processExpired48HPasses();
  });
"
```

### iOS Prices Wrong
```typescript
// Test platform detection
const platform = pricingService.detectPlatform('Mozilla/5.0 (iPhone...)');
console.log(platform); // Should be 'ios'

// Test price calculation
const price = pricingService.getPlatformPrice(10.00, Platform.IOS);
console.log(price); // Should be 13.00
```

## Security Notes

1. **Trial Limits**: Enforced server-side, cannot be bypassed
2. **Price Validation**: Always validate received prices against expected platform markup
3. **Bonus Tracking**: One-time grant, tracked in database
4. **Pass Expiration**: Automatic, cannot be extended

## Support

- **Documentation**: `/backend/docs/PAYMENT_ENHANCEMENTS.md`
- **Implementation**: `/backend/docs/IMPLEMENTATION_SUMMARY.md`
- **Tests**: `/backend/tests/services/*.test.ts`
- **Verification**: `./scripts/verify-payment-enhancements.sh`

## Next Steps

1. ✅ Complete implementation
2. ⏳ Run database migration
3. ⏳ Configure Stripe
4. ⏳ Set up cron job
5. ⏳ Run tests
6. ⏳ Deploy to staging
7. ⏳ QA testing
8. ⏳ Production deployment

---

**Status**: ✅ Implementation Complete
**Last Updated**: 2025-11-05
**Version**: 1.0.0
