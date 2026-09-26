import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { NotificationRepository } from '../../repositories/NotificationRepository.js';
import { NotificationService } from '../../notifications/NotificationService.js';
import { NotificationChannel } from '../../models/Notification.js';

export const notificationRouter = Router();

// List notifications
notificationRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const notifications = NotificationRepository.listByUser(userId);
    res.json({ success: true, notifications });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
notificationRouter.post('/read', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { id } = req.body;
    NotificationRepository.markAsRead(userId, id);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get notification preferences
notificationRouter.get('/preferences', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const preferences = NotificationRepository.getPreferences(userId);
    res.json({ success: true, preferences });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification preferences
notificationRouter.put('/preferences', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const updated = NotificationRepository.updatePreferences(userId, req.body);
    res.json({ success: true, preferences: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Test dispatch to a specific notification channel
notificationRouter.post('/test', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { channel } = req.body as { channel: NotificationChannel };

    if (!channel || !['browser', 'email', 'telegram', 'discord'].includes(channel)) {
      res.status(400).json({ error: 'Valid channel required (browser, email, telegram, discord)' });
      return;
    }

    const result = await NotificationService.sendTestAlert(userId, channel);
    res.json({
      success: true,
      channel,
      delivered: result.delivered,
      error: result.error
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get status of configured channels
notificationRouter.get('/channels', (req: AuthenticatedRequest, res: Response): void => {
  try {
    res.json({
      success: true,
      channels: {
        browser: {
          available: true,
          configured: true
        },
        email: {
          available: true,
          configured: Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_WEBHOOK_URL)
        },
        telegram: {
          available: true,
          configured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
        },
        discord: {
          available: true,
          configured: Boolean(process.env.DISCORD_WEBHOOK_URL)
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
