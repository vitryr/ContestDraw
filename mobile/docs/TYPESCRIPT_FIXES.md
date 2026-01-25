# TypeScript Fixes Required

**Total Errors:** 14
**Estimated Fix Time:** 30 minutes
**Priority:** HIGH (blocking app launch)

---

## 🔧 Quick Fix Guide

### Fix 1: Navigation Import (9 errors)

**Affected Files:**
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/navigation/MainNavigator.tsx`
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/DrawAnimationScreen.tsx`
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/DrawConfigScreen.tsx`
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/DrawHistoryScreen.tsx`
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/HomeScreen.tsx`
- `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/NewDrawScreen.tsx`

**Problem:**
```typescript
// ❌ WRONG
import { createNativeStackNavigator } from '@react-native/native-stack';
```

**Solution:**
```typescript
// ✅ CORRECT
import { createNativeStackNavigator } from '@react-navigation/native-stack';
```

**Command to Fix:**
```bash
cd /Users/romainvitry/Documents/Dev/ContestDraw/mobile

# Find and replace in all files
find src -name "*.tsx" -type f -exec sed -i '' 's/@react-native\/native-stack/@react-navigation\/native-stack/g' {} +
```

---

### Fix 2: Expo Constants ReleaseChannel (1 error)

**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/config/environment.ts`

**Line:** 21

**Problem:**
```typescript
// ❌ WRONG
const releaseChannel = Constants.expoConfig?.releaseChannel;
```

**Solution:**
```typescript
// ✅ CORRECT
const releaseChannel = Constants.expoConfig?.extra?.releaseChannel || 'development';
```

---

### Fix 3: Stripe Payment Service (3 errors)

**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/services/paymentService.ts`

#### Error 3a: useStripeTerminal (line 9)

**Problem:**
```typescript
// ❌ WRONG
import { useStripeTerminal } from '@stripe/stripe-react-native';
```

**Solution (Option 1 - Remove):**
```typescript
// ✅ CORRECT - Comment out if not using Terminal
// import { useStripeTerminal } from '@stripe/stripe-react-native';
```

**Solution (Option 2 - Conditional Import):**
```typescript
// ✅ CORRECT - Only if Stripe Terminal is configured
import type { StripeTerminal } from '@stripe/stripe-react-native';
```

#### Error 3b: Transaction Receipt Type (lines 90-92)

**Problem:**
```typescript
// ❌ WRONG
const receipt = purchase.transactionReceipt;
return purchase as Purchase;
```

**Solution:**
```typescript
// ✅ CORRECT
const receipt = Array.isArray(purchase)
  ? purchase[0]?.transactionReceipt
  : purchase?.transactionReceipt;

return Array.isArray(purchase) ? purchase[0] : purchase;
```

---

### Fix 4: Navigation Replace Method (1 error)

**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/screens/DrawAnimationScreen.tsx`

**Line:** 44

**Problem:**
```typescript
// ❌ WRONG
navigation.replace('DrawResult', { drawId: result.id });
```

**Solution:**
```typescript
// ✅ CORRECT
import { CommonActions } from '@react-navigation/native';

navigation.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'DrawResult', params: { drawId: result.id } }],
  })
);
```

---

## 🚀 Automated Fix Script

Create and run this script to fix all issues at once:

```bash
#!/bin/bash
# save as: fix-typescript.sh

cd /Users/romainvitry/Documents/Dev/ContestDraw/mobile

echo "🔧 Fixing TypeScript errors..."

# Fix 1: Navigation imports
echo "1. Fixing navigation imports..."
find src -name "*.tsx" -type f -exec sed -i '' 's/@react-native\/native-stack/@react-navigation\/native-stack/g' {} +

# Fix 2: Expo Constants
echo "2. Fixing Expo Constants..."
sed -i '' 's/Constants.expoConfig?.releaseChannel/Constants.expoConfig?.extra?.releaseChannel || "development"/g' src/config/environment.ts

echo "✅ Automated fixes complete!"
echo "⚠️  Manual fixes still needed in:"
echo "   - src/services/paymentService.ts (Stripe types)"
echo "   - src/screens/DrawAnimationScreen.tsx (navigation.replace)"
```

**Run it:**
```bash
chmod +x fix-typescript.sh
./fix-typescript.sh
```

---

## 🧪 Verification

After applying fixes, verify with:

```bash
cd /Users/romainvitry/Documents/Dev/ContestDraw/mobile

# Check for remaining TypeScript errors
npm run typecheck

# Expected output: "No errors found"
```

---

## 📝 Manual Review Checklist

- [ ] Fixed navigation imports in 6 screen files
- [ ] Fixed environment.ts releaseChannel access
- [ ] Removed/commented useStripeTerminal import
- [ ] Fixed IAP purchase type handling
- [ ] Updated navigation.replace to CommonActions.reset
- [ ] Ran `npm run typecheck` successfully
- [ ] No TypeScript errors remaining

---

## 🔍 Detailed Error Analysis

### Navigation Type Errors Explanation

The project uses `@react-navigation/native-stack` but imports were referencing the old `@react-native/native-stack` package. This causes TypeScript to fail finding the correct types.

**Root Cause:** Outdated import statements
**Impact:** Navigation type checking fails
**Severity:** HIGH (blocks development)

### Stripe Payment Errors Explanation

The `@stripe/stripe-react-native` package version 0.37.2 doesn't export `useStripeTerminal` by default. This is a Terminal SDK feature that requires additional configuration.

**Root Cause:** Importing non-existent export
**Impact:** Payment service fails to compile
**Severity:** MEDIUM (can be commented out if not using Terminal)

### IAP Type Errors Explanation

The `react-native-iap` library can return either a single purchase or an array of purchases. The code doesn't handle the array case properly.

**Root Cause:** Missing array type handling
**Impact:** Purchase processing type mismatches
**Severity:** MEDIUM (runtime may work, but type-unsafe)

---

## 🎯 Priority Order

1. **HIGH Priority** (Must fix before launch)
   - ✅ Navigation imports (automated)
   - ✅ Expo Constants (automated)

2. **MEDIUM Priority** (Should fix before testing payments)
   - ⚠️ Stripe service types (manual)
   - ⚠️ IAP purchase handling (manual)

3. **LOW Priority** (Can defer if not using feature)
   - ⚠️ Navigation replace method (manual, only affects specific flow)

---

*Fix Guide Generated: 2025-11-05*
*Next: Run automated fixes, then manual review*
