import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { PersonalizationEngine } from '../../ai/personalization/PersonalizationEngine.js';

export const profileRouter = Router();

// Get full user capability profile
profileRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const profile = UserRepository.getProfile(userId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update core profile
profileRouter.put('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    UserRepository.updateProfile(userId, req.body);
    const updated = UserRepository.getProfile(userId);
    res.json({ success: true, profile: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update skills
profileRouter.put('/skills', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      res.status(400).json({ error: 'skills must be an array' });
      return;
    }
    UserRepository.setSkills(userId, skills);
    const updated = UserRepository.getProfile(userId);
    res.json({ success: true, skills: updated?.skills || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update preferences & weights
profileRouter.put('/preferences', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    UserRepository.updatePreferences(userId, req.body);
    const updated = UserRepository.getProfile(userId);
    res.json({ success: true, preferences: updated?.preferences });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get transparent learned insights
profileRouter.get('/learned', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const insights = PersonalizationEngine.getLearnedInsights(userId);
    res.json({ success: true, learned: insights });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Refresh learned insights from feedback history
profileRouter.post('/learned/refresh', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const insights = PersonalizationEngine.refreshInsights(userId);
    res.json({ success: true, learned: insights });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
