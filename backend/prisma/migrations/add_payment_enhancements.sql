-- Migration: Add Payment Enhancements
-- Description: Add 48h pass, trial system, welcome bonus, and iOS pricing support
-- Date: 2025-11-05

-- Add new fields to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS trial_used BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bonus_granted BOOLEAN DEFAULT TRUE,
  ALTER COLUMN credits SET DEFAULT 3;

-- Update existing users to have welcome bonus
UPDATE users
SET credits = credits + 3, bonus_granted = TRUE
WHERE bonus_granted = FALSE OR bonus_granted IS NULL;

-- Add new fields to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS planType VARCHAR(50) DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS is48HPass BOOLEAN DEFAULT FALSE;

-- Create index for 48h pass queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_48h_pass
  ON subscriptions(is48HPass, currentPeriodEnd)
  WHERE is48HPass = TRUE;

-- Add comments for documentation
COMMENT ON COLUMN users.trial_used IS 'Tracks if user has used their one-time free trial (100-200 participants)';
COMMENT ON COLUMN users.bonus_granted IS 'Tracks if user received 3-credit welcome bonus';
COMMENT ON COLUMN subscriptions.planType IS 'Subscription plan type: monthly, annual, enterprise, pass_48h';
COMMENT ON COLUMN subscriptions.is48HPass IS 'Flag for 48-hour temporary passes (unlimited draws for 48h)';

-- Verify migration
SELECT
  'Users with trial available' as description,
  COUNT(*) as count
FROM users
WHERE trial_used = FALSE AND credits = 0;

SELECT
  'Active 48h passes' as description,
  COUNT(*) as count
FROM subscriptions
WHERE is48HPass = TRUE
  AND status = 'ACTIVE'
  AND currentPeriodEnd > NOW();
