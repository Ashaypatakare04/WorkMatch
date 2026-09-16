export type ProposalStyle = 'direct' | 'friendly' | 'professional' | 'short';

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
  style: ProposalStyle;
  title: string;
  content: string;
  word_count: number;
  claims_verification: ClaimsVerification;
  addressed_requirements: string[];
  why_written: string;
  created_at: string;
}
