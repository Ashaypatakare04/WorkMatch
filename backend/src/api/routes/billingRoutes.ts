/**
 * ============================================================================
 * WORKMATCH SAAS BILLING & MONETIZATION ROUTES
 * ============================================================================
 *
 * Exposes endpoints for tiered subscriptions, monthly usage audits, plan upgrades,
 * and Stripe / LemonSqueezy webhook processing.
 */

import { Router, Response, Request } from 'express';
import { AuthenticatedRequest, authMiddleware } from '../middleware/auth.js';
import { SubscriptionService, PlanType } from '../../services/SubscriptionService.js';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';

export const billingRouter = Router();

// 1. Get available subscription plans and limits (Public)
billingRouter.get('/plans', (_req: Request, res: Response): void => {
  try {
    const plans = SubscriptionService.getAllPlans();
    res.json({ success: true, plans });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get current user's usage and quota details (Protected)
billingRouter.get('/usage', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const usage = SubscriptionService.getUserUsage(userId);
    res.json({ success: true, usage });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const upgradeSchema = z.object({
  planType: z.enum(['personal', 'pro', 'team']),
  provider: z.enum(['stripe', 'lemonsqueezy', 'mock']).optional().default('stripe')
});

// 3. Upgrade user plan (Protected - Sandbox / checkout flow)
billingRouter.post(
  '/upgrade',
  authMiddleware,
  validateBody(upgradeSchema),
  (req: AuthenticatedRequest, res: Response): void => {
    try {
      const userId = req.user?.userId || 'user_default';
      const { planType, provider } = req.body;

      if (planType === 'personal') {
        SubscriptionService.cancelSubscription(userId);
      } else {
        SubscriptionService.recordSubscription({
          userId,
          provider: provider || 'stripe',
          subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          customerId: `cus_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          planType: planType as PlanType,
          status: 'active'
        });
      }

      const updatedUsage = SubscriptionService.getUserUsage(userId);
      res.json({
        success: true,
        message: `Plan successfully updated to ${planType}`,
        usage: updatedUsage
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// 4. Cancel active subscription (Protected)
billingRouter.post('/cancel', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    SubscriptionService.cancelSubscription(userId);
    const updatedUsage = SubscriptionService.getUserUsage(userId);
    res.json({
      success: true,
      message: 'Subscription cancelled. Account reverted to Personal Free tier.',
      usage: updatedUsage
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Inbound Webhook Handler for Stripe & LemonSqueezy
billingRouter.post('/webhook', (req: Request, res: Response): void => {
  try {
    const stripeSignature = req.headers['stripe-signature'];
    const lemonSignature = req.headers['x-signature'];

    let provider: 'stripe' | 'lemonsqueezy' = 'stripe';
    if (lemonSignature || req.body?.meta?.event_name) {
      provider = 'lemonsqueezy';
    }

    const result = SubscriptionService.processWebhook(provider, req.body);
    res.json({ success: true, processed: result.processed, action: result.action });
  } catch (err: any) {
    console.error('[BillingWebhook] Webhook processing error:', err.message);
    res.status(400).json({ error: 'Webhook processing failed', details: err.message });
  }
});
