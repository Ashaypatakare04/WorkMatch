import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { NotificationRepository } from '../../repositories/NotificationRepository.js';

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
