import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AutomationRepository } from '../../repositories/AutomationRepository.js';
import { Database } from '../../database/connection.js';

export const automationRouter = Router();

// Get settings
automationRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const settings = AutomationRepository.getSettings(userId);
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings
automationRouter.put('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const updated = AutomationRepository.updateSettings(userId, req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Global Emergency Kill Switch
automationRouter.post('/stop', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    AutomationRepository.triggerEmergencyStop(userId);
    const updated = AutomationRepository.getSettings(userId);
    res.json({
      success: true,
      message: 'EMERGENCY STOP ENGAGED: Automated submissions immediately halted. Application mode set to MANUAL.',
      settings: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get safety audit logs
automationRouter.get('/audit', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const logs = Database.query<any>(
      'SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json({
      success: true,
      logs: logs.map(l => ({
        ...l,
        details: JSON.parse(l.details || '{}')
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
