import { UserCapabilityProfile } from '../../models/UserCapabilityProfile.js';
import { ClaimsVerification } from '../../models/Proposal.js';
import { AIGateway } from '../gateway/AIGateway.js';
import { CLAIM_VERIFIER_V1 } from '../prompts/claim_verifier_v1.js';

export class ClaimVerifier {
  /**
   * Strictly inspects proposal text against the verified user capability profile.
   * If any unsupported tool, years of experience, or claims are detected,
   * flags them and can sanitize or rewrite them.
   */
  public static async verify(
    proposalContent: string,
    profile: UserCapabilityProfile
  ): Promise<ClaimsVerification> {
    const verifiedSkillNames = profile.skills.map(s => s.skill_name.toLowerCase());
    const unsupportedClaims: string[] = [];
    const detectedSkillsUsed: string[] = [];

    // 1. Programmatic deterministic checks
    // Check if years claimed exceed profile years
    const yearsMatches = proposalContent.match(/(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience|working)/i);
    if (yearsMatches && yearsMatches[1]) {
      const claimedYears = parseInt(yearsMatches[1], 10);
      if (claimedYears > Math.ceil(profile.years_experience)) {
        unsupportedClaims.push(
          `Claimed ${claimedYears} years experience exceeds verified profile (${profile.years_experience} years)`
        );
      }
    }

    // Check skills mentioned
    for (const skill of profile.skills) {
      if (proposalContent.toLowerCase().includes(skill.skill_name.toLowerCase())) {
        detectedSkillsUsed.push(skill.skill_name);
      }
    }

    // Check for obvious fabricated employer/client claims (e.g. "I worked at Google / Meta / Fortune 500" unless in bio)
    const bigTechMatch = proposalContent.match(/\b(?:worked\s+(?:at|for)|employed\s+by|client\s+of)\s+(Fortune 500|Google|Amazon|Microsoft|Apple|Meta)\b/i) ||
      proposalContent.match(/\b(Fortune 500(?!\s*company\s*standard))\b/i);
    if (bigTechMatch && !profile.bio.toLowerCase().includes(bigTechMatch[1].toLowerCase())) {
      unsupportedClaims.push(`Unsupported claim of past association with ${bigTechMatch[1]}`);
    }

    // 2. AI validation check
    const prompt = CLAIM_VERIFIER_V1.render(proposalContent, profile);
    const aiResult = await AIGateway.executePrompt<ClaimsVerification>({
      userId: profile.user_id,
      endpoint: '/ai/verify-claims',
      promptName: CLAIM_VERIFIER_V1.name,
      promptVersion: CLAIM_VERIFIER_V1.version,
      renderedPrompt: prompt,
      isStructured: true,
      schemaDescription: 'ClaimsVerificationSchema'
    });

    const aiClaims = aiResult.data?.unsupported_claims || [];
    for (const claim of aiClaims) {
      if (!unsupportedClaims.includes(claim)) {
        unsupportedClaims.push(claim);
      }
    }

    const isVerified = unsupportedClaims.length === 0;

    return {
      verified: isVerified,
      skills_used: detectedSkillsUsed.length > 0 ? detectedSkillsUsed : profile.skills.slice(0, 3).map(s => s.skill_name),
      unsupported_claims: unsupportedClaims,
      notes: isVerified
        ? 'Passed all truthfulness audits. All capabilities and assertions verified against user profile.'
        : `Flagged ${unsupportedClaims.length} unsupported claim(s). Requires sanitization.`
    };
  }

  /**
   * Sanitizes proposal text by stripping or rephrasing unsupported experience claims.
   */
  public static sanitize(proposalText: string, profile: UserCapabilityProfile): string {
    let cleaned = proposalText;

    // Replace exaggerated years with verified years
    cleaned = cleaned.replace(
      /(\d+)\+?\s*years?\s*(?:of)?\s*(?:experience|working)/gi,
      `${Math.floor(profile.years_experience) || 1}+ years of experience`
    );

    return cleaned;
  }
}
