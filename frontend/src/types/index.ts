export interface JobBudget {
  type: 'fixed' | 'hourly';
  min: number | null;
  max: number | null;
  currency: string;
}

export interface JobClient {
  name: string;
  country: string;
  rating: number | null;
  reviews: number | null;
  jobs_posted: number | null;
  jobs_hired: number | null;
  hire_rate: number | null;
}

export interface JobCompetition {
  proposal_count: number | null;
}

export interface ScoreExplanation {
  why_matches: string[];
  why_not_matches: string[];
  concerns: string[];
  estimated_effort: string;
  potential_value: string;
}

export interface JobScore {
  id?: string;
  job_id: string;
  user_id: string;
  overall_score: number;
  skill_score: number;
  experience_score: number;
  difficulty_score: number;
  budget_score: number;
  time_score: number;
  communication_score: number;
  preference_score: number;
  client_quality_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation: ScoreExplanation;
  scored_at: string;
}

export interface JobRisk {
  id?: string;
  job_id: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Needs Review';
  risk_score: number;
  warning_signals: string[];
  explanation: string;
  analyzed_at: string;
}

export interface JobAnalysis {
  required_skills: string[];
  optional_skills: string[];
  experience_requirement: string;
  technical_complexity: 'Low' | 'Medium' | 'High';
  estimated_hours: number;
  step_count: number;
  communication_level: 'Low' | 'Medium' | 'High';
  deadline_pressure: 'Low' | 'Medium' | 'High';
  budget_quality: 'Low' | 'Fair' | 'High';
  client_expectations: string;
  analyzed_at: string;
}

export interface NormalizedJob {
  id: string;
  platform: string;
  platform_job_id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: JobBudget;
  experience_level: string;
  estimated_duration: string;
  deadline: string;
  posted_at: string;
  client: JobClient;
  competition: JobCompetition;
  communication_requirements: string[];
  requirements: string[];
  external_links: string[];
  source_data: Record<string, any>;
  collected_at: string;
  score?: JobScore;
  risk?: JobRisk;
  analysis?: JobAnalysis;
  user_action?: 'saved' | 'ignored' | null;
  ignore_reason?: string;
}

export interface ClaimsVerification {
  verified: boolean;
  skills_used: string[];
  unsupported_claims: string[];
  notes: string;
}

export interface Proposal {
  id?: string;
  job_id: string;
  user_id: string;
  version_number: number;
  style: 'direct' | 'friendly' | 'professional' | 'short';
  title: string;
  content: string;
  word_count: number;
  claims_verification: ClaimsVerification;
  addressed_requirements: string[];
  why_written: string;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  proposal_id?: string | null;
  status: 'discovered' | 'analyzed' | 'saved' | 'proposal_generated' | 'applied' | 'viewed' | 'interview' | 'hired' | 'rejected' | 'withdrawn';
  mode: 'manual' | 'assisted' | 'automatic';
  connect_cost: number;
  applied_at?: string | null;
  notes: string;
  outcome: 'pending' | 'won' | 'lost';
  created_at: string;
  updated_at: string;
  job_title?: string;
  platform?: string;
  category?: string;
  budget_max?: number;
  budget_type?: string;
  overall_score?: number;
  proposal_content?: string;
}

export interface UserSkill {
  id?: string;
  skill_name: string;
  category: string;
  proficiency_level: 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
  years_experience: number;
  verified: boolean;
}

export interface DifficultyWeights {
  skill_match: number;
  technical_complexity: number;
  experience_requirement: number;
  time_requirement: number;
  client_expectations: number;
  deadline: number;
  communication: number;
  budget: number;
  personal_skill: number;
}

export interface UserPreferences {
  preferred_categories: string[];
  excluded_keywords: string[];
  preferred_difficulty: string;
  min_budget: number;
  preferred_max_workload: string;
  preferred_duration: string;
  preferred_deadline: string;
  preferred_communication_level: string;
  preferred_max_tasks: number;
  difficulty_weights: DifficultyWeights;
  scoring_thresholds: { high_match: number; possible_match: number };
}

export interface UserCapabilityProfile {
  user_id: string;
  headline: string;
  bio: string;
  years_experience: number;
  hourly_rate: number;
  availability_hours_per_day: number;
  availability_days_per_week: number;
  preferred_working_hours: string;
  max_simultaneous_projects: number;
  skills: UserSkill[];
  preferences: UserPreferences;
}

export interface PlatformConnectionState {
  platformId: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  mode: 'LIVE' | 'MOCK' | 'UNAVAILABLE';
  capabilities: {
    job_search: boolean;
    job_details: boolean;
    client_details: boolean;
    applications: boolean;
    application_status: boolean;
  };
  lastSync?: string;
}

export interface AutomationSettings {
  id?: string;
  user_id: string;
  application_mode: 'MANUAL' | 'ASSISTED' | 'AUTOMATIC';
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

export interface NotificationItem {
  id: string;
  user_id: string;
  job_id?: string | null;
  channel: 'browser' | 'email' | 'telegram' | 'discord';
  title: string;
  body: string;
  match_score?: number;
  sent_at: string;
  read_at?: string | null;
  status: string;
}

export interface DashboardMetrics {
  jobs_discovered: number;
  high_matches: number;
  possible_matches: number;
  saved_jobs: number;
  applications: number;
  interviews: number;
  hires: number;
  rejections: number;
  average_match_score: number;
  total_connects_spent: number;
}

export interface AnalyticsSummary {
  metrics: DashboardMetrics;
  by_platform: { name: string; count: number }[];
  by_category: { name: string; count: number }[];
  by_difficulty: { name: string; count: number }[];
  by_proposal_style: { style: string; applications: number; interviews: number; hires: number }[];
  recent_activity: { date: string; action: string; job_title: string; platform: string }[];
}

export interface BankStatementReport {
  period_label: string;
  from_date: string;
  to_date: string;
  metrics: DashboardMetrics;
  platform_breakdown: { name: string; count: number }[];
  spending_summary: { total_connects: number; estimated_usd_cost: number };
  top_categories: string[];
  top_skills: string[];
  proposal_performance: { style: string; applications: number; interviews: number; conversion_rate: string }[];
  chronological_events: { timestamp: string; platform: string; job_title: string; action: string; score: number; cost: number }[];
}
