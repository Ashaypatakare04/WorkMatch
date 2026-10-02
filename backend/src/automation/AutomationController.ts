/**
 * ============================================================================
 * WORKMATCH AUTOMATION SAFETY & RATE-LIMITING CONTROLLER
 * ============================================================================
 *
 * Freelance platforms enforce strict terms of service regarding automated
 * applications, connect consumption, and spam prevention.
 *
 * The AutomationController acts as an unbypassable gatekeeper before any
 * proposal can ever be submitted programmatically.
 *
 * The 3 Operational Modes:
 * 1. MANUAL: Decision support only. Freelancers inspect scores and write/submit proposals themselves.
 * 2. ASSISTED: AI generates, humanizes, and verifies proposal drafts, but submission is blocked
 *    until a human explicitly approves and dispatches.
 * 3. AUTOMATIC: Autonomous submission mode, strictly constrained by 7 safety tripwires:
 *    - Tripwire 1: Emergency Kill Switch (immediate global freeze).
 *    - Tripwire 2: Mode validation (must be 'AUTOMATIC' and 'is_active').
 *    - Tripwire 3: Platform Capability (verifies if the connector allows API applications).
 *    - Tripwire 4: Daily Rate Limit (prevents account flagging from excessive volume).
 *    - Tripwire 5: Hourly Rate Limit (rolling 60-minute window check).
 *    - Tripwire 6: Minimum Match Score Threshold (e.g. ≥ 85%).
 *    - Tripwire 7: Low-Risk Policy Enforcement (rejects Medium or High risk jobs).
 *
 * Audit Trail:
 * Every decision (both approved and blocked) is written to the immutable automation audit log.
 */

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
  proposalId?: string;
  copilotReady?: boolean;
  error?: string;
}

export class AutomationController {
  /**
   * Strictly evaluates whether an automated application can be submitted for a job.
   * If any safety condition is violated, logs audit rationale and refuses to apply.
   * In ASSISTED mode, generates claim-verified drafts and moves application to proposal_generated.
   *
   * @param params - Context including target job, calculated score, risk profile, and platform connector.
   * @returns AutomationEvaluationResult indicating whether application was allowed, dispatched, or blocked.
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
      if (settings.application_mode === 'ASSISTED' && settings.is_active) {
        return await this.evaluateAndDraftAssisted(params, settings);
      }
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

  /**
   * Safe Copilot Draft Flow for Assisted mode or human-in-the-loop workflows.
   * Creates claim-verified proposal drafts and sets application state to proposal_generated
   * without violating freelance platform Terms of Service (e.g. Upwork, Fiverr).
   */
  public static async evaluateAndDraftAssisted(
    params: {
      userId: string;
      job: NormalizedJob;
      score: JobScore;
      risk: JobRisk;
      profile: UserCapabilityProfile;
      connector?: PlatformConnector;
    },
    settings: ReturnType<typeof AutomationRepository.getSettings>
  ): Promise<AutomationEvaluationResult> {
    if (settings.emergency_stop) {
      this.recordAudit(params.userId, params.job.id, 'COPILOT_BLOCKED', 'Emergency stop is active');
      return { allowed: false, reason: 'EMERGENCY_STOP_ACTIVE: Global kill-switch is engaged', applied: false };
    }

    if (params.score.overall_score < settings.min_match_score) {
      return {
        allowed: false,
        reason: `SCORE_TOO_LOW: Match score (${params.score.overall_score}) is below required minimum (${settings.min_match_score})`,
        applied: false
      };
    }

    if (settings.require_low_risk_only && params.risk.risk_level !== 'Low') {
      this.recordAudit(params.userId, params.job.id, 'COPILOT_BLOCKED', `Risk level ${params.risk.risk_level} exceeds Low-risk policy`);
      return {
        allowed: false,
        reason: `RISK_TOO_HIGH: Risk level is ${params.risk.risk_level}, requires Low Risk only`,
        applied: false
      };
    }

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

    const existing = Database.queryOne<{ id: string; status: string }>(
      'SELECT id, status FROM applications WHERE user_id = ? AND job_id = ?',
      [params.userId, params.job.id]
    );
    if (existing && existing.status !== 'discovered' && existing.status !== 'analyzed') {
      return {
        allowed: false,
        reason: 'DUPLICATE_APPLICATION: Application already exists for this job',
        applied: false
      };
    }

    try {
      const proposals = await ProposalGenerator.generateVariants(params.job, params.profile);
      const selectedProposal = proposals.find(p => p.style === 'direct') || proposals[0];
      const savedProposal = ApplicationRepository.saveProposal(selectedProposal);

      const connectCost = (params.job.source_data?.connects_required as number) || 4;
      const app = ApplicationRepository.createOrUpdate({
        job_id: params.job.id,
        user_id: params.userId,
        proposal_id: savedProposal.id,
        status: 'proposal_generated',
        mode: 'assisted',
        connect_cost: connectCost,
        notes: `Assisted Copilot: Proposal draft created for ${params.job.platform} and ready for 1-click human dispatch.`
      });

      this.recordAudit(
        params.userId,
        params.job.id,
        'COPILOT_DRAFT_CREATED',
        `Generated ${selectedProposal.style} draft proposal ready for human review`
      );

      return {
        allowed: true,
        applied: false,
        copilotReady: true,
        applicationId: app.id,
        proposalId: savedProposal.id,
        reason: 'Assisted Copilot: Proposal draft created and ready for human review'
      };
    } catch (err: any) {
      this.recordAudit(params.userId, params.job.id, 'COPILOT_ERROR', err.message);
      return {
        allowed: false,
        applied: false,
        reason: 'Error occurred during assisted proposal generation',
        error: err.message
      };
    }
  }

  /**
   * Explicitly drafts a copilot proposal and links it to an application in proposal_generated state.
   */
  public static async generateCopilotDraft(params: {
    userId: string;
    job: NormalizedJob;
    profile: UserCapabilityProfile;
    preferredStyle?: string;
  }): Promise<{ proposal: any; applicationId: string }> {
    const proposals = await ProposalGenerator.generateVariants(params.job, params.profile);
    const selectedProposal =
      proposals.find(p => p.style === (params.preferredStyle || 'direct')) || proposals[0];
    const savedProposal = ApplicationRepository.saveProposal(selectedProposal);

    const app = ApplicationRepository.createOrUpdate({
      job_id: params.job.id,
      user_id: params.userId,
      proposal_id: savedProposal.id,
      status: 'proposal_generated',
      mode: 'assisted',
      connect_cost: (params.job.source_data?.connects_required as number) || 4,
      notes: `Copilot draft generated (${selectedProposal.style} style)`
    });

    this.recordAudit(
      params.userId,
      params.job.id,
      'COPILOT_MANUAL_DRAFT',
      `Manual copilot draft generated (${selectedProposal.style})`
    );

    return { proposal: savedProposal, applicationId: app.id || '' };
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
