import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { JobRepository } from '../../repositories/JobRepository.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { JobAnalyzer } from '../../ai/analyzers/JobAnalyzer.js';
import { RiskScamSignalEngine } from '../../ai/risk/RiskScamSignalEngine.js';
import { MatchingEngine } from '../../ai/matching/MatchingEngine.js';
import { ProposalGenerator } from '../../ai/proposals/ProposalGenerator.js';
import { ApplicationRepository } from '../../repositories/ApplicationRepository.js';
import { BackgroundWorker } from '../../workers/BackgroundWorker.js';
import { SubscriptionService } from '../../services/SubscriptionService.js';

export const jobsRouter = Router();

// List jobs with comprehensive filtering and sorting
jobsRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const {
      platform,
      category,
      minScore,
      maxScore,
      difficulty,
      minBudget,
      maxBudget,
      riskLevel,
      status,
      query,
      sortBy,
      limit,
      offset
    } = req.query;

    const result = JobRepository.listJobs(userId, {
      platform: platform as string,
      category: category as string,
      minScore: minScore ? Number(minScore) : undefined,
      maxScore: maxScore ? Number(maxScore) : undefined,
      difficulty: difficulty as string,
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      riskLevel: riskLevel as string,
      status: (status as any) || 'active',
      query: query as string,
      sortBy: sortBy as any,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    });

    res.json({
      success: true,
      total: result.total,
      jobs: result.jobs
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single job details
jobsRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const job = JobRepository.findById(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const { jobs } = JobRepository.listJobs(userId, { limit: 1, query: job.title });
    const fullJob = jobs.find(j => j.id === job.id) || job;
    const proposals = ApplicationRepository.getProposalsForJob(userId, job.id);

    res.json({
      success: true,
      job: fullJob,
      proposals
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Save job
jobsRouter.post('/:id/save', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    JobRepository.setUserJobAction(userId, req.params.id, 'saved');
    res.json({ success: true, message: 'Job saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ignore job with reason
jobsRouter.post('/:id/ignore', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    const { reason } = req.body;
    JobRepository.setUserJobAction(userId, req.params.id, 'ignored', reason || 'Not interested');
    res.json({ success: true, message: 'Job ignored and feedback recorded' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Remove save/ignore
jobsRouter.delete('/:id/action', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const userId = req.user?.userId || 'user_default';
    JobRepository.removeUserJobAction(userId, req.params.id);
    res.json({ success: true, message: 'Job action removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger proposal generation with quota check
jobsRouter.post('/:id/proposal', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';

    // Verify monthly proposal quota
    const quota = SubscriptionService.checkProposalQuota(userId);
    if (!quota.allowed) {
      res.status(403).json({
        error: 'QUOTA_EXCEEDED',
        message: `Monthly proposal quota of ${quota.limit} reached on ${quota.planType} tier. Upgrade to Pro for 150 proposals/month.`,
        usage: quota
      });
      return;
    }

    const job = JobRepository.findById(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const profile = UserRepository.getProfile(userId);
    if (!profile) {
      res.status(400).json({ error: 'User capability profile not found' });
      return;
    }

    const proposals = await ProposalGenerator.generateVariants(job, profile);
    const savedProposals = proposals.map(p => ApplicationRepository.saveProposal(p));

    res.json({
      success: true,
      proposals: savedProposals,
      usage: SubscriptionService.getUserUsage(userId)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Real-time AI Proposal Generation via Server-Sent Events (SSE)
const handleProposalStream = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId || 'user_default';

  // Set standard SSE streaming headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const quota = SubscriptionService.checkProposalQuota(userId);
    if (!quota.allowed) {
      sendEvent('error', {
        error: 'QUOTA_EXCEEDED',
        message: `Monthly proposal quota of ${quota.limit} reached on ${quota.planType} tier. Upgrade to Pro for unlimited generation.`,
        usage: quota
      });
      res.end();
      return;
    }

    const job = JobRepository.findById(req.params.id);
    if (!job) {
      sendEvent('error', { error: 'Job not found' });
      res.end();
      return;
    }

    const profile = UserRepository.getProfile(userId);
    if (!profile) {
      sendEvent('error', { error: 'User capability profile not found' });
      res.end();
      return;
    }

    sendEvent('status', { stage: 'analyzing', message: 'Analyzing job scope and matching competencies...' });
    sendEvent('status', { stage: 'generating', message: 'Synthesizing tailored proposal variants...' });

    const proposals = await ProposalGenerator.generateVariants(job, profile);

    sendEvent('status', { stage: 'verifying', message: 'Running truthfulness and claims verification...' });

    const savedProposals = proposals.map(p => {
      const saved = ApplicationRepository.saveProposal(p);
      sendEvent('variant', { variant: saved });
      return saved;
    });

    sendEvent('complete', {
      proposals: savedProposals,
      usage: SubscriptionService.getUserUsage(userId)
    });
    res.end();
  } catch (err: any) {
    sendEvent('error', { error: err.message });
    res.end();
  }
};

jobsRouter.get('/:id/proposal/stream', handleProposalStream);
jobsRouter.post('/:id/proposal/stream', handleProposalStream);

// Trigger manual platform synchronization
jobsRouter.post('/sync', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';
    const summary = await BackgroundWorker.runSyncCycle(userId);
    res.json({
      success: true,
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
