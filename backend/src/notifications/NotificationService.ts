import { NotificationRepository } from '../repositories/NotificationRepository.js';
import { NormalizedJob } from '../models/NormalizedJob.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';
import { NotificationChannel } from '../models/Notification.js';
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

  public static isWithinQuietHours(start: string, end: string, now: Date = new Date()): boolean {
    if (!start || !end) return false;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    if (isNaN(startH) || isNaN(endH)) return false;

    const currentTotal = now.getHours() * 60 + now.getMinutes();
    const startTotal = startH * 60 + (startM || 0);
    const endTotal = endH * 60 + (endM || 0);

    if (startTotal <= endTotal) {
      return currentTotal >= startTotal && currentTotal < endTotal;
    } else {
      // Spans midnight (e.g. 22:00 to 08:00)
      return currentTotal >= startTotal || currentTotal < endTotal;
    }
  }

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

    // 3. Construct concise high-impact notification message
    const isHighMatch = params.score.overall_score >= 85;
    const badge = isHighMatch ? '🔥 HIGH MATCH' : '🟡 POSSIBLE MATCH';
    const title = `${badge} — ${params.score.overall_score}/100: ${params.job.title}`;

    const whySnippet = params.score.explanation.why_matches.slice(0, 3).map(w => `✓ ${w}`).join('\n');
    const riskWarning = params.risk.risk_level === 'High' ? `⚠️ High Risk: ${params.risk.warning_signals.join(', ')}\n` : '';

    const body = `Platform: ${params.job.platform.toUpperCase()}
Budget: ${params.job.budget?.type === 'fixed' ? `$${params.job.budget.max || params.job.budget.min} Fixed` : `$${params.job.budget?.min || 0}-$${params.job.budget?.max || 0}/hr`}
Skill Match: ${params.score.skill_score}% | Difficulty: ${params.score.difficulty_score >= 80 ? 'Easy' : 'Moderate'} | Risk: ${params.risk.risk_level}

Why:
${whySnippet || '✓ Matches your profile attributes'}
${riskWarning}`;

    const inQuietHours = NotificationService.isWithinQuietHours(prefs.quiet_hours_start, prefs.quiet_hours_end);

    const enabledChannels: NotificationChannel[] = [];
    if (prefs.browser_enabled) enabledChannels.push('browser');

    // External channels are silenced during quiet hours
    if (!inQuietHours) {
      if (prefs.email_enabled) enabledChannels.push('email');
      if (prefs.telegram_enabled) enabledChannels.push('telegram');
      if (prefs.discord_enabled) enabledChannels.push('discord');
    }

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
          const res = await adapter.send(notifItem);
          if (!res.delivered && res.error) {
            console.warn(`[NotificationService] Delivery notice for ${channel}:`, res.error);
          }
        } catch (e) {
          console.warn(`[NotificationService] Failed to send via ${channel}:`, e);
        }
      }
    }
  }

  public static async sendTestAlert(userId: string, channel: NotificationChannel): Promise<{ delivered: boolean; error?: string }> {
    const adapter = NotificationService.adapters.get(channel);
    if (!adapter) {
      return { delivered: false, error: `Channel adapter ${channel} not found` };
    }

    const testItem = NotificationRepository.create({
      user_id: userId,
      channel,
      title: `⚡ WorkMatch AI Test Alert (${channel.toUpperCase()})`,
      body: `This is a test notification confirming your ${channel.toUpperCase()} integration is connected and functioning properly.`,
      match_score: 95,
      status: 'sent'
    });

    return adapter.send(testItem);
  }
}
