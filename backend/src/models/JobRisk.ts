export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Needs Review';

export interface JobRisk {
  id?: string;
  job_id: string;
  risk_level: RiskLevel;
  risk_score: number; // 0 to 100
  warning_signals: string[];
  explanation: string;
  analyzed_at: string;
}
