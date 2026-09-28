/**
 * ============================================================================
 * WORKMATCH PROPOSAL GENERATOR & HUMANIZATION SUITE
 * ============================================================================
 *
 * ProposalGenerator is responsible for synthesizing customized proposals for
 * prospective contracts without sounding like a generic corporate bot.
 *
 * Core Workflow:
 * 1. AI Prompt Rendering: Formats the opportunity requirements and verified
 *    user inventory into the structured PROPOSAL_GENERATOR_V1 prompt.
 * 2. Variant Synthesis: Generates multiple distinct stylistic angles:
 *    - Direct: Concise, outcome-focused, immediate call-to-action.
 *    - Conversational: Friendly, rapport-building, casual tone.
 *    - Technical: Architectural breakdown, milestones, implementation details.
 *    - Detailed: Comprehensive project plan with risk mitigations.
 * 3. Humanizer Pass: Strips robotic AI boilerplate phrases ("Dear hiring manager",
 *    "delighted to submit", "testament to my skills", etc.) and inserts client names.
 * 4. Claim Verification Pass: Runs through ClaimVerifier to reject any hallucinated
 *    claims and sanitize inflated metrics before surfacing to the freelancer.
 */

import { NormalizedJob } from '../../models/NormalizedJob.js';
import { UserCapabilityProfile } from '../../models/UserCapabilityProfile.js';
import { Proposal, ProposalStyle } from '../../models/Proposal.js';
import { AIGateway } from '../gateway/AIGateway.js';
import { PROPOSAL_GENERATOR_V1 } from '../prompts/proposal_generator_v1.js';
import { ClaimVerifier } from './ClaimVerifier.js';
import { Humanizer } from './Humanizer.js';

export class ProposalGenerator {
  /**
   * Generates multiple stylized, humanized, and verified proposal variants for a job.
   *
   * @param job - The target normalized marketplace opportunity.
   * @param profile - The user's capability inventory and background.
   * @returns Array of Proposal objects ready for review, editing, and dispatch.
   */
  public static async generateVariants(
    job: NormalizedJob,
    profile: UserCapabilityProfile
  ): Promise<Proposal[]> {
    const prompt = PROPOSAL_GENERATOR_V1.render(job, profile);

    const result = await AIGateway.executePrompt<{
      proposals?: {
        style: ProposalStyle;
        title: string;
        content: string;
        word_count?: number;
        addressed_requirements?: string[];
      }[];
    }>({
      userId: profile.user_id,
      endpoint: '/ai/generate-proposals',
      promptName: PROPOSAL_GENERATOR_V1.name,
      promptVersion: PROPOSAL_GENERATOR_V1.version,
      renderedPrompt: prompt,
      isStructured: true,
      schemaDescription: 'ProposalVariantsSchema'
    });

    const rawProposals = result.data?.proposals || [];
    const finalProposals: Proposal[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < rawProposals.length; i++) {
      const raw = rawProposals[i];
      // 1. Humanize
      let humanized = Humanizer.humanize(raw.content, job.client.name);

      // 2. Strict Claim Verification Pass
      let verification = await ClaimVerifier.verify(humanized, profile);
      if (!verification.verified) {
        // Sanitize if any unsupported claims were caught
        humanized = ClaimVerifier.sanitize(humanized, profile);
        // Re-verify
        verification = await ClaimVerifier.verify(humanized, profile);
      }

      const words = humanized.split(/\s+/).filter(w => w.length > 0).length;

      finalProposals.push({
        job_id: job.id,
        user_id: profile.user_id,
        version_number: i + 1,
        style: raw.style,
        title: raw.title || `${raw.style.charAt(0).toUpperCase() + raw.style.slice(1)} Variant`,
        content: humanized,
        word_count: words,
        claims_verification: verification,
        addressed_requirements: raw.addressed_requirements || job.requirements.slice(0, 3),
        why_written: `Tailored for ${job.platform} client with emphasis on ${raw.style} tone, addressing ${job.category} deliverables.`,
        created_at: now
      });
    }

    return finalProposals;
  }
}
