import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in correct order to avoid FK constraints)
  await prisma.winner.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.brandDraw.deleteMany();
  await prisma.draw.deleteMany();
  await prisma.blacklist.deleteMany();
  await prisma.brandSocialAccount.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.branding.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.followerVerification.deleteMany();
  await prisma.storyMention.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create test users with hashed passwords
  const hashedPassword = await bcrypt.hash('TestPassword123!', 10);

  const testUser = await prisma.user.create({
    data: {
      email: 'test@contestdraw.local',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      credits: 10,
      trial_used: false,
      bonus_granted: true,
      emailVerified: true,
      role: 'user',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@contestdraw.local',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      credits: 100,
      trial_used: false,
      bonus_granted: true,
      emailVerified: true,
      role: 'admin',
    },
  });

  const premiumUser = await prisma.user.create({
    data: {
      email: 'premium@contestdraw.local',
      password: hashedPassword,
      firstName: 'Premium',
      lastName: 'User',
      credits: 50,
      trial_used: false,
      bonus_granted: true,
      emailVerified: true,
      role: 'user',
    },
  });

  console.log('✅ Created test users:');
  console.log(`   - ${testUser.email} (${testUser.credits} credits)`);
  console.log(`   - ${adminUser.email} (${adminUser.credits} credits)`);
  console.log(`   - ${premiumUser.email} (${premiumUser.credits} credits)`);

  // Create credit transactions
  await prisma.creditTransaction.create({
    data: {
      userId: testUser.id,
      type: 'PURCHASE',
      credits: 10,
      amount: 9.99,
      currency: 'USD',
      description: 'Welcome bonus package',
      metadata: { reason: 'new_user_bonus' },
    },
  });

  await prisma.creditTransaction.create({
    data: {
      userId: adminUser.id,
      type: 'PURCHASE',
      credits: 100,
      amount: 99.99,
      currency: 'USD',
      description: 'Admin package',
      metadata: { package: 'admin' },
    },
  });

  await prisma.creditTransaction.create({
    data: {
      userId: premiumUser.id,
      type: 'SUBSCRIPTION',
      credits: 50,
      amount: 14.99,
      currency: 'USD',
      description: 'Monthly subscription credits',
      metadata: { plan: 'monthly' },
    },
  });

  console.log('✅ Created credit transactions');

  // Create social media connections
  await prisma.socialAccount.create({
    data: {
      userId: testUser.id,
      platform: 'instagram',
      platformUserId: 'ig_test_123',
      platformUsername: 'test_user_ig',
      accessToken: 'mock_access_token_001',
    },
  });

  await prisma.socialAccount.create({
    data: {
      userId: premiumUser.id,
      platform: 'facebook',
      platformUserId: 'fb_premium_456',
      platformUsername: 'premium_user_fb',
      accessToken: 'mock_access_token_002',
    },
  });

  console.log('✅ Created social account connections');

  // Create subscription for premium user
  await prisma.subscription.create({
    data: {
      userId: premiumUser.id,
      planId: 'plan_monthly_001',
      planType: 'monthly',
      status: 'ACTIVE',
      stripeSubscriptionId: 'sub_test_monthly_001',
      monthlyCredits: 50,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  console.log('✅ Created subscription');

  // Create sample draw with winners
  const draw = await prisma.draw.create({
    data: {
      userId: testUser.id,
      title: 'Instagram Giveaway - December 2024',
      description: 'Win amazing prizes!',
      numberOfWinners: 3,
      status: 'COMPLETED',
      algorithm: 'PROVABLY_FAIR',
      seed: 'test_seed_123',
      certificateHash: 'sha256:abc123def456',
      completedAt: new Date(),
    },
  });

  // Create participants
  const participant1 = await prisma.participant.create({
    data: {
      drawId: draw.id,
      name: 'Winner One',
      identifier: '@winner_one',
      source: 'instagram',
      metadata: { comment: 'Great giveaway!' },
    },
  });

  const participant2 = await prisma.participant.create({
    data: {
      drawId: draw.id,
      name: 'Winner Two',
      identifier: '@winner_two',
      source: 'instagram',
      metadata: { comment: 'Hope I win!' },
    },
  });

  const participant3 = await prisma.participant.create({
    data: {
      drawId: draw.id,
      name: 'Winner Three',
      identifier: '@winner_three',
      source: 'instagram',
      metadata: { comment: 'Good luck everyone!' },
    },
  });

  // Create winners
  await prisma.winner.create({
    data: {
      drawId: draw.id,
      participantId: participant1.id,
      position: 1,
    },
  });

  await prisma.winner.create({
    data: {
      drawId: draw.id,
      participantId: participant2.id,
      position: 2,
    },
  });

  await prisma.winner.create({
    data: {
      drawId: draw.id,
      participantId: participant3.id,
      position: 3,
    },
  });

  console.log('✅ Created sample draw with winners');

  // Create organization for enterprise features
  const org = await prisma.organization.create({
    data: {
      name: 'Test Agency',
      ownerId: premiumUser.id,
      subscriptionTier: 'enterprise',
      slug: 'test-agency',
      billingEmail: premiumUser.email,
      settings: {
        allowBranding: true,
        maxBrands: 10,
        maxMembers: 50,
      },
    },
  });

  await prisma.organizationMember.create({
    data: {
      organizationId: org.id,
      userId: premiumUser.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Created test organization');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Credit Transactions: ${await prisma.creditTransaction.count()}`);
  console.log(`   Subscriptions: ${await prisma.subscription.count()}`);
  console.log(`   Social Accounts: ${await prisma.socialAccount.count()}`);
  console.log(`   Draws: ${await prisma.draw.count()}`);
  console.log(`   Participants: ${await prisma.participant.count()}`);
  console.log(`   Winners: ${await prisma.winner.count()}`);
  console.log(`   Organizations: ${await prisma.organization.count()}`);

  console.log('\n🔑 Test Credentials (Password: TestPassword123!):');
  console.log('   • test@contestdraw.local    - User with 10 credits');
  console.log('   • admin@contestdraw.local   - Admin with 100 credits');
  console.log('   • premium@contestdraw.local - User with 50 credits + monthly subscription');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
