#!/bin/bash

# Verification Script for Payment Enhancements
# Run this script to verify all payment features are properly implemented

echo "=========================================="
echo "Payment Enhancements Verification Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} File exists: $1"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} File missing: $1"
    ((FAILED++))
    return 1
  fi
}

check_content() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Found '$2' in $1"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} Missing '$2' in $1"
    ((FAILED++))
    return 1
  fi
}

echo "1. Checking Service Files..."
echo "----------------------------"
check_file "src/services/pricing.service.ts"
check_file "src/services/payment.service.ts"
check_file "src/services/subscription.service.ts"
check_file "src/services/draw.service.ts"
echo ""

echo "2. Checking Test Files..."
echo "-------------------------"
check_file "tests/services/pricing.service.test.ts"
check_file "tests/services/subscription.service.test.ts"
check_file "tests/services/draw.service.test.ts"
echo ""

echo "3. Checking Documentation..."
echo "---------------------------"
check_file "docs/PAYMENT_ENHANCEMENTS.md"
check_file "docs/IMPLEMENTATION_SUMMARY.md"
check_file "prisma/migrations/add_payment_enhancements.sql"
echo ""

echo "4. Checking Type Definitions..."
echo "-------------------------------"
check_content "src/types/payment.types.ts" "PASS_48H"
check_content "src/types/payment.types.ts" "Platform"
check_content "src/types/payment.types.ts" "PlatformPrice"
echo ""

echo "5. Checking Prisma Schema..."
echo "---------------------------"
check_content "prisma/schema.prisma" "trial_used"
check_content "prisma/schema.prisma" "bonus_granted"
check_content "prisma/schema.prisma" "is48HPass"
check_content "prisma/schema.prisma" "planType"
echo ""

echo "6. Checking Implementation Details..."
echo "------------------------------------"
check_content "src/services/pricing.service.ts" "getPlatformPrice"
check_content "src/services/pricing.service.ts" "detectPlatform"
check_content "src/services/pricing.service.ts" "IOS_MARKUP"
check_content "src/services/subscription.service.ts" "hasActive48HPass"
check_content "src/services/subscription.service.ts" "processExpired48HPasses"
check_content "src/services/subscription.service.ts" "allowsUnlimitedDraws"
check_content "src/services/draw.service.ts" "checkFreeTrialEligibility"
check_content "src/services/draw.service.ts" "canPerformDraw"
check_content "src/api/auth/auth.controller.ts" "Welcome bonus"
echo ""

echo "7. Environment Variables Check..."
echo "--------------------------------"
if [ -f ".env" ] || [ -f ".env.example" ]; then
  echo -e "${YELLOW}⚠${NC}  Remember to set: STRIPE_PRICE_PASS_48H"
else
  echo -e "${YELLOW}⚠${NC}  .env file not found (expected in development)"
fi
echo ""

echo "========================================"
echo "Verification Summary"
echo "========================================"
echo -e "Passed: ${GREEN}${PASSED}${NC}"
echo -e "Failed: ${RED}${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: npx prisma migrate dev --name add_payment_enhancements"
  echo "2. Run: npm test"
  echo "3. Set STRIPE_PRICE_PASS_48H in .env"
  echo "4. Configure cron job for pass expiration"
  exit 0
else
  echo -e "${RED}✗ Some checks failed. Please review the output above.${NC}"
  exit 1
fi
