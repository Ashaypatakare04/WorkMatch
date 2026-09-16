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

export interface BreakdownItem {
  name: string;
  count: number;
  interviews?: number;
  hires?: number;
}

export interface AnalyticsSummary {
  metrics: DashboardMetrics;
  by_platform: BreakdownItem[];
  by_category: BreakdownItem[];
  by_difficulty: BreakdownItem[];
  by_proposal_style: { style: string; applications: number; interviews: number; hires: number }[];
  recent_activity: {
    date: string;
    action: string;
    job_title: string;
    platform: string;
  }[];
}

export interface BankStatementReport {
  period_label: string; // e.g., 'Last 30 Days'
  from_date: string;
  to_date: string;
  metrics: DashboardMetrics;
  platform_breakdown: BreakdownItem[];
  spending_summary: {
    total_connects: number;
    estimated_usd_cost: number;
  };
  top_categories: string[];
  top_skills: string[];
  proposal_performance: {
    style: string;
    applications: number;
    interviews: number;
    conversion_rate: string;
  }[];
  chronological_events: {
    timestamp: string;
    platform: string;
    job_title: string;
    action: string;
    score: number;
    cost: number;
  }[];
}
