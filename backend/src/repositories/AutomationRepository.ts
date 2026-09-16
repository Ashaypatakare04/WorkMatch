import { Database } from '../database/connection.js';
import { AutomationSettings, DEFAULT_AUTOMATION_SETTINGS, SystemApplicationMode } from '../models/Automation.js';

export class AutomationRepository {
  public static getSettings(userId: string): AutomationSettings {
    const today = new Date().toISOString().slice(0, 10);
    let row = Database.queryOne<any>('SELECT * FROM automation_settings WHERE user_id = ?', [userId]);

    if (!row) {
      const now = new Date().toISOString();
      Database.execute(
        `INSERT INTO automation_settings (
          id, user_id, application_mode, is_active, emergency_stop,
          max_daily_applications, max_hourly_applications, min_match_score,
          max_connect_cost, allowed_categories, excluded_categories,
          max_budget_limit, require_low_risk_only, applications_today_count,
          last_reset_date, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `auto_${userId}`,
          userId,
          DEFAULT_AUTOMATION_SETTINGS.application_mode,
          DEFAULT_AUTOMATION_SETTINGS.is_active ? 1 : 0,
          DEFAULT_AUTOMATION_SETTINGS.emergency_stop ? 1 : 0,
          DEFAULT_AUTOMATION_SETTINGS.max_daily_applications,
          DEFAULT_AUTOMATION_SETTINGS.max_hourly_applications,
          DEFAULT_AUTOMATION_SETTINGS.min_match_score,
          DEFAULT_AUTOMATION_SETTINGS.max_connect_cost,
          JSON.stringify(DEFAULT_AUTOMATION_SETTINGS.allowed_categories),
          JSON.stringify(DEFAULT_AUTOMATION_SETTINGS.excluded_categories),
          DEFAULT_AUTOMATION_SETTINGS.max_budget_limit,
          DEFAULT_AUTOMATION_SETTINGS.require_low_risk_only ? 1 : 0,
          0,
          today,
          now
        ]
      );
      row = Database.queryOne<any>('SELECT * FROM automation_settings WHERE user_id = ?', [userId]);
    }

    // Auto-reset daily counter if day changed
    if (row.last_reset_date !== today) {
      Database.execute(
        'UPDATE automation_settings SET applications_today_count = 0, last_reset_date = ? WHERE user_id = ?',
        [today, userId]
      );
      row.applications_today_count = 0;
      row.last_reset_date = today;
    }

    return {
      id: row.id,
      user_id: row.user_id,
      application_mode: row.application_mode as SystemApplicationMode,
      is_active: Boolean(row.is_active),
      emergency_stop: Boolean(row.emergency_stop),
      max_daily_applications: Number(row.max_daily_applications),
      max_hourly_applications: Number(row.max_hourly_applications),
      min_match_score: Number(row.min_match_score),
      max_connect_cost: Number(row.max_connect_cost),
      allowed_categories: JSON.parse(row.allowed_categories || '[]'),
      excluded_categories: JSON.parse(row.excluded_categories || '[]'),
      max_budget_limit: Number(row.max_budget_limit),
      require_low_risk_only: Boolean(row.require_low_risk_only),
      applications_today_count: Number(row.applications_today_count),
      last_reset_date: row.last_reset_date,
      updated_at: row.updated_at
    };
  }

  public static updateSettings(userId: string, settings: Partial<AutomationSettings>): AutomationSettings {
    const current = AutomationRepository.getSettings(userId);
    const now = new Date().toISOString();

    const updated = {
      application_mode: settings.application_mode ?? current.application_mode,
      is_active: settings.is_active !== undefined ? (settings.is_active ? 1 : 0) : (current.is_active ? 1 : 0),
      emergency_stop: settings.emergency_stop !== undefined ? (settings.emergency_stop ? 1 : 0) : (current.emergency_stop ? 1 : 0),
      max_daily_applications: settings.max_daily_applications ?? current.max_daily_applications,
      max_hourly_applications: settings.max_hourly_applications ?? current.max_hourly_applications,
      min_match_score: settings.min_match_score ?? current.min_match_score,
      max_connect_cost: settings.max_connect_cost ?? current.max_connect_cost,
      allowed_categories: JSON.stringify(settings.allowed_categories ?? current.allowed_categories),
      excluded_categories: JSON.stringify(settings.excluded_categories ?? current.excluded_categories),
      max_budget_limit: settings.max_budget_limit ?? current.max_budget_limit,
      require_low_risk_only: settings.require_low_risk_only !== undefined ? (settings.require_low_risk_only ? 1 : 0) : (current.require_low_risk_only ? 1 : 0)
    };

    Database.execute(
      `UPDATE automation_settings
       SET application_mode = ?, is_active = ?, emergency_stop = ?,
           max_daily_applications = ?, max_hourly_applications = ?, min_match_score = ?,
           max_connect_cost = ?, allowed_categories = ?, excluded_categories = ?,
           max_budget_limit = ?, require_low_risk_only = ?, updated_at = ?
       WHERE user_id = ?`,
      [
        updated.application_mode,
        updated.is_active,
        updated.emergency_stop,
        updated.max_daily_applications,
        updated.max_hourly_applications,
        updated.min_match_score,
        updated.max_connect_cost,
        updated.allowed_categories,
        updated.excluded_categories,
        updated.max_budget_limit,
        updated.require_low_risk_only,
        now,
        userId
      ]
    );

    return AutomationRepository.getSettings(userId);
  }

  public static triggerEmergencyStop(userId: string): void {
    const now = new Date().toISOString();
    Database.execute(
      `UPDATE automation_settings
       SET emergency_stop = 1, is_active = 0, application_mode = 'MANUAL', updated_at = ?
       WHERE user_id = ?`,
      [now, userId]
    );

    // Audit log
    Database.execute(
      `INSERT INTO audit_logs (id, user_id, action, details, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [`audit_${Date.now()}`, userId, 'EMERGENCY_KILL_SWITCH_ACTIVATED', JSON.stringify({ reason: 'User clicked emergency stop' }), now]
    );
  }

  public static incrementDailyCount(userId: string): void {
    Database.execute(
      'UPDATE automation_settings SET applications_today_count = applications_today_count + 1 WHERE user_id = ?',
      [userId]
    );
  }
}
