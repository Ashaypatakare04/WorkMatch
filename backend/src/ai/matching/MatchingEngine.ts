import { NormalizedJob } from '../../models/NormalizedJob.js';
import { JobAnalysis } from '../../models/JobAnalysis.js';
import { JobRisk } from '../../models/JobRisk.js';
import { UserCapabilityProfile } from '../../models/UserCapabilityProfile.js';
import { JobScore, ScoreExplanation } from '../../models/JobScore.js';
import { DifficultyCalculator } from './DifficultyCalculator.js';

export class MatchingEngine {
  public static match(
    job: NormalizedJob,
    analysis: JobAnalysis,
    risk: JobRisk,
    profile: UserCapabilityProfile
  ): JobScore {
    const userSkills = profile.skills.map(s => s.skill_name.toLowerCase());
    const requiredSkills = analysis.required_skills.map(s => s.toLowerCase());

    // 1. Skill Match & Identification
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const req of analysis.required_skills) {
      const isMatched = userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us));
      if (isMatched) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    const skillRatio = analysis.required_skills.length > 0
      ? matchedSkills.length / analysis.required_skills.length
      : 0.8;
    const skillScore = Math.round(skillRatio * 100);

    // 2. Experience Match
    let experienceScore = 85;
    const expReq = (analysis.experience_requirement || '').toLowerCase();
    if (expReq.includes('expert') && profile.years_experience < 4) {
      experienceScore = 60;
    } else if (expReq.includes('intermediate') && profile.years_experience < 1.5) {
      experienceScore = 70;
    } else {
      experienceScore = 95;
    }

    // 3. Difficulty Match (using DifficultyCalculator)
    const difficultyAssessment = DifficultyCalculator.calculate(job, analysis, profile);
    const difficultyScore = difficultyAssessment.score;

    // 4. Budget Match
    let budgetScore = 80;
    const jobBudget = job.budget?.max || job.budget?.min || 0;
    if (jobBudget >= profile.preferences.min_budget * 1.5) {
      budgetScore = 95;
    } else if (jobBudget >= profile.preferences.min_budget) {
      budgetScore = 85;
    } else if (jobBudget > 0) {
      budgetScore = 55;
    }

    // 5. Time Match (hours per day/project limits)
    let timeScore = 85;
    const estHours = analysis.estimated_hours || 2;
    if (estHours <= profile.availability_hours_per_day) {
      timeScore = 95;
    } else if (estHours <= profile.availability_hours_per_day * 2) {
      timeScore = 80;
    } else {
      timeScore = 60;
    }

    // 6. Communication Match
    let communicationScore = 90;
    if (profile.preferences.preferred_communication_level === 'Low') {
      if (analysis.communication_level === 'Low') communicationScore = 98;
      else if (analysis.communication_level === 'Medium') communicationScore = 75;
      else communicationScore = 50;
    } else {
      communicationScore = 90;
    }

    // 7. Preference & Exclusion Match
    let preferenceScore = 90;
    const lowerTitle = (job.title || '').toLowerCase();
    const lowerDesc = (job.description || '').toLowerCase();
    const whyMatches: string[] = [];
    const whyNotMatches: string[] = [];
    const concerns: string[] = [];
    let hasExcludedKeyword = false;

    // Check excluded keywords
    for (const excl of profile.preferences.excluded_keywords || []) {
      const lowerExcl = excl.toLowerCase();
      if (lowerTitle.includes(lowerExcl) || lowerDesc.includes(lowerExcl)) {
        hasExcludedKeyword = true;
        preferenceScore -= 45;
        whyNotMatches.push(`Contains excluded term: "${excl}"`);
        concerns.push(`Matches explicit exclusion rule for "${excl}"`);
      }
    }

    // Check category preference
    const jobCategory = job.category || '';
    const catMatched = (profile.preferences.preferred_categories || []).some(cat =>
      jobCategory.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(jobCategory.toLowerCase())
    );
    if (catMatched) {
      preferenceScore = Math.min(100, preferenceScore + 10);
      whyMatches.push(`Category "${jobCategory}" matches your preferred categories`);
    } else if ((profile.preferences.preferred_categories || []).length > 0) {
      preferenceScore -= 15;
      whyNotMatches.push(`Category "${jobCategory}" is outside your primary target categories`);
    }

    // 8. Client Quality
    let clientQualityScore = 75;
    const clientRating = job.client?.rating;
    const clientReviews = job.client?.reviews || 0;
    if (clientRating && clientRating >= 4.8 && clientReviews >= 5) {
      clientQualityScore = 95;
      whyMatches.push(`Established client with strong ${clientRating}★ rating and ${clientReviews} reviews`);
    } else if (clientRating && clientRating < 4.0) {
      clientQualityScore = 45;
      concerns.push(`Client has below-average rating (${clientRating}★)`);
    }

    // Highlight matched skills
    if (matchedSkills.length > 0) {
      whyMatches.push(`Skills match your profile: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
    if (missingSkills.length > 0) {
      whyNotMatches.push(`Requires unlisted skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }

    // Highlight communication & workload
    if (analysis.communication_level === 'Low') {
      whyMatches.push('Low communication overhead fits your preferred working mode');
    }
    if (risk.risk_level === 'High') {
      concerns.push(`High risk signals flagged: ${risk.warning_signals.join('; ')}`);
    }

    // 9. Overall Weighted Score (0 to 100)
    // Formula balances skill competence (30%), preference fit (20%), difficulty ease (20%), budget (15%), client (15%)
    let overallScore = Math.round(
      (skillScore * 0.30) +
      (preferenceScore * 0.20) +
      (difficultyScore * 0.20) +
      (budgetScore * 0.15) +
      (clientQualityScore * 0.15)
    );

    // Apply exclusion keyword cap
    if (hasExcludedKeyword) {
      overallScore = Math.min(overallScore, 40);
    }

    // Apply risk penalty
    if (risk.risk_level === 'High') {
      overallScore = Math.min(overallScore, 45);
    } else if (risk.risk_level === 'Medium') {
      overallScore = Math.min(overallScore, 75);
    }

    overallScore = Math.max(0, Math.min(100, overallScore));

    const explanation: ScoreExplanation = {
      why_matches: whyMatches,
      why_not_matches: whyNotMatches,
      concerns,
      estimated_effort: `Estimated ~${analysis.estimated_hours || 2} hours (${difficultyAssessment.label} difficulty)`,
      potential_value: job.budget?.max
        ? `$${job.budget.max} (${job.budget?.type || 'fixed'}) with ${job.client?.country || 'Global'} client`
        : `Competitive ${job.budget?.type || 'project'} rate`
    };

    return {
      job_id: job.id,
      user_id: profile.user_id,
      overall_score: overallScore,
      skill_score: skillScore,
      experience_score: experienceScore,
      difficulty_score: difficultyScore,
      budget_score: budgetScore,
      time_score: timeScore,
      communication_score: communicationScore,
      preference_score: Math.max(0, preferenceScore),
      client_quality_score: clientQualityScore,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      explanation,
      scored_at: new Date().toISOString()
    };
  }
}
