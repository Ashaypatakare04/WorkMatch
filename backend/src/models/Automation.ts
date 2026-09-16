export type SystemApplicationMode = 'MANUAL' | 'ASSISTED' | 'AUTOMATIC';

export interface AutomationSettings {
  id?: string;
  user_id: string;
  application_mode: SystemApplicationMode;
  is_active: boolean;
  emergency_stop: boolean;
  max_daily_applications: number;
  max_hourly_applications: number;
  min_match_score: number;
  max_connect_cost: number;
  allowed_categories: string[];
  excluded_categories: string[];
  max_budget_limit: number;
  require_low_risk_only: boolean;
  applications_today_count: number;
  last_reset_date: string;
  updated_at: string;
}

export const DEFAULT_AUTOMATION_SETTINGS: Omit<AutomationSettings, 'id' | 'user_id' | 'updated_at'> = {
  application_mode: 'MANUAL',
  is_active: false,
  emergency_stop: false,
  max_daily_applications: 5,
  max_hourly_applications: 2,
  min_match_score: 85,
  max_connect_cost: 6,
  allowed_categories: [],
  excluded_categories: [],
  max_budget_limit: 500,
  require_low_risk_only: true,
  applications_today_count: 0,
  last_reset_date: new Date().toISOString().slice(0, 10)
};
