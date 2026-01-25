#!/usr/bin/env ts-node
/**
 * Email Service Test Script
 * Tests verification, welcome, and password reset emails
 *
 * Usage: npx ts-node scripts/test-email.ts <email>
 */

import { emailService } from '../src/services/email.service';
import { logger } from '../src/utils/logger';

const testEmail = process.argv[2] || 'test@example.com';

async function testEmailService() {
  console.log('\n🧪 Testing Email Service\n');
  console.log(`📧 Test email: ${testEmail}\n`);

  try {
    // Test 1: Verification Email
    console.log('1️⃣  Testing verification email...');
    const verificationToken = 'test-token-' + Math.random().toString(36).substring(7);
    await emailService.sendVerificationEmail(testEmail, verificationToken);
    console.log('✅ Verification email sent successfully!\n');

    // Test 2: Welcome Email
    console.log('2️⃣  Testing welcome email...');
    await emailService.sendWelcomeEmail(testEmail, 'Test User');
    console.log('✅ Welcome email sent successfully!\n');

    // Test 3: Password Reset Email
    console.log('3️⃣  Testing password reset email...');
    const resetToken = 'reset-token-' + Math.random().toString(36).substring(7);
    await emailService.sendPasswordResetEmail(testEmail, resetToken);
    console.log('✅ Password reset email sent successfully!\n');

    console.log('🎉 All email tests passed!\n');
    console.log(`📬 Check ${testEmail} inbox for 3 emails\n`);
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Email test failed:');
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Response: ${error.response}`);
    }
    console.error('\n💡 Possible issues:');
    console.error('   1. IP address not whitelisted in Brevo');
    console.error('   2. Invalid Brevo API key');
    console.error('   3. Sender email not verified in Brevo');
    console.error('   4. Brevo account not active\n');
    process.exit(1);
  }
}

testEmailService();
