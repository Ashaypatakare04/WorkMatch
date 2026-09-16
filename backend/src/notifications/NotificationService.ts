import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';
import {
  NotificationAdapter,
  BrowserNotifier,
  EmailNotifier,
  TelegramNotifier,
  DiscordNotifier
} from './adapters/NotificationAdapters.js';

export class NotificationService {
  private static adapters: Map<string, NotificationAdapter> = new Map<string, NotificationAdapter>([
    ['browser', new BrowserNotifier()],
    ['email', new EmailNotifier()],
    ['telegram', new TelegramNotifier()],
    ['discord', new DiscordNotifier()]
  ]);

  public static async dispatchJobAlert(params: {
    userId: string;
    job: NormalizedJob;
    score: JobScore;
    risk: JobRisk;
  }): Promise<void> {
    const prefs = NotificationRepository.getPreferences(params.userId);

    // 1. Check score threshold
    if (params.score.overall_score < prefs.min_score_threshold && !prefs.alert_high_risk) {
      return;
    }

    // 2. High risk alert rule
    if (params.risk.risk_level === 'High' && !prefs.alert_high_risk) {
      return;
    }

    // 3. Construct concise high-impact notification message (Section 15 design)
    const isHighMatch = params.score.overall_score >= 85;
    const badge = isHighMatch ? '🔥 HIGH MATCH' : '🟡 POSSIBLE MATCH';
    const title = `${badge} — ${params.score.overall_score}/100: ${params.job.title}`;

    const whySnippet = params.score.explanation.why_matches.slice(0, 3).map(w => `✓ ${w}`).join('\n');
    const riskWarning = params.risk.risk_level === 'High' ? `⚠️ High Risk: ${params.risk.warning_signals.join(', ')}\n` : '';

    const body = `Platform: ${params.job.platform.toUpperCase()}
Budget: ${params.job.budget.type === 'fixed' ? `$${params.job.budget.max || params.job.budget.min} Fixed` : `$${params.job.budget.min}-$${params.job.budget.max}/hr`}
Skill Match: ${params.score.skill_score}% | Difficulty: ${params.score.difficulty_score >= 80 ? 'Easy' : 'Moderate'} | Risk: ${params.risk.risk_level}

Why:
${whySnippet || '✓ Matches your profile attributes'}
${riskWarning}`;

    const enabledChannels: ('browser' | 'email' | 'telegram' | 'discord')[] = [];
    if (prefs.browser_enabled) enabledChannels.push('browser');
    if (prefs.email_enabled) enabledChannels.push('email');
    if (prefs.telegram_enabled) enabledChannels.push('telegram');
    if (prefs.discord_enabled) enabledChannels.push('discord');

    for (const channel of enabledChannels) {
      const notifItem = NotificationRepository.create({
        user_id: params.userId,
        job_id: params.job.id,
        channel,
        title,
        body,
        match_score: params.score.overall_score,
        status: 'sent'
      });

      const adapter = NotificationService.adapters.get(channel);
      if (adapter) {
        try {
          await adapter.send(notifItem);
        } catch (e) {
          console.warn(`[NotificationService] Failed to send via ${channel}:`, e);
        }
      }
    }
  }
}
