/**
 * ============================================================================
 * WORKMATCH SAAS SUBSCRIPTION & USAGE QUOTA SERVICE
 * ============================================================================
 *
 * Manages tiered SaaS monetization, usage quotas, Stripe/LemonSqueezy webhooks,
 * and monthly proposal generation allowances.
 *
 * Tiers:
 * 1. PERSONAL (Free): 10 AI proposals/month, 5 syncs/day, Assisted Copilot only.
 * 2. PRO ($29/mo): 150 AI proposals/month, unlimited syncs, Autonomous automation allowed.
 * 3. TEAM ($79/mo): 1,000 AI proposals/month, multi-seat agency features, priority matching.
 */

import { Database } from '../database/connection.js';
import { PlanType } from '../models/User.js';

export type { PlanType };

export interface PlanLimits {
  name: string;
  planType: PlanType;
  priceMonthly: number;
  monthlyProposalsLimit: number;
  dailySyncsLimit: number;
  allowAutomaticSubmissions: boolean;
  priorityMatching: boolean;
  features: string[];
}

export const PLAN_CONFIGS: Record<PlanType, PlanLimits> = {
  personal: {
    name: 'Personal Free',
    planType: 'personal',
    priceMonthly: 0,
    monthlyProposalsLimit: 10,
    dailySyncsLimit: 5,
    allowAutomaticSubmissions: false,
    priorityMatching: false,
    features: [
      'Up to 10 AI proposal drafts / month',
      '5 Daily platform feed syncs',
      'Assisted Copilot & manual mode',
      'Strict claim verification & scam risk detector'
    ]
  },
  pro: {
    name: 'Pro Freelancer',
    planType: 'pro',
    priceMonthly: 29,
    monthlyProposalsLimit: 150,
    dailySyncsLimit: 100,
    allowAutomaticSubmissions: true,
    priorityMatching: true,
    features: [
      '150 AI proposal generations / month',
      'Unlimited real-time platform ingestion',
      'Full Autonomous & Assisted submission modes',
      'Instant real-time token streaming',
      'Priority client scoring & scam detection'
    ]
  },
  team: {
    name: 'Agency & Team',
    planType: 'team',
    priceMonthly: 79,
    monthlyProposalsLimit: 1000,
    dailySyncsLimit: 500,
    allowAutomaticSubmissions: true,
    priorityMatching: true,
    features: [
      '1,000 AI proposal generations / month',
      'High-throughput multi-platform ingestion',
      'Team workspace & shared pipeline',
      'Webhook & API integrations',
      'Dedicated support & custom scoring models'
    ]
  }
};

export interface UserUsageReport {
  userId: string;
  plan: PlanLimits;
  proposalsUsedThisMonth: number;
  proposalsRemaining: number;
  proposalsLimit: number;
  canGenerateProposal: boolean;
  subscription?: {
    id: string;
    provider: string;
    status: string;
    currentPeriodEnd?: string;
  } | null;
}

export class SubscriptionService {
  /**
   * Returns plan definition limits.
   */
  public static getPlan(planType: PlanType): PlanLimits {
    return PLAN_CONFIGS[planType] || PLAN_CONFIGS.personal;
  }

  /**
   * Returns list of all available tiers for marketing & upgrade screens.
   */
  public static getAllPlans(): PlanLimits[] {
    return Object.values(PLAN_CONFIGS);
  }

  /**
   * Calculates the user's monthly proposal usage and quota remaining.
   */
  public static getUserUsage(userId: string): UserUsageReport {
    // 1. Get user plan
    const userRow = Database.queryOne<{ plan_type: PlanType }>('SELECT plan_type FROM users WHERE id = ?', [userId]);
    const planType: PlanType = (userRow?.plan_type as PlanType) || 'personal';
    const plan = this.getPlan(planType);

    // 2. Count proposals generated in the current calendar month (UTC)
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString();

    const usageRow = Database.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM proposals WHERE user_id = ? AND created_at >= ?',
      [userId, startOfMonth]
    );
    const proposalsUsedThisMonth = Number(usageRow?.count || 0);
    const proposalsRemaining = Math.max(0, plan.monthlyProposalsLimit - proposalsUsedThisMonth);
    const canGenerateProposal = proposalsUsedThisMonth < plan.monthlyProposalsLimit;

    // 3. Get active subscription record if any
    let subscription = null;
    try {
      const subRow = Database.queryOne<any>(
        'SELECT id, provider, status, current_period_end FROM subscriptions WHERE user_id = ?',
        [userId]
      );
      if (subRow) {
        subscription = {
          id: subRow.id,
          provider: subRow.provider,
          status: subRow.status,
          currentPeriodEnd: subRow.current_period_end
        };
      }
    } catch {
      // Table might be initializing
    }

