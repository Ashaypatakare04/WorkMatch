import { UserCapabilityProfile } from '../../models/UserCapabilityProfile.js';

export const CLAIM_VERIFIER_V1 = {
  name: 'claim_verifier',
  version: 'v1.0.0',
  render(proposalContent: string, userProfile: UserCapabilityProfile): string {
    const verifiedSkills = userProfile.skills.map(s => s.skill_name);

    return `[VERIFY_CLAIMS]
You are a strict compliance and audit agent.
Your sole job is to inspect the proposal text below and verify that EVERY claim made about the freelancer is completely true and backed by their verified profile.

VERIFIED USER PROFILE:
Verified Skills: ${JSON.stringify(verifiedSkills)}
Total Years Experience: ${userProfile.years_experience}
Headline: ${userProfile.headline}
Bio: ${userProfile.bio}

PROPOSAL TO INSPECT:
"""
${proposalContent}
"""

AUDIT RULES:
1. If the proposal mentions specific skills or software, verify if they exist in the verified skills list.
2. If the proposal claims years of experience (e.g. "I have 5 years of experience"), verify it does not exceed ${userProfile.years_experience}.
3. Flag any unsupported claims, fictional past clients, or fabricated portfolio assertions.

Return JSON schema:
{
  "verified": boolean,
  "skills_used": string[],
  "unsupported_claims": string[],
  "notes": string
}
`;
  }
};
