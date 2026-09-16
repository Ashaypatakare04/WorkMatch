import { NormalizedJob } from '../../models/NormalizedJob.js';
import { JobAnalysis } from '../../models/JobAnalysis.js';
import { UserCapabilityProfile, DifficultyWeights } from '../../models/UserCapabilityProfile.js';

export interface DifficultyAssessment {
  score: number; // 0 to 100 (where 100 is easiest/most accessible, 0 is very difficult)
  label: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  breakdown: Record<keyof DifficultyWeights, number>;
}

export class DifficultyCalculator {
  /**
   * Evaluates job difficulty relative to user's personalized weights and capabilities.
   * Higher score = easier job according to user preferences.
   */
  public static calculate(
    job: NormalizedJob,
    analysis: JobAnalysis,
    profile: UserCapabilityProfile
  ): DifficultyAssessment {
    const weights = profile.preferences.difficulty_weights;

    // Normalize weights to sum to 100
    const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0) || 100;
    const norm = (w: number) => (w / totalWeight);

    // 1. Skill match ease (0 - 100)
    const userSkills = profile.skills.map(s => s.skill_name.toLowerCase());
    const requiredSkills = analysis.required_skills.map(s => s.toLowerCase());
    const matchedCount = requiredSkills.filter(s =>
      userSkills.some(us => us.includes(s) || s.includes(us))
    ).length;
    const skillMatchEase = requiredSkills.length > 0
      ? Math.round((matchedCount / requiredSkills.length) * 100)
      : 80;

    // 2. Technical complexity ease (Low = 100, Medium = 65, High = 25)
    let complexityEase = 80;
    if (analysis.technical_complexity === 'Low') complexityEase = 95;
    else if (analysis.technical_complexity === 'Medium') complexityEase = 65;
    else if (analysis.technical_complexity === 'High') complexityEase = 25;

    // 3. Experience requirement ease
    let expEase = 80;
    const expReq = analysis.experience_requirement.toLowerCase();
    if (expReq.includes('entry') || expReq.includes('beginner')) expEase = 95;
    else if (expReq.includes('intermediate')) expEase = 65;
    else if (expReq.includes('expert') || expReq.includes('senior')) expEase = 25;

    // 4. Time requirement ease (<3 hours is easy, >15 hours is harder)
    let timeEase = 80;
    if (analysis.estimated_hours <= 3) timeEase = 95;
    else if (analysis.estimated_hours <= 8) timeEase = 75;
    else if (analysis.estimated_hours <= 20) timeEase = 50;
    else timeEase = 30;

    // 5. Client expectations ease
    let clientEase = 80;
    if (job.client.rating && job.client.rating >= 4.7) clientEase = 90;
    else if (job.client.rating && job.client.rating < 4.0) clientEase = 50;

    // 6. Deadline ease (Flexible/Low pressure = 95, Urgent/High pressure = 40)
    let deadlineEase = analysis.deadline_pressure === 'Low' ? 95 : (analysis.deadline_pressure === 'Medium' ? 70 : 40);

    // 7. Communication ease (Low = 95, Medium = 70, High = 40)
    let commEase = analysis.communication_level === 'Low' ? 95 : (analysis.communication_level === 'Medium' ? 70 : 40);

    // 8. Budget ease (Decent budget = higher score, low-ball = lower score)
    let budgetEase = 75;
    const jobBudget = job.budget.max || job.budget.min || 0;
    if (jobBudget >= profile.preferences.min_budget) budgetEase = 90;
    else if (jobBudget > 0) budgetEase = 50;

    // 9. Personal skill level ease (Expert skills boost ease)
    let personalSkillEase = 70;
    const relevantSkills = profile.skills.filter(s =>
      requiredSkills.some(rs => rs.includes(s.skill_name.toLowerCase()) || s.skill_name.toLowerCase().includes(rs))
    );
    if (relevantSkills.length > 0) {
      const avgExp = relevantSkills.reduce((acc, s) => {
        if (s.proficiency_level === 'Expert') return acc + 100;
        if (s.proficiency_level === 'Advanced') return acc + 85;
        if (s.proficiency_level === 'Intermediate') return acc + 70;
        return acc + 50;
      }, 0) / relevantSkills.length;
      personalSkillEase = Math.round(avgExp);
    }

    const breakdown: Record<keyof DifficultyWeights, number> = {
      skill_match: skillMatchEase,
      technical_complexity: complexityEase,
      experience_requirement: expEase,
      time_requirement: timeEase,
      client_expectations: clientEase,
      deadline: deadlineEase,
      communication: commEase,
      budget: budgetEase,
      personal_skill: personalSkillEase
    };

    // Calculate weighted sum
    const overallScore = Math.round(
      norm(weights.skill_match) * skillMatchEase +
      norm(weights.technical_complexity) * complexityEase +
      norm(weights.experience_requirement) * expEase +
      norm(weights.time_requirement) * timeEase +
      norm(weights.client_expectations) * clientEase +
      norm(weights.deadline) * deadlineEase +
      norm(weights.communication) * commEase +
      norm(weights.budget) * budgetEase +
      norm(weights.personal_skill) * personalSkillEase
    );

    let label: 'Easy' | 'Moderate' | 'Challenging' | 'Expert' = 'Moderate';
    if (overallScore >= 80) label = 'Easy';
    else if (overallScore >= 60) label = 'Moderate';
    else if (overallScore >= 40) label = 'Challenging';
    else label = 'Expert';

    return {
      score: overallScore,
      label,
      breakdown
    };
  }
}
