import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runMigrations } from './database/migrate.js';
import { ConnectorRegistry } from './connectors/base/ConnectorRegistry.js';
import { UpworkConnector } from './connectors/upwork/UpworkConnector.js';
import { FiverrConnector } from './connectors/fiverr/FiverrConnector.js';
import { FreelancerConnector } from './connectors/freelancer/FreelancerConnector.js';
import { MockPlatformConnector } from './connectors/mock/MockPlatformConnector.js';
import { authMiddleware } from './api/middleware/auth.js';
import { errorHandler } from './api/middleware/errorHandler.js';

import { authRouter } from './api/routes/authRoutes.js';
import { jobsRouter } from './api/routes/jobsRoutes.js';
import { applicationsRouter } from './api/routes/applicationRoutes.js';
import { platformRouter } from './api/routes/platformRoutes.js';
import { profileRouter } from './api/routes/profileRoutes.js';
import { automationRouter } from './api/routes/automationRoutes.js';
import { notificationRouter } from './api/routes/notificationRoutes.js';
import { analyticsRouter } from './api/routes/analyticsRoutes.js';
import { demoRouter } from './api/routes/demoRoutes.js';
import { BackgroundWorker } from './workers/BackgroundWorker.js';

import { UserRepository } from './repositories/UserRepository.js';
import { ApplicationRepository } from './repositories/ApplicationRepository.js';
import { JobRepository } from './repositories/JobRepository.js';
import { ProposalGenerator } from './ai/proposals/ProposalGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Database Schema
runMigrations();

// Register Platform Connectors
ConnectorRegistry.register(new UpworkConnector());
ConnectorRegistry.register(new FiverrConnector());
ConnectorRegistry.register(new FreelancerConnector());
ConnectorRegistry.register(new MockPlatformConnector());

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Router
const apiRouter = express.Router();

// Public Auth Endpoints
apiRouter.use('/auth', authRouter);

// Authenticated Endpoints
apiRouter.use('/jobs', authMiddleware, jobsRouter);
apiRouter.use('/applications', authMiddleware, applicationsRouter);
apiRouter.use('/platforms', authMiddleware, platformRouter);
apiRouter.use('/profile', authMiddleware, profileRouter);
apiRouter.use('/automation', authMiddleware, automationRouter);
apiRouter.use('/notifications', authMiddleware, notificationRouter);
apiRouter.use('/analytics', authMiddleware, analyticsRouter);
apiRouter.use('/reports', authMiddleware, analyticsRouter);
apiRouter.use('/demo', authMiddleware, demoRouter);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'WorkMatch AI Core',
    timestamp: new Date().toISOString(),
    connectors: ConnectorRegistry.getAll().map(c => ({ id: c.platformId, name: c.name }))
  });
});

// Mount on both /api and / to seamlessly handle Vercel rewrites and direct calls
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Error handling middleware
app.use(errorHandler);

// Automatic Initial Seed for Cold Starts / New Deployments
export async function ensureInitialSeed(): Promise<void> {
  try {
    const defaultUser = UserRepository.findById('user_default');
    if (!defaultUser) {
      console.log('[WorkMatch AI] Seeding initial demo data for Vercel / new environment...');
      UserRepository.create({
        id: 'user_default',
        email: 'user@workmatch.local',
        full_name: 'Alex Mercer',
        is_admin: true,
        plan_type: 'personal'
      });

      UserRepository.setSkills('user_default', [
        { skill_name: 'Data Entry', category: 'Data Operations', proficiency_level: 'Expert', years_experience: 3.5, verified: true },
        { skill_name: 'Web Research', category: 'Research', proficiency_level: 'Advanced', years_experience: 3.0, verified: true },
        { skill_name: 'Excel', category: 'Productivity', proficiency_level: 'Advanced', years_experience: 4.0, verified: true },
        { skill_name: 'Google Sheets', category: 'Productivity', proficiency_level: 'Advanced', years_experience: 3.0, verified: true },
        { skill_name: 'Virtual Assistance', category: 'Support', proficiency_level: 'Intermediate', years_experience: 2.0, verified: true },
        { skill_name: 'Testing', category: 'Quality Assurance', proficiency_level: 'Intermediate', years_experience: 2.0, verified: true },
        { skill_name: 'HTML', category: 'Development', proficiency_level: 'Basic', years_experience: 1.0, verified: true },
        { skill_name: 'CSS', category: 'Development', proficiency_level: 'Basic', years_experience: 1.0, verified: true },
        { skill_name: 'Python', category: 'Development', proficiency_level: 'Intermediate', years_experience: 2.0, verified: true }
      ]);

      await BackgroundWorker.runSyncCycle('user_default');

      const { jobs } = JobRepository.listJobs('user_default', { limit: 10 });
      const profile = UserRepository.getProfile('user_default');
      if (profile && jobs.length >= 4) {
        const prop1 = await ProposalGenerator.generateVariants(jobs[0], profile);
        const savedProp1 = ApplicationRepository.saveProposal(prop1[0]);
        ApplicationRepository.createOrUpdate({
          job_id: jobs[0].id,
          user_id: 'user_default',
          proposal_id: savedProp1.id,
          status: 'applied',
          mode: 'assisted',
          connect_cost: 4,
          notes: 'Submitted customized Direct variant proposal.'
        });

        const prop2 = await ProposalGenerator.generateVariants(jobs[1], profile);
        const savedProp2 = ApplicationRepository.saveProposal(prop2[1]);
        ApplicationRepository.createOrUpdate({
          job_id: jobs[1].id,
          user_id: 'user_default',
          proposal_id: savedProp2.id,
          status: 'interview',
          mode: 'manual',
          connect_cost: 6,
          notes: 'Client reached out via Upwork message requesting availability schedule.'
        });

        const prop3 = await ProposalGenerator.generateVariants(jobs[2], profile);
        const savedProp3 = ApplicationRepository.saveProposal(prop3[2]);
        ApplicationRepository.createOrUpdate({
          job_id: jobs[2].id,
          user_id: 'user_default',
          proposal_id: savedProp3.id,
          status: 'hired',
          mode: 'manual',
          connect_cost: 4,
          outcome: 'won',
          notes: 'Contract accepted. Initial spreadsheet deliverable completed.'
        });

        JobRepository.setUserJobAction('user_default', jobs[3].id, 'saved');
      }
      console.log('[WorkMatch AI] Initial demo dataset populated successfully.');
    }
  } catch (err) {
    console.warn('[WorkMatch AI] Automatic seed notice:', err);
  }
}

// Trigger initial check
if (process.env.NODE_ENV !== 'test') {
  ensureInitialSeed().catch(err => console.warn('[WorkMatch AI] Seed initialization warning:', err));
}

// Only start background interval worker and listen on port when not running as a Vercel serverless function
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  BackgroundWorker.start(600000);
  app.listen(PORT, () => {
    console.log(`[WorkMatch AI] Backend API server running on http://localhost:${PORT}`);
  });
}

export default app;
