import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Database } from '../../database/connection.js';

export const backupRouter = Router();

// Export user state snapshot
backupRouter.get('/export', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const state = Database.exportState(userId);
    res.json({
      success: true,
      exported_at: new Date().toISOString(),
      user_id: userId,
      engine: Database.getEngineName(),
      data: state
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Import state snapshot
backupRouter.post('/import', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Valid state data object required' });
      return;
    }

    Database.importState(data);
    res.json({
      success: true,
      message: 'State snapshot imported successfully',
      tables_restored: Object.keys(data)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Database status & metrics
backupRouter.get('/status', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRow = await Database.queryOneAsync<{ count: string | number }>('SELECT COUNT(*) as count FROM users');
    const jobRow = await Database.queryOneAsync<{ count: string | number }>('SELECT COUNT(*) as count FROM jobs');
    const appRow = await Database.queryOneAsync<{ count: string | number }>('SELECT COUNT(*) as count FROM applications');

    const userCount = Number(userRow?.count || 0);
    const jobCount = Number(jobRow?.count || 0);
    const appCount = Number(appRow?.count || 0);

    res.json({
      success: true,
      engine: Database.getEngineName(),
      is_postgres: Database.isPostgres(),
      metrics: {
        total_users: userCount,
        total_jobs: jobCount,
        total_applications: appCount
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
