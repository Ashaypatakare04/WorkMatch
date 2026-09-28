/**
 * ============================================================================
 * WORKMATCH RISK & SCAM SIGNAL DETECTION ENGINE
 * ============================================================================
 *
 * Freelance marketplaces are plagued by common fraud vectors: fake client
 * profiles, off-platform redirects (Telegram, WhatsApp), upfront "equipment" fees,
 * and malicious shortened links.
 *
 * The RiskScamSignalEngine protects freelancers through a hybrid defense model:
 * 1. Fast Deterministic Heuristics:
 *    - Off-Platform Redirects: Flags attempts to bypass marketplace escrow protections.
 *    - Upfront Fees: Immediate +60 point risk penalty for "registration" or "deposit" fees.
 *    - Unrealistic Remuneration: Detects "too good to be true" offers (e.g. $2,000 for data entry).
 *    - Unpaid Spec Work: Flags demands for free custom labor before contract award.
 *    - Client Track Record: Penalizes accounts with high job volumes but zero hire rates.
 * 2. Semantic LLM Threat Analysis:
 *    - Leverages RISK_ANALYZER_V1 to detect nuanced social engineering or phishing tactics.
 * 3. Categorical Risk Rating:
 *    - Low (<35): Verified, safe opportunity with reputable client history.
 *    - Medium (35–64): Potential caution; proceed with escrow awareness.
 *    - High (≥65): Critical warning; automated applications blocked.
 */

import { NormalizedJob } from '../../models/NormalizedJob.js';
import { JobRisk, RiskLevel } from '../../models/JobRisk.js';
import { AIGateway } from '../gateway/AIGateway.js';
import { RISK_ANALYZER_V1 } from '../prompts/risk_analyzer_v1.js';

export class RiskScamSignalEngine {
  /**
   * Evaluates an opportunity against scam signatures, off-platform risks, and client behavior.
   *
   * @param job - The normalized marketplace opportunity.
   * @param userId - Optional user ID for AI logging context.
   * @returns JobRisk analysis including risk level, numerical score (0-100), and warning signals.
   */
  public static async analyze(job: NormalizedJob, userId?: string): Promise<JobRisk> {
    const warningSignals: string[] = [];
    let baseRiskScore = 10;

    const lowerDesc = (job.description || '').toLowerCase();
    const lowerTitle = (job.title || '').toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // 1. Off-Platform Contact Indicators (Telegram, WhatsApp, Skype)
    // ─────────────────────────────────────────────────────────────
    if (lowerDesc.includes('telegram') || lowerDesc.includes('whatsapp') || lowerDesc.includes('skype id') || lowerDesc.includes('contact me on:')) {
      warningSignals.push('Explicit request to communicate outside the platform (Telegram/WhatsApp)');
      baseRiskScore += 45;
    }

    // 2. Off-platform payment requests
    if (lowerDesc.includes('pay outside') || lowerDesc.includes('paypal directly') || lowerDesc.includes('crypto payment') || lowerDesc.includes('wire transfer')) {
      warningSignals.push('Direct request for off-platform payment, violating buyer/seller protections');
      baseRiskScore += 50;
    }

    // 3. Upfront fees or deposits
    if (lowerDesc.includes('security deposit') || lowerDesc.includes('equipment fee') || lowerDesc.includes('registration fee')) {
      warningSignals.push('Requires upfront fee or deposit before starting work (Scam signature)');
      baseRiskScore += 60;
    }

    // 4. Extensive unpaid sample or test work
    if (lowerDesc.includes('free test') || lowerDesc.includes('unpaid sample') || lowerDesc.includes('do this complete task for review')) {
      warningSignals.push('Requests extensive unpaid test work or spec labor before contract award');
      baseRiskScore += 25;
    }

    // 5. Unrealistic compensation flags
    if (job.budget?.type === 'fixed' && job.budget?.max && job.budget.max > 2000 && (lowerTitle.includes('data entry') || lowerTitle.includes('copy paste'))) {
      warningSignals.push('Disproportionately high compensation for basic repetitive tasks');
      baseRiskScore += 30;
    }

    // 6. Suspicious external shortened links
    if (job.external_links && job.external_links.some(l => l.includes('bit.ly') || l.includes('tinyurl') || l.includes('t.me'))) {
      warningSignals.push('Contains obfuscated or suspicious external redirect links');
      baseRiskScore += 25;
    }

    // 7. Client history signals
    if (job.client?.jobs_posted && job.client.jobs_posted > 15 && (job.client.hire_rate === 0 || (job.client.rating && job.client.rating < 2.5))) {
      warningSignals.push('Client has posted numerous jobs with 0% hire rate or low client feedback rating');
      baseRiskScore += 20;
    }

    // AI validation pass
    const prompt = RISK_ANALYZER_V1.render(job);
    const aiResult = await AIGateway.executePrompt<{
      risk_level?: RiskLevel;
      risk_score?: number;
      warning_signals?: string[];
      explanation?: string;
    }>({
      userId,
      endpoint: '/ai/risk-analysis',
      promptName: RISK_ANALYZER_V1.name,
      promptVersion: RISK_ANALYZER_V1.version,
      renderedPrompt: prompt,
      isStructured: true,
      schemaDescription: 'RiskAnalysisSchema'
    });

    const aiData = aiResult.data || {};
    if (aiData.warning_signals && Array.isArray(aiData.warning_signals)) {
      for (const sig of aiData.warning_signals) {
        if (!warningSignals.includes(sig)) {
          warningSignals.push(sig);
        }
      }
    }

    const calculatedScore = Math.min(100, Math.max(baseRiskScore, aiData.risk_score || baseRiskScore));
    let level: RiskLevel = 'Low';
    if (calculatedScore >= 70 || warningSignals.length >= 2) {
      level = 'High';
    } else if (calculatedScore >= 40 || warningSignals.length === 1) {
      level = 'Medium';
    } else if (calculatedScore >= 25) {
      level = 'Needs Review';
    }

    let explanation = aiData.explanation || '';
    if (!explanation) {
      if (level === 'High') {
        explanation = 'High risk signals detected. Platform rules or financial safety may be compromised.';
      } else if (level === 'Medium') {
        explanation = 'Caution advised. Clarify requirements and keep all messaging on-platform.';
      } else {
        explanation = 'Standard job posting with no alarming safety signals found.';
      }
    }

    return {
      id: `risk_${job.id}`,
      job_id: job.id,
      risk_level: level,
      risk_score: calculatedScore,
      warning_signals: warningSignals,
      explanation,
      analyzed_at: new Date().toISOString()
    };
  }
}
