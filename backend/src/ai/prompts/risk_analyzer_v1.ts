import { NormalizedJob } from '../../models/NormalizedJob.js';

export const RISK_ANALYZER_V1 = {
  name: 'risk_analyzer',
  version: 'v1.0.0',
  render(job: NormalizedJob): string {
    return `[ANALYZE_RISK]
You are a platform compliance and fraud detection specialist for work opportunities.
Inspect the following job posting for scam patterns, warning signals, and safety flags.

POTENTIAL SIGNALS TO CHECK:
1. Unclear, nonsensical, or contradictory requirements
2. Unrealistic compensation (e.g., $1000 for 10 minutes of copying text)
3. Requests to move off-platform (Telegram, WhatsApp, external email)
4. Requests for sensitive credentials, bank accounts, or identity documents
5. Suspicious or obfuscated external links
6. Requests for extensive free work or unpaid test samples
7. Vague client behavior or newly created unverified accounts

JOB DETAILS:
Title: ${job.title}
Platform: ${job.platform}
Budget: ${job.budget.type} $${job.budget.min ?? ''} - $${job.budget.max ?? ''}
Client: ${job.client.name} (${job.client.country}), Rating: ${job.client.rating}, Reviews: ${job.client.reviews}, Hire Rate: ${job.client.hire_rate}%
External Links: ${JSON.stringify(job.external_links)}
Description:
${job.description}

Return JSON with this schema:
{
  "risk_level": "Low" | "Medium" | "High" | "Needs Review",
  "risk_score": number (0 to 100, where 0 is pristine safety and 100 is definite scam),
  "warning_signals": string[],
  "explanation": string
}
`;
  }
};
