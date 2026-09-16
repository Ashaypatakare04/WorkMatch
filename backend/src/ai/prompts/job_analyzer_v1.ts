import { NormalizedJob } from '../../models/NormalizedJob.js';

export const JOB_ANALYZER_V1 = {
  name: 'job_analyzer',
  version: 'v1.0.0',
  render(job: NormalizedJob): string {
    return `[ANALYZE_JOB]
You are an expert technical recruiter and freelance task analyst.
Analyze the following freelance job posting and extract accurate structured information.

JOB DETAILS:
Title: ${job.title}
Platform: ${job.platform}
Category: ${job.category}
Stated Experience Level: ${job.experience_level}
Budget: ${job.budget.type} ${job.budget.min ?? ''} - ${job.budget.max ?? ''} ${job.budget.currency}
Stated Requirements: ${JSON.stringify(job.requirements)}
Communication Requirements: ${JSON.stringify(job.communication_requirements)}

DESCRIPTION:
${job.description}

Extract and return JSON adhering to this schema:
{
  "required_skills": string[],
  "optional_skills": string[],
  "experience_requirement": "Entry" | "Intermediate" | "Expert",
  "technical_complexity": "Low" | "Medium" | "High",
  "estimated_hours": number,
  "step_count": number,
  "communication_level": "Low" | "Medium" | "High",
  "deadline_pressure": "Low" | "Medium" | "High",
  "budget_quality": "Low" | "Fair" | "High",
  "client_expectations": string
}
`;
  }
};
