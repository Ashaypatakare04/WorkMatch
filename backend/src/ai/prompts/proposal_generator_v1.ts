import { NormalizedJob } from '../../models/NormalizedJob.js';
import { UserCapabilityProfile } from '../../models/UserCapabilityProfile.js';

export const PROPOSAL_GENERATOR_V1 = {
  name: 'proposal_generator',
  version: 'v1.0.0',
  render(job: NormalizedJob, userProfile: UserCapabilityProfile, style: string = 'all'): string {
    const verifiedSkillsList = userProfile.skills
      .map(s => `${s.skill_name} (${s.proficiency_level}, ${s.years_experience} yrs exp)`)
      .join(', ');

    return `[GENERATE_PROPOSALS]
You are an expert freelance proposal consultant assisting a real freelancer.
Your task is to write high-converting, human, genuine, and concise proposals.

CRITICAL TRUTHFULNESS DIRECTIVES (STRICT COMPLIANCE REQUIRED):
1. NEVER invent experience, certifications, client history, or years of work.
2. ONLY reference skills explicitly listed in the USER's verified skills: [${verifiedSkillsList}].
3. If the user does not possess a specific tool or skill requested in the job, DO NOT claim they do.
4. Avoid generic AI cliches ("Dear Hiring Manager", "I am thrilled to submit my application", "In today's fast-paced world").
5. Reference specific details from the job description to demonstrate that the listing was carefully read.

JOB INFORMATION:
Title: ${job.title}
Platform: ${job.platform}
Category: ${job.category}
Client: ${job.client.name} from ${job.client.country}
Budget: ${job.budget.type} $${job.budget.min ?? ''} - $${job.budget.max ?? ''}
Requirements: ${JSON.stringify(job.requirements)}
Job Description:
${job.description}

USER PROFILE:
Headline: ${userProfile.headline}
Bio: ${userProfile.bio}
Hourly Rate: $${userProfile.hourly_rate}
Verified Skills: ${verifiedSkillsList}

TASK:
Generate 4 distinct proposal variants:
- "direct": Action-oriented, focuses immediately on solution and speed (50-90 words).
- "friendly": Warm, collaborative, communicative, and enthusiastic (60-110 words).
- "professional": Structured, methodical, focusing on standards and accuracy (60-120 words).
- "short": Ultra-concise, quick confirmation of competence and readiness (30-60 words).

Return JSON schema:
{
  "proposals": [
    {
      "style": "direct" | "friendly" | "professional" | "short",
      "title": string,
      "content": string,
      "word_count": number,
      "addressed_requirements": string[]
    }
  ]
}
`;
  }
};
