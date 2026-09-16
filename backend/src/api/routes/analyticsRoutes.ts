import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AnalyticsRepository } from '../../repositories/AnalyticsRepository.js';

export const analyticsRouter = Router();

// Analytics summary
analyticsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const summary = AnalyticsRepository.getAnalyticsSummary(userId);
    res.json({ success: true, summary });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Periodic Bank-Statement Activity Report
analyticsRouter.get('/statement', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const range = (req.query.range as string) || '30d';
    const report = AnalyticsRepository.generateBankStatementReport(userId, range);
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export Statement to CSV
analyticsRouter.get('/statement/csv', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const range = (req.query.range as string) || '30d';
    const report = AnalyticsRepository.generateBankStatementReport(userId, range);

    let csv = 'Timestamp,Platform,Job Title,Action/Status,Score,Connect Cost\n';
    for (const evt of report.chronological_events) {
      const cleanTitle = `"${evt.job_title.replace(/"/g, '""')}"`;
      csv += `${evt.timestamp},${evt.platform},${cleanTitle},${evt.action},${evt.score},${evt.cost}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="workmatch-statement-${range}.csv"`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