    return {
      userId,
      plan,
      proposalsUsedThisMonth,
      proposalsRemaining,
      proposalsLimit: plan.monthlyProposalsLimit,
      canGenerateProposal,
      subscription
    };
  }

  /**
   * Checks if user has quota available to generate proposals.
   * Returns allowed status or error info.
   */
  public static checkProposalQuota(userId: string): {
    allowed: boolean;
    remaining: number;
    limit: number;
    currentUsage: number;
    planType: PlanType;
  } {
    const usage = this.getUserUsage(userId);
    return {
      allowed: usage.canGenerateProposal,
      remaining: usage.proposalsRemaining,
      limit: usage.proposalsLimit,
      currentUsage: usage.proposalsUsedThisMonth,
      planType: usage.plan.planType
    };
  }

  /**
   * Upserts a subscription record and updates the user's plan_type.
   */
  public static recordSubscription(data: {
    userId: string;
    provider: 'stripe' | 'lemonsqueezy' | 'mock';
    subscriptionId: string;
    customerId: string;
    planType: PlanType;
    status: 'active' | 'trialing' | 'past_due' | 'canceled';
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  }): void {
    const now = new Date().toISOString();
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Remove any previous subscription for this user to prevent orphaned records
    Database.execute('DELETE FROM subscriptions WHERE user_id = ?', [data.userId]);

    // Upsert subscription
    Database.execute(
      `INSERT INTO subscriptions (
        id, user_id, provider, subscription_id, customer_id, plan_type, status,
        current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        subId,
        data.userId,
        data.provider,
        data.subscriptionId,
        data.customerId,
        data.planType,
        data.status,
        data.currentPeriodStart || now,
        data.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        now,
        now
      ]
    );

    // Update user plan_type
    Database.execute(
      'UPDATE users SET plan_type = ?, updated_at = ? WHERE id = ?',
      [data.planType, now, data.userId]
    );
  }

  /**
   * Cancels a subscription and downgrades the user to the personal free tier.
   */
  public static cancelSubscription(userId: string): void {
    const now = new Date().toISOString();
    Database.execute(
      `UPDATE subscriptions SET status = 'canceled', updated_at = ? WHERE user_id = ?`,
      [now, userId]
    );
    Database.execute(
      `UPDATE users SET plan_type = 'personal', updated_at = ? WHERE id = ?`,
      [now, userId]
    );
  }

  /**
   * Webhook event processor for Stripe and LemonSqueezy.
   */
  public static processWebhook(provider: 'stripe' | 'lemonsqueezy', event: any): { processed: boolean; action: string } {
    if (provider === 'stripe') {
      const type = event.type;
      const object = event.data?.object;

      if (type === 'checkout.session.completed') {
        const userId = object.client_reference_id || object.metadata?.userId;
        const planType: PlanType = (object.metadata?.planType as PlanType) || 'pro';
        if (userId) {
          this.recordSubscription({
            userId,
            provider: 'stripe',
            subscriptionId: object.subscription || `sub_stripe_${Date.now()}`,
            customerId: object.customer || `cus_${Date.now()}`,
            planType,
            status: 'active'
          });
          return { processed: true, action: `Upgraded user ${userId} to ${planType}` };
        }
      } else if (type === 'customer.subscription.deleted') {
        const customerId = object.customer;
        const subscriptionId = object.id;
        const sub = Database.queryOne<{ user_id: string }>(
          'SELECT user_id FROM subscriptions WHERE customer_id = ? OR subscription_id = ? ORDER BY updated_at DESC',
          [customerId, subscriptionId]
        );
        if (sub) {
          this.cancelSubscription(sub.user_id);
          return { processed: true, action: `Downgraded user ${sub.user_id} to personal` };
        }
      }
    } else if (provider === 'lemonsqueezy') {
      const eventName = event.meta?.event_name;
      const customData = event.meta?.custom_data;
      const userId = customData?.user_id;

      if (eventName === 'subscription_created' && userId) {
        const planType: PlanType = (customData?.plan_type as PlanType) || 'pro';
        this.recordSubscription({
          userId,
          provider: 'lemonsqueezy',
          subscriptionId: String(event.data?.id || `ls_${Date.now()}`),
          customerId: String(event.data?.attributes?.customer_id || `ls_cus_${Date.now()}`),
          planType,
          status: 'active'
        });
        return { processed: true, action: `LemonSqueezy upgraded user ${userId} to ${planType}` };
      } else if (eventName === 'subscription_cancelled' && userId) {
        this.cancelSubscription(userId);
        return { processed: true, action: `LemonSqueezy cancelled subscription for user ${userId}` };
      }
    }

    return { processed: false, action: 'Event ignored' };
  }
}
