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

// Public Auth Endpoints
app.use('/api/auth', authRouter);

// Authenticated Endpoints
app.use('/api/jobs', authMiddleware, jobsRouter);
app.use('/api/applications', authMiddleware, applicationsRouter);
app.use('/api/platforms', authMiddleware, platformRouter);
app.use('/api/profile', authMiddleware, profileRouter);
app.use('/api/automation', authMiddleware, automationRouter);
app.use('/api/notifications', authMiddleware, notificationRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);
app.use('/api/reports', authMiddleware, analyticsRouter);
app.use('/api/demo', authMiddleware, demoRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'WorkMatch AI Core',
    timestamp: new Date().toISOString(),
    connectors: ConnectorRegistry.getAll().map(c => ({ id: c.platformId, name: c.name }))
  });
});

// Error handling middleware
app.use(errorHandler);

// Start Background Worker (runs every 10 minutes, or on demand)
BackgroundWorker.start(600000);

const server = app.listen(PORT, () => {
  console.log(`[WorkMatch AI] Backend API server running on http://localhost:${PORT}`);
});

export default app;
