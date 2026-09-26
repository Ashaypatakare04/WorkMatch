import { Database } from '../database/connection.js';
import { NotificationItem, NotificationPreferences, DEFAULT_NOTIFICATION_PREFERENCES } from '../models/Notification.js';

export class NotificationRepository {
  public static create(item: Omit<NotificationItem, 'id' | 'sent_at'>): NotificationItem {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const jobExists = item.job_id ? Database.queryOne('SELECT id FROM jobs WHERE id = ?', [item.job_id]) : null;
    const validJobId = jobExists ? item.job_id : null;

    Database.execute(
      `INSERT INTO notifications (id, user_id, job_id, channel, title, body, match_score, sent_at, read_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        item.user_id,
        validJobId,
        item.channel,
        item.title,
        item.body,
        item.match_score || null,
        now,
        null,
        item.status || 'sent'
      ]
    );

    return {
      id,
      ...item,
      sent_at: now
    };
  }

  public static listByUser(userId: string, limit: number = 30): NotificationItem[] {
    const rows = Database.query<any>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY sent_at DESC LIMIT ?',
      [userId, limit]
    );
    return rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      job_id: r.job_id,
      channel: r.channel,
      title: r.title,
      body: r.body,
      match_score: r.match_score !== null ? Number(r.match_score) : undefined,
      sent_at: r.sent_at,
      read_at: r.read_at,
      status: r.status
    }));
  }

  public static markAsRead(userId: string, id?: string): void {
    const now = new Date().toISOString();
    if (id) {
      Database.execute('UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ?', [now, id, userId]);
    } else {
      Database.execute('UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL', [now, userId]);
    }
  }

  public static getPreferences(userId: string): NotificationPreferences {
    const row = Database.queryOne<any>('SELECT * FROM notification_preferences WHERE user_id = ?', [userId]);
    if (!row) {
      const now = new Date().toISOString();
      Database.execute(
        `INSERT INTO notification_preferences (
          id, user_id, browser_enabled, email_enabled, telegram_enabled, discord_enabled,
          min_score_threshold, alert_high_risk, quiet_hours_start, quiet_hours_end, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `np_${userId}`,
          userId,
          DEFAULT_NOTIFICATION_PREFERENCES.browser_enabled ? 1 : 0,
          DEFAULT_NOTIFICATION_PREFERENCES.email_enabled ? 1 : 0,
          DEFAULT_NOTIFICATION_PREFERENCES.telegram_enabled ? 1 : 0,
          DEFAULT_NOTIFICATION_PREFERENCES.discord_enabled ? 1 : 0,
          DEFAULT_NOTIFICATION_PREFERENCES.min_score_threshold,
          DEFAULT_NOTIFICATION_PREFERENCES.alert_high_risk ? 1 : 0,
          DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_start,
          DEFAULT_NOTIFICATION_PREFERENCES.quiet_hours_end,
          now
        ]
      );
      return {
        id: `np_${userId}`,
        user_id: userId,
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        updated_at: now
      };
    }

    return {
      id: row.id,
      user_id: row.user_id,
      browser_enabled: Boolean(row.browser_enabled),
      email_enabled: Boolean(row.email_enabled),
      telegram_enabled: Boolean(row.telegram_enabled),
      discord_enabled: Boolean(row.discord_enabled),
      min_score_threshold: Number(row.min_score_threshold),
      alert_high_risk: Boolean(row.alert_high_risk),
      quiet_hours_start: row.quiet_hours_start,
      quiet_hours_end: row.quiet_hours_end,
      updated_at: row.updated_at
    };
  }

  public static updatePreferences(userId: string, prefs: Partial<NotificationPreferences>): NotificationPreferences {
    const current = NotificationRepository.getPreferences(userId);
    const now = new Date().toISOString();

    Database.execute(
      `UPDATE notification_preferences
       SET browser_enabled = ?, email_enabled = ?, telegram_enabled = ?, discord_enabled = ?,
           min_score_threshold = ?, alert_high_risk = ?, quiet_hours_start = ?, quiet_hours_end = ?, updated_at = ?
       WHERE user_id = ?`,
      [
        prefs.browser_enabled !== undefined ? (prefs.browser_enabled ? 1 : 0) : (current.browser_enabled ? 1 : 0),
        prefs.email_enabled !== undefined ? (prefs.email_enabled ? 1 : 0) : (current.email_enabled ? 1 : 0),
        prefs.telegram_enabled !== undefined ? (prefs.telegram_enabled ? 1 : 0) : (current.telegram_enabled ? 1 : 0),
        prefs.discord_enabled !== undefined ? (prefs.discord_enabled ? 1 : 0) : (current.discord_enabled ? 1 : 0),
        prefs.min_score_threshold ?? current.min_score_threshold,
        prefs.alert_high_risk !== undefined ? (prefs.alert_high_risk ? 1 : 0) : (current.alert_high_risk ? 1 : 0),
        prefs.quiet_hours_start ?? current.quiet_hours_start,
        prefs.quiet_hours_end ?? current.quiet_hours_end,
        now,
        userId
      ]
    );

    return NotificationRepository.getPreferences(userId);
  }
}
