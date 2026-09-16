import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { BackgroundWorker } from '../../workers/BackgroundWorker.js';
import { ApplicationRepository } from '../../repositories/ApplicationRepository.js';
import { JobRepository } from '../../repositories/JobRepository.js';
import { ProposalGenerator } from '../../ai/proposals/ProposalGenerator.js';

export const demoRouter = Router();

// 1-Click Demo Reset and Seed
demoRouter.post('/seed', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || 'user_default';

    // 1. Ensure user and default profile exist
    let user = UserRepository.findById(userId);
    if (!user) {
      user = UserRepository.create({
        id: userId,
        email: 'user@workmatch.local',
        full_name: 'Alex Mercer',
        is_admin: true,
        plan_type: 'personal'
      });
    }

    // Set high-demand verified skills for the demo profile
    UserRepository.setSkills(userId, [
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

    // 2. Run sync cycle to pull all mock jobs, analyze, score, risk-check, and notify
    const syncSummary = await BackgroundWorker.runSyncCycle(userId);

    // 3. Seed sample applications across pipeline stages (Kanban)
    const { jobs } = JobRepository.listJobs(userId, { limit: 10 });
    const profile = UserRepository.getProfile(userId)!;

    if (jobs.length >= 4) {
      // Job 1: Applied with proposal
      const prop1 = await ProposalGenerator.generateVariants(jobs[0], profile);
      const savedProp1 = ApplicationRepository.saveProposal(prop1[0]);
      ApplicationRepository.createOrUpdate({
        job_id: jobs[0].id,
        user_id: userId,
        proposal_id: savedProp1.id,
        status: 'applied',
        mode: 'assisted',
        connect_cost: 4,
        notes: 'Submitted customized Direct variant proposal.'
      });

      // Job 2: Interview stage
      const prop2 = await ProposalGenerator.generateVariants(jobs[1], profile);
      const savedProp2 = ApplicationRepository.saveProposal(prop2[1]);
      ApplicationRepository.createOrUpdate({
        job_id: jobs[1].id,
        user_id: userId,
        proposal_id: savedProp2.id,
        status: 'interview',
        mode: 'manual',
        connect_cost: 6,
        notes: 'Client reached out via Upwork message requesting availability schedule.'
      });

      // Job 3: Hired stage
      const prop3 = await ProposalGenerator.generateVariants(jobs[2], profile);
      const savedProp3 = ApplicationRepository.saveProposal(prop3[2]);
      ApplicationRepository.createOrUpdate({
        job_id: jobs[2].id,
        user_id: userId,
        proposal_id: savedProp3.id,
        status: 'hired',
        mode: 'manual',
        connect_cost: 4,
        outcome: 'won',
        notes: 'Contract accepted. Initial spreadsheet deliverable completed.'
      });

      // Job 4: Saved stage
      JobRepository.setUserJobAction(userId, jobs[3].id, 'saved');
    }

    res.json({
      success: true,
      message: 'Demo dataset populated successfully with jobs, scores, risk flags, proposals, and pipeline tracking.',
      syncSummary
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
