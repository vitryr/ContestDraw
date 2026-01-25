/**
 * Subscription Management Service
 * Handles subscription status checks, grace periods, limits, and credit allocation
 */

import { v4 as uuidv4 } from 'uuid';
import {
  SubscriptionStatus,
  SubscriptionPlan,
  Subscription
} from '../types/payment.types';

export class SubscriptionService {
  constructor(
    private db: any,
    private paymentService: any,
    private emailService: any
  ) {}

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    return subscription !== null;
  }

  /**
   * Get user's active subscription
   */
  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    const subscription = await this.db.subscription.findFirst({
      where: {
        userId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING, SubscriptionStatus.GRACE_PERIOD]
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return subscription;
  }

  /**
   * Check subscription status and enforce limits
   */
  async checkSubscriptionStatus(userId: string): Promise<{
    hasSubscription: boolean;
    status: SubscriptionStatus | null;
    plan: SubscriptionPlan | null;
    daysRemaining: number;
    connectedAccountsLimit: number;
    creditsPerMonth: number;
  }> {
    const subscription = await this.getActiveSubscription(userId);

    if (!subscription) {
      return {
        hasSubscription: false,
        status: null,
        plan: null,
        daysRemaining: 0,
        connectedAccountsLimit: 0,
        creditsPerMonth: 0
      };
    }

    const now = new Date();
    const endDate = new Date(subscription.currentPeriodEnd);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      hasSubscription: true,
      status: subscription.status,
      plan: subscription.plan,
      daysRemaining,
      connectedAccountsLimit: subscription.connectedAccountsLimit || 0,
      creditsPerMonth: subscription.creditsPerMonth || 0
    };
  }

  /**
   * Check if user can connect more accounts
   */
  async canConnectAccount(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);

    if (!subscription) {
      // Free users can connect 1 account
      const connectedAccounts = await this.db.connectedAccount.count({
        where: { userId }
      });
      return connectedAccounts < 1;
    }

    const connectedAccounts = await this.db.connectedAccount.count({
      where: { userId }
    });

    return connectedAccounts < (subscription.connectedAccountsLimit || 0);
  }

  /**
   * Get connected accounts limit for user
   */
  async getConnectedAccountsLimit(userId: string): Promise<number> {
    const subscription = await this.getActiveSubscription(userId);
    return subscription?.connectedAccountsLimit || 1; // Free users get 1
  }

  /**
   * Process monthly credit allocation for active subscriptions
   * Should be run via cron job on subscription renewal
   */
  async allocateMonthlyCredits(subscriptionId: string): Promise<void> {
    const subscription = await this.db.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      console.log(`[Subscription] Skipping credit allocation for inactive subscription ${subscriptionId}`);
      return;
    }

    const credits = subscription.creditsPerMonth || 0;
    if (credits > 0) {
      await this.paymentService.addCredits(
        subscription.userId,
        credits,
        'Monthly subscription credits',
        { subscriptionId, period: new Date().toISOString() }
      );

      console.log(`[Subscription] Allocated ${credits} credits to user ${subscription.userId}`);
    }
  }

  /**
   * Process grace period for past due subscriptions
   */
  async processGracePeriods(): Promise<void> {
    const now = new Date();
    const gracePeriodDays = 3;

    // Find subscriptions that recently expired
    const pastDueSubscriptions = await this.db.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: {
          lt: now
        }
      }
    });

    for (const subscription of pastDueSubscriptions) {
      const gracePeriodEnd = new Date(subscription.currentPeriodEnd);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

      if (now < gracePeriodEnd) {
        // Enter grace period
        await this.db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.GRACE_PERIOD,
            updatedAt: new Date()
          }
        });

        await this.emailService.sendSubscriptionGracePeriod(
          subscription.userId,
          subscription
        );

        console.log(`[Subscription] Subscription ${subscription.id} entered grace period`);
      } else {
        // Grace period expired
        await this.db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.EXPIRED,
            updatedAt: new Date()
          }
        });

        await this.emailService.sendSubscriptionExpired(
          subscription.userId,
          subscription
        );

        console.log(`[Subscription] Subscription ${subscription.id} expired`);
      }
    }
  }

  /**
   * Handle failed subscription payment
   */
  async handleFailedPayment(subscriptionId: string, reason: string): Promise<void> {
    const subscription = await this.db.subscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await this.db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.PAST_DUE,
        metadata: {
          ...subscription.metadata,
          lastPaymentFailure: {
            date: new Date().toISOString(),
            reason
          }
        },
        updatedAt: new Date()
      }
    });

    await this.emailService.sendPaymentFailed(subscription.userId, { reason });

    console.log(`[Subscription] Payment failed for subscription ${subscriptionId}: ${reason}`);
  }

  /**
   * Get subscription analytics for user
   */
  async getSubscriptionAnalytics(userId: string): Promise<{
    totalSpent: number;
    totalCreditsReceived: number;
    subscriptionDuration: number; // days
    averageCreditsPerMonth: number;
  }> {
    const transactions = await this.db.transaction.findMany({
      where: {
        userId,
        type: {
          in: ['SUBSCRIPTION_CHARGE', 'SUBSCRIPTION_RENEWAL']
        },
        status: 'COMPLETED'
      }
    });

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalCreditsReceived = transactions.reduce((sum, tx) => sum + tx.credits, 0);

    const firstSubscription = await this.db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });

    const subscriptionDuration = firstSubscription
      ? Math.ceil((Date.now() - firstSubscription.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const monthsActive = subscriptionDuration / 30;
    const averageCreditsPerMonth = monthsActive > 0 ? totalCreditsReceived / monthsActive : 0;

    return {
      totalSpent,
      totalCreditsReceived,
      subscriptionDuration,
      averageCreditsPerMonth: Math.round(averageCreditsPerMonth)
    };
  }

  /**
   * Check if user should receive renewal reminder
   */
  async checkRenewalReminders(): Promise<void> {
    const reminderDays = [7, 3, 1]; // Send reminders 7, 3, and 1 day before renewal
    const now = new Date();

    for (const days of reminderDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const subscriptions = await this.db.subscription.findMany({
        where: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: {
            gte: targetDate,
            lt: nextDay
          },
          cancelAtPeriodEnd: false
        }
      });

      for (const subscription of subscriptions) {
        // Check if reminder already sent
        const reminderSent = subscription.metadata?.remindersSent?.includes(`${days}days`);

        if (!reminderSent) {
          await this.emailService.sendSubscriptionRenewalReminder(
            subscription.userId,
            subscription,
            days
          );

          // Mark reminder as sent
          await this.db.subscription.update({
            where: { id: subscription.id },
            data: {
              metadata: {
                ...subscription.metadata,
                remindersSent: [
                  ...(subscription.metadata?.remindersSent || []),
                  `${days}days`
                ]
              }
            }
          });

          console.log(`[Subscription] Sent ${days}-day renewal reminder for subscription ${subscription.id}`);
        }
      }
    }
  }

  /**
   * Get subscription features for a plan
   */
  getSubscriptionFeatures(plan: SubscriptionPlan): {
    creditsPerMonth: number;
    connectedAccounts: number;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    unlimitedDraws?: boolean;
    duration?: string;
  } {
    const features = {
      [SubscriptionPlan.MONTHLY]: {
        creditsPerMonth: 10,
        connectedAccounts: 3,
        prioritySupport: false,
        advancedAnalytics: true,
        apiAccess: false
      },
      [SubscriptionPlan.ANNUAL]: {
        creditsPerMonth: 120,
        connectedAccounts: 5,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true
      },
      [SubscriptionPlan.ENTERPRISE]: {
        creditsPerMonth: 30,
        connectedAccounts: 10,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whiteLabelBranding: true,
        maxSubAccounts: 10
      },
      [SubscriptionPlan.PASS_48H]: {
        creditsPerMonth: 0,
        connectedAccounts: 1,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        unlimitedDraws: true,
        duration: '48 hours'
      }
    };

    return features[plan];
  }

  /**
   * Check if user has active 48h pass
   */
  async hasActive48HPass(userId: string): Promise<boolean> {
    const subscription = await this.db.subscription.findFirst({
      where: {
        userId,
        plan: SubscriptionPlan.PASS_48H,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]
        },
        currentPeriodEnd: {
          gte: new Date()
        }
      }
    });

    return subscription !== null;
  }

  /**
   * Process expired 48h passes
   * Should be run via cron job every hour
   */
  async processExpired48HPasses(): Promise<void> {
    const now = new Date();

    const expiredPasses = await this.db.subscription.findMany({
      where: {
        plan: SubscriptionPlan.PASS_48H,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING]
        },
        currentPeriodEnd: {
          lt: now
        }
      }
    });

    for (const pass of expiredPasses) {
      await this.db.subscription.update({
        where: { id: pass.id },
        data: {
          status: SubscriptionStatus.EXPIRED,
          updatedAt: new Date()
        }
      });

      await this.emailService.send48HPassExpired(pass.userId, pass);

      console.log(`[Subscription] 48h pass ${pass.id} expired for user ${pass.userId}`);
    }
  }

  /**
   * Check if subscription allows unlimited draws (48h pass)
   */
  async allowsUnlimitedDraws(userId: string): Promise<boolean> {
    return await this.hasActive48HPass(userId);
  }

  /**
   * Create enterprise subscription for organization
   */
  async createEnterpriseSubscription(
    organizationId: string,
    ownerId: string,
    stripeSubscriptionId?: string
  ): Promise<Subscription> {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return this.db.subscription.create({
      data: {
        userId: ownerId,
        organizationId,
        planId: SubscriptionPlan.ENTERPRISE,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        monthlyCredits: 30,
        stripeSubscriptionId,
        metadata: {
          tier: 'enterprise',
          features: this.getSubscriptionFeatures(SubscriptionPlan.ENTERPRISE)
        }
      }
    });
  }

  /**
   * Get pricing for enterprise tier
   */
  getEnterprisePricing(): {
    monthly: number;
    currency: string;
    features: string[];
  } {
    return {
      monthly: 49, // €49/month
      currency: 'EUR',
      features: [
        'Up to 10 sub-accounts',
        'Multi-brand management',
        'White-label customization',
        'Custom domain',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Centralized billing',
        'Custom branding removal'
      ]
    };
  }
}
