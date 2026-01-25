import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { emailService } from '../services/email.service';

/**
 * Test script to verify Brevo email service is working
 * Usage: npx ts-node src/scripts/test-email.ts <your-email@example.com>
 */
async function testEmailService() {
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error('❌ Please provide a test email address as argument');
    console.error('Usage: npx ts-node src/scripts/test-email.ts <your-email@example.com>');
    process.exit(1);
  }

  console.log('\n🧪 Testing Brevo Email Service...\n');
  console.log(`📧 Test email will be sent to: ${testEmail}`);
  console.log(`🔑 Using Brevo API key: ${process.env.BREVO_API_KEY?.substring(0, 20)}...`);
  console.log('');

  try {
    // Test 1: Verification Email
    console.log('📬 Test 1: Sending verification email...');
    await emailService.sendVerificationEmail(testEmail, 'test-token-12345');
    console.log('✅ Verification email sent successfully!');
    console.log('');

    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Welcome Email
    console.log('📬 Test 2: Sending welcome email...');
    await emailService.sendWelcomeEmail(testEmail, 'Test User');
    console.log('✅ Welcome email sent successfully!');
    console.log('');

    // Wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Password Reset Email
    console.log('📬 Test 3: Sending password reset email...');
    await emailService.sendPasswordResetEmail(testEmail, 'reset-token-67890');
    console.log('✅ Password reset email sent successfully!');
    console.log('');

    console.log('🎉 All email tests passed!');
    console.log(`📫 Check your inbox at ${testEmail} to verify the emails were received.`);
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Email test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response:', error.response.text || error.response.body);
    }
    process.exit(1);
  }
}

// Run the test
testEmailService();
