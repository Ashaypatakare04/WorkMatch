export type NotificationChannel = 'browser' | 'email' | 'telegram' | 'discord';

export interface NotificationItem {
  id?: string;
  user_id: string;
  job_id?: string | null;
  channel: NotificationChannel;
  title: string;
  body: string;
  match_score?: number;
  sent_at: string;
  read_at?: string | null;
  status: 'sent' | 'delivered' | 'failed';
}

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  browser_enabled: boolean;
  email_enabled: boolean;
  telegram_enabled: boolean;
  discord_enabled: boolean;
  min_score_threshold: number;
  alert_high_risk: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  updated_at: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, 'id' | 'user_id' | 'updated_at'> = {
  browser_enabled: true,
  email_enabled: false,
  telegram_enabled: false,
  discord_enabled: false,
  min_score_threshold: 85,
  alert_high_risk: true,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00'
};
