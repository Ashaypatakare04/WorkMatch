import { Database } from '../../database/connection.js';

export interface LearnedInsights {
  accepted_patterns: string[];
  rejected_patterns: string[];
  preferred_budget_range: { min: number; max: number };
  preferred_difficulty: string;
  preferred_comm_level: string;
  insights: string[];
}

export class PersonalizationEngine {
  public static getLearnedInsights(userId: string): LearnedInsights {
    const row = Database.queryOne<any>('SELECT * FROM learned_preferences WHERE user_id = ?', [userId]);

    if (!row) {
      // Analyze current user actions in feedback table
      return PersonalizationEngine.refreshInsights(userId);
    }

    return {
      accepted_patterns: JSON.parse(row.accepted_patterns || '[]'),
      rejected_patterns: JSON.parse(row.rejected_patterns || '[]'),
      preferred_budget_range: JSON.parse(row.preferred_budget_range || '{"min":30,"max":150}'),
      preferred_difficulty: row.preferred_difficulty || 'Easy + Moderate',
      preferred_comm_level: row.preferred_comm_level || 'Low',
      insights: JSON.parse(row.insights || '[]')
    };
  }

  public static refreshInsights(userId: string): LearnedInsights {
    // Look at saved/applied jobs vs ignored/rejected jobs
    const positiveFeedback = Database.query<any>(
      `SELECT j.category, j.budget_max, fb.action
       FROM user_feedback fb
       JOIN jobs j ON fb.job_id = j.id
       WHERE fb.user_id = ? AND fb.action IN ('save', 'apply', 'interview', 'hire')`,
      [userId]
    );

    const negativeFeedback = Database.query<any>(
      `SELECT j.category, fb.reason, fb.action
       FROM user_feedback fb
       JOIN jobs j ON fb.job_id = j.id
       WHERE fb.user_id = ? AND fb.action IN ('reject', 'ignore')`,
      [userId]
    );

    const acceptedPatterns = Array.from(new Set(positiveFeedback.map(p => p.category))).slice(0, 5);
    const rejectedPatterns = Array.from(new Set(negativeFeedback.map(n => n.reason || n.category))).slice(0, 5);

    const insights: string[] = [];

    if (acceptedPatterns.length > 0) {
      insights.push(`You frequently accept and save opportunities in: ${acceptedPatterns.join(', ')}`);
    } else {
      insights.push('You show high affinity for Data Entry, Web Research, and structured verification tasks.');
    }

    if (rejectedPatterns.length > 0) {
      insights.push(`You frequently dismiss jobs citing: ${rejectedPatterns.join(', ')}`);
    } else {
      insights.push('You consistently filter out cold calling, telephone sales, and complex software builds.');
    }

    insights.push('You tend to prefer fixed-rate contracts between $30 and $150 with Low communication overhead.');

    const now = new Date().toISOString();
    Database.execute(
      `INSERT INTO learned_preferences (
        id, user_id, accepted_patterns, rejected_patterns, preferred_budget_range,
        preferred_difficulty, preferred_comm_level, insights, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        accepted_patterns = excluded.accepted_patterns,
        rejected_patterns = excluded.rejected_patterns,
        insights = excluded.insights,
        last_updated = excluded.last_updated`,
      [
        `lp_${userId}`,
        userId,
        JSON.stringify(acceptedPatterns.length > 0 ? acceptedPatterns : ['Data Entry', 'Web Research']),
        JSON.stringify(rejectedPatterns.length > 0 ? rejectedPatterns : ['Cold calling', 'High pressure sales']),
        JSON.stringify({ min: 30, max: 150 }),
        'Easy + Moderate',
        'Low',
        JSON.stringify(insights),
        now
      ]
    );

    return {
      accepted_patterns: acceptedPatterns.length > 0 ? acceptedPatterns : ['Data Entry', 'Web Research'],
      rejected_patterns: rejectedPatterns.length > 0 ? rejectedPatterns : ['Cold calling', 'Sales'],
      preferred_budget_range: { min: 30, max: 150 },
      preferred_difficulty: 'Easy + Moderate',
      preferred_comm_level: 'Low',
      insights
    };
  }
}
