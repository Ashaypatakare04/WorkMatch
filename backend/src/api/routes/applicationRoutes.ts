import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ApplicationRepository } from '../../repositories/ApplicationRepository.js';
import { ConnectorRegistry } from '../../connectors/base/ConnectorRegistry.js';
import { JobRepository } from '../../repositories/JobRepository.js';

export const applicationsRouter = Router();

// List applications
applicationsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const applications = ApplicationRepository.listByUser(userId);
    res.json({ success: true, applications });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single application details
applicationsRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const app = ApplicationRepository.getById(req.params.id);
    if (!app) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    res.json({ success: true, application: app });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create application / manual apply
applicationsRouter.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { job_id, proposal_id, mode, connect_cost, notes } = req.body;

    if (!job_id) {
      res.status(400).json({ error: 'job_id is required' });
      return;
    }

    const job = JobRepository.findById(job_id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const application = ApplicationRepository.createOrUpdate({
      job_id,
      user_id: userId,
      proposal_id,
      status: 'applied',
      mode: mode || 'manual',
      connect_cost: connect_cost || 4,
      notes: notes || 'Submitted by user'
    });

    res.json({ success: true, application });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update application status (Kanban drag & drop or manual status update)
applicationsRouter.post('/:id/status', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { status, notes, outcome } = req.body;
    const existing = ApplicationRepository.getById(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    const updated = ApplicationRepository.createOrUpdate({
      job_id: existing.job_id,
      user_id: userId,
      proposal_id: existing.proposal_id,
      status: status || existing.status,
      mode: existing.mode,
      connect_cost: existing.connect_cost,
      notes: notes !== undefined ? notes : existing.notes,
      outcome: outcome || existing.outcome
    });

    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
