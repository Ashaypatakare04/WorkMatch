import { Database } from '../database/connection.js';
import { ConnectorRegistry } from '../connectors/base/ConnectorRegistry.js';
import { JobRepository } from '../repositories/JobRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { JobAnalyzer } from '../ai/analyzers/JobAnalyzer.js';
import { RiskScamSignalEngine } from '../ai/risk/RiskScamSignalEngine.js';
import { MatchingEngine } from '../ai/matching/MatchingEngine.js';
import { NotificationService } from '../notifications/NotificationService.js';
import { AutomationController } from '../automation/AutomationController.js';
import { PlatformRepository } from '../repositories/PlatformRepository.js';

/**
 * ============================================================================
 * WORKMATCH BACKGROUND SYNCHRONIZATION WORKER
 * ============================================================================
 *
 * This background worker is the autonomous heartbeat of the WorkMatch engine:
 * 1. Platform Ingestion: Polls all registered platform connectors (Upwork, Fiverr,
 *    Freelancer, Mock) for newly published opportunities.
 * 2. Deduplication & Storage: Passes raw items through the normalization pipeline,
 *    computing deterministic hashes to prevent duplicate database entries.
 * 3. AI Analysis & Risk Audits: Runs job content through the JobAnalyzer and
 *    RiskScamSignalEngine to classify required skills and safety flags.
 * 4. Multi-Criteria Scoring: Matches each job against user capability profiles
 *    across 7 distinct dimensions.
 * 5. Alert Dispatch: Triggers real-time notifications for high-match opportunities (≥85%).
 * 6. Guardrailed Auto-Pilot: If automated mode is enabled and all safety criteria
 *    are satisfied, dispatches truth-checked proposals within strict rate limits.
 */
export class BackgroundWorker {
  private static isRunning: boolean = false;
  private static syncInterval: NodeJS.Timeout | null = null;

  /**
   * Starts the recurring background synchronization worker.
   *
   * @param intervalMs - Polling interval in milliseconds (defaults to 5 minutes).
   */
  public static start(intervalMs: number = 300000): void { // Default 5 mins, or triggered on demand
    console.log('[BackgroundWorker] Starting background synchronization worker...');
    if (BackgroundWorker.syncInterval) clearInterval(BackgroundWorker.syncInterval);
    BackgroundWorker.syncInterval = setInterval(() => {
      BackgroundWorker.runSyncCycle().catch(err => {
        console.error('[BackgroundWorker] Error during background sync cycle:', err);
      });
    }, intervalMs);
  }

  /**
   * Gracefully terminates the background timer (used during testing or shutdown).
   */
  public static stop(): void {
    if (BackgroundWorker.syncInterval) {
      clearInterval(BackgroundWorker.syncInterval);
      BackgroundWorker.syncInterval = null;
    }
  }

  /**
   * Executes a complete sync, normalization, analysis, scoring, and application cycle.
   *
   * @param targetUserId - Optional user ID to restrict processing to a single user.
   * @returns Aggregate counts of collected, analyzed, notified, and applied jobs.
   */
  public static async runSyncCycle(targetUserId?: string): Promise<{
    jobsCollected: number;
    newJobsInserted: number;
    analyzedCount: number;
    notificationsSent: number;
    automatedApplications: number;
  }> {
    if (BackgroundWorker.isRunning) {
      console.log('[BackgroundWorker] Sync cycle already in progress, skipping concurrent run.');
      return { jobsCollected: 0, newJobsInserted: 0, analyzedCount: 0, notificationsSent: 0, automatedApplications: 0 };
    }

    BackgroundWorker.isRunning = true;
    let jobsCollected = 0;
    let newJobsInserted = 0;
    let analyzedCount = 0;
    let notificationsSent = 0;
    let automatedApplications = 0;

    try {
      // 1. Collect jobs from all registered platform connectors
      const connectors = ConnectorRegistry.getAll();
      for (const connector of connectors) {
        try {
          const rawJobs = await connector.getJobs({ limit: 20 });
          jobsCollected += rawJobs.length;

          for (const job of rawJobs) {
            const insertResult = JobRepository.insertJob(job);
            if (insertResult.inserted) {
              newJobsInserted++;
            }
          }

          if (targetUserId) {
            PlatformRepository.updateSyncStatus(targetUserId, connector.platformId, 'HEALTHY');
          }
        } catch (err) {
          console.warn(`[BackgroundWorker] Failed to sync platform ${connector.platformId}:`, err);
        }
      }

      // 2. Determine target user list
      let userIds: string[] = [];
      if (targetUserId) {
        userIds = [targetUserId];
      } else {
        try {
          const users = Database.query<{ id: string }>('SELECT id FROM users');
          userIds = users.map((u: { id: string }) => u.id);
        } catch {
          userIds = [];
        }
        if (userIds.length === 0) userIds.push('user_default');
      }

      // 3. Process jobs that need analysis & scoring for each user
      for (const userId of userIds) {
        const userProfile = UserRepository.getProfile(userId);
        if (!userProfile) continue;

        const { jobs } = JobRepository.listJobs(userId, { limit: 50 });
        for (const job of jobs) {
          // A. Analyze if not already analyzed
          let analysis = job.analysis;
          if (!analysis) {
            analysis = await JobAnalyzer.analyze(job, userId);
            JobRepository.saveJobAnalysis(analysis);
            analyzedCount++;
          }

          // B. Risk check if not already performed
          let risk = job.risk;
          if (!risk) {
            risk = await RiskScamSignalEngine.analyze(job, userId);
            JobRepository.saveJobRisk(risk);
          }

          // C. Score job if not already scored
          let score = job.score;
          if (!score) {
            score = MatchingEngine.match(job, analysis, risk, userProfile);
            JobRepository.saveJobScore(score);

            // D. Dispatch notification if threshold met
            if (score.overall_score >= userProfile.preferences.scoring_thresholds.high_match) {
              await NotificationService.dispatchJobAlert({
                userId,
                job,
                score,
                risk
              });
              notificationsSent++;
            }

            // E. Check for automated application
            const connector = ConnectorRegistry.get(job.platform) || ConnectorRegistry.get('mock')!;
            const autoRes = await AutomationController.evaluateAndApply({
              userId,
              job,
              score,
              risk,
              profile: userProfile,
              connector
            });

            if (autoRes.applied) {
              automatedApplications++;
            }
          }
        }
      }
    } finally {
      BackgroundWorker.isRunning = false;
    }

    return { jobsCollected, newJobsInserted, analyzedCount, notificationsSent, automatedApplications };
  }
}
