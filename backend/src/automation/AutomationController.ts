import { AutomationRepository } from '../repositories/AutomationRepository.js';
import { ApplicationRepository } from '../repositories/ApplicationRepository.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';
import { UserCapabilityProfile } from '../models/UserCapabilityProfile.js';
import { PlatformConnector } from '../models/PlatformConnector.js';
import { ProposalGenerator } from '../ai/proposals/ProposalGenerator.js';
import { Database } from '../database/connection.js';

export interface AutomationEvaluationResult {
  allowed: boolean;
  reason: string;
  applied: boolean;
  applicationId?: string;
  error?: string;
}

export class AutomationController {
  /**
   * Strictly evaluates whether an automated application can be submitted for a job.
   * If any safety condition is violated, logs audit rationale and refuses to apply.
   */
  public static async evaluateAndApply(params: {
    userId: string;
    job: NormalizedJob;
    score: JobScore;
    risk: JobRisk;
    profile: UserCapabilityProfile;
    connector: PlatformConnector;
  }): Promise<AutomationEvaluationResult> {
    const settings = AutomationRepository.getSettings(params.userId);

    // 1. Check Emergency Kill Switch
    if (settings.emergency_stop) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', 'Emergency stop is active');
      return { allowed: false, reason: 'EMERGENCY_STOP_ACTIVE: Global kill-switch is engaged', applied: false };
    }

    // 2. Check System Application Mode
    if (settings.application_mode !== 'AUTOMATIC' || !settings.is_active) {
      return {
        allowed: false,
        reason: `APPLICATION_MODE_NOT_AUTOMATIC: Current mode is ${settings.application_mode}`,
        applied: false
      };
    }

    // 3. Platform Capability Verification
    const caps = params.connector.getCapabilities();
    if (!caps.applications) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', `Platform ${params.job.platform} does not support automatic submissions`);
      return {
        allowed: false,
        reason: `PLATFORM_UNSUPPORTED: ${params.job.platform} does not support programmatic application`,
        applied: false
      };
    }

    // 4. Rate limits check (Daily limit)
    if (settings.applications_today_count >= settings.max_daily_applications) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', `Daily limit of ${settings.max_daily_applications} reached`);
      return {
        allowed: false,
        reason: `DAILY_LIMIT_REACHED: Reached limit of ${settings.max_daily_applications} applications for today`,
        applied: false
      };
    }

    // 4b. Rate limits check (Hourly limit)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const hourlyRow = Database.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM applications
       WHERE user_id = ? AND mode = 'automatic' AND applied_at >= ?`,
      [params.userId, oneHourAgo]
    );
    const hourlyCount = Number(hourlyRow?.count || 0);

    if (hourlyCount >= settings.max_hourly_applications) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', `Hourly limit of ${settings.max_hourly_applications} reached (${hourlyCount} in last hour)`);
      return {
        allowed: false,
        reason: `HOURLY_LIMIT_REACHED: Reached limit of ${settings.max_hourly_applications} applications per hour`,
        applied: false
      };
    }

    // 5. Minimum Score Threshold
    if (params.score.overall_score < settings.min_match_score) {
      return {
        allowed: false,
        reason: `SCORE_TOO_LOW: Match score (${params.score.overall_score}) is below required minimum (${settings.min_match_score})`,
        applied: false
      };
    }

    // 6. Risk Threshold (Low risk only if required)
    if (settings.require_low_risk_only && params.risk.risk_level !== 'Low') {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', `Risk level ${params.risk.risk_level} exceeds Low-risk policy`);
      return {
        allowed: false,
        reason: `RISK_TOO_HIGH: Risk level is ${params.risk.risk_level}, requires Low Risk only`,
        applied: false
      };
    }

    // 7. Category filtering (Allowed / Excluded)
    if (settings.allowed_categories.length > 0 && !settings.allowed_categories.includes(params.job.category)) {
      return {
        allowed: false,
        reason: `CATEGORY_NOT_ALLOWED: Category "${params.job.category}" is not in whitelist`,
        applied: false
      };
    }
    if (settings.excluded_categories.includes(params.job.category)) {
      return {
        allowed: false,
        reason: `CATEGORY_EXCLUDED: Category "${params.job.category}" is in blacklist`,
        applied: false
      };
    }

    // 8. Connect / Application Cost check
    const connectCost = (params.job.source_data?.connects_required as number) || 4;
    if (connectCost > settings.max_connect_cost) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_BLOCKED', `Cost ${connectCost} connects exceeds limit ${settings.max_connect_cost}`);
      return {
        allowed: false,
        reason: `CONNECT_COST_EXCEEDED: Job requires ${connectCost} connects, limit is ${settings.max_connect_cost}`,
        applied: false
      };
    }

    // 9. Duplicate application check
    const existing = Database.queryOne('SELECT id FROM applications WHERE user_id = ? AND job_id = ?', [params.userId, params.job.id]);
    if (existing) {
      return {
        allowed: false,
        reason: 'DUPLICATE_APPLICATION: Application already exists for this job',
        applied: false
      };
    }

    // ALL SAFETY CHECKS PASSED: Proceed to generate personalized proposal and submit
    try {
      const proposals = await ProposalGenerator.generateVariants(params.job, params.profile);
      const selectedProposal = proposals.find(p => p.style === 'direct') || proposals[0];
      const savedProposal = ApplicationRepository.saveProposal(selectedProposal);

      const submissionResult = await params.connector.submitApplication({
        platformJobId: params.job.platform_job_id,
        proposalText: selectedProposal.content,
        rate: params.profile.hourly_rate
      });

      if (submissionResult.success) {
        const app = ApplicationRepository.createOrUpdate({
          job_id: params.job.id,
          user_id: params.userId,
          proposal_id: savedProposal.id,
          status: 'applied',
          mode: 'automatic',
          connect_cost: connectCost,
          notes: `Automated application submitted via ${params.job.platform} connector.`
        });

        AutomationRepository.incrementDailyCount(params.userId);
        this.recordAudit(params.userId, params.job.id, 'AUTOMATION_APPLIED', `Successfully submitted proposal (${selectedProposal.style} style)`);

        return {
          allowed: true,
          applied: true,
          applicationId: app.id,
          reason: 'Application submitted successfully'
        };
      } else {
        this.recordAudit(params.userId, params.job.id, 'AUTOMATION_FAILED', submissionResult.error || 'Submission failed');
        return {
          allowed: true,
          applied: false,
          reason: submissionResult.error || 'Platform submission failed',
          error: submissionResult.error
        };
      }
    } catch (err: any) {
      this.recordAudit(params.userId, params.job.id, 'AUTOMATION_ERROR', err.message);
      return {
        allowed: true,
        applied: false,
        reason: 'Error occurred during proposal generation or submission',
        error: err.message
      };
    }
  }

  private static recordAudit(userId: string, jobId: string, action: string, message: string): void {
    const now = new Date().toISOString();
    try {
      Database.execute(
        `INSERT INTO audit_logs (id, user_id, action, details, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [`audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, userId, action, JSON.stringify({ jobId, message }), now]
      );
    } catch (e) {
      console.warn('[AutomationController] Audit logging failed:', e);
    }
  }
}
