import { Database } from '../database/connection.js';
import { User } from '../models/User.js';
import {
  UserCapabilityProfile,
  UserPreferences,
  UserSkill,
  DEFAULT_DIFFICULTY_WEIGHTS,
  DEFAULT_SCORING_THRESHOLDS
} from '../models/UserCapabilityProfile.js';

export class UserRepository {
  public static create(user: Omit<User, 'id' | 'created_at' | 'updated_at'> & { id: string }): User {
    const now = new Date().toISOString();
    Database.execute(
      `INSERT INTO users (id, email, password_hash, full_name, is_admin, plan_type, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.password_hash || '', user.full_name, user.is_admin ? 1 : 0, user.plan_type, now, now]
    );

    // Initialize default profile
    Database.execute(
      `INSERT INTO user_profiles (id, user_id, headline, bio, years_experience, hourly_rate, availability_hours_per_day, availability_days_per_week, preferred_working_hours, max_simultaneous_projects, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `prof_${user.id}`,
        user.id,
        'Versatile Freelance Professional',
        'Specializing in high-attention detail tasks, research, data operations, and technical assistance.',
        2.5,
        25.0,
        4.0,
        5,
        'Flexible',
        3,
        now,
        now
      ]
    );

    // Initialize default preferences
    Database.execute(
      `INSERT INTO user_preferences (id, user_id, preferred_categories, excluded_keywords, preferred_difficulty, min_budget, preferred_max_workload, preferred_duration, preferred_deadline, preferred_communication_level, preferred_max_tasks, difficulty_weights, scoring_thresholds, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `pref_${user.id}`,
        user.id,
        JSON.stringify(['Data Entry', 'Web Research', 'Virtual Assistant', 'Testing']),
        JSON.stringify(['Cold calling', 'Telemarketing', 'High pressure sales']),
        'Easy + Moderate',
        20.0,
        'Part-time',
        'Short-term',
        'Flexible',
        'Low',
        5,
        JSON.stringify(DEFAULT_DIFFICULTY_WEIGHTS),
        JSON.stringify(DEFAULT_SCORING_THRESHOLDS),
        now
      ]
    );

    // Initialize default automation settings
    Database.execute(
      `INSERT INTO automation_settings (id, user_id, application_mode, is_active, emergency_stop, max_daily_applications, max_hourly_applications, min_match_score, max_connect_cost, allowed_categories, excluded_categories, max_budget_limit, require_low_risk_only, applications_today_count, last_reset_date, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `auto_${user.id}`,
        user.id,
        'MANUAL',
        0,
        0,
        5,
        2,
        85,
        6,
        JSON.stringify([]),
        JSON.stringify([]),
        500.0,
        1,
        0,
        now.slice(0, 10),
        now
      ]
    );

    // Initialize notification preferences
    Database.execute(
      `INSERT INTO notification_preferences (id, user_id, browser_enabled, email_enabled, telegram_enabled, discord_enabled, min_score_threshold, alert_high_risk, quiet_hours_start, quiet_hours_end, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [`notifpref_${user.id}`, user.id, 1, 0, 0, 0, 85.0, 1, '22:00', '08:00', now]
    );

    return UserRepository.findById(user.id)!;
  }

  public static findByEmail(email: string): User | null {
    const row = Database.queryOne<any>('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash,
      full_name: row.full_name,
      is_admin: Boolean(row.is_admin),
      plan_type: row.plan_type,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  public static findById(id: string): User | null {
    const row = Database.queryOne<any>('SELECT * FROM users WHERE id = ?', [id]);
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      is_admin: Boolean(row.is_admin),
      plan_type: row.plan_type,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  public static getProfile(userId: string): UserCapabilityProfile | null {
    const profRow = Database.queryOne<any>('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    if (!profRow) return null;

    const prefRow = Database.queryOne<any>('SELECT * FROM user_preferences WHERE user_id = ?', [userId]);
    const skillsRows = Database.query<any>('SELECT * FROM user_skills WHERE user_id = ? ORDER BY skill_name ASC', [userId]);

    const skills: UserSkill[] = skillsRows.map(r => ({
      id: r.id,
      skill_name: r.skill_name,
      category: r.category,
      proficiency_level: r.proficiency_level,
      years_experience: Number(r.years_experience),
      verified: Boolean(r.verified)
    }));

    const preferences: UserPreferences = prefRow
      ? {
          preferred_categories: JSON.parse(prefRow.preferred_categories || '[]'),
          excluded_keywords: JSON.parse(prefRow.excluded_keywords || '[]'),
          preferred_difficulty: prefRow.preferred_difficulty,
          min_budget: Number(prefRow.min_budget),
          preferred_max_workload: prefRow.preferred_max_workload,
          preferred_duration: prefRow.preferred_duration,
          preferred_deadline: prefRow.preferred_deadline,
          preferred_communication_level: prefRow.preferred_communication_level,
          preferred_max_tasks: Number(prefRow.preferred_max_tasks),
          difficulty_weights: JSON.parse(prefRow.difficulty_weights || JSON.stringify(DEFAULT_DIFFICULTY_WEIGHTS)),
          scoring_thresholds: JSON.parse(prefRow.scoring_thresholds || JSON.stringify(DEFAULT_SCORING_THRESHOLDS))
        }
      : {
          preferred_categories: [],
          excluded_keywords: [],
          preferred_difficulty: 'Easy + Moderate',
          min_budget: 20,
          preferred_max_workload: 'Part-time',
          preferred_duration: 'Short-term',
          preferred_deadline: 'Flexible',
          preferred_communication_level: 'Low',
          preferred_max_tasks: 5,
          difficulty_weights: DEFAULT_DIFFICULTY_WEIGHTS,
          scoring_thresholds: DEFAULT_SCORING_THRESHOLDS
        };

    return {
      user_id: userId,
      headline: profRow.headline,
      bio: profRow.bio,
      years_experience: Number(profRow.years_experience),
      hourly_rate: Number(profRow.hourly_rate),
      availability_hours_per_day: Number(profRow.availability_hours_per_day),
      availability_days_per_week: Number(profRow.availability_days_per_week),
      preferred_working_hours: profRow.preferred_working_hours,
      max_simultaneous_projects: Number(profRow.max_simultaneous_projects),
      skills,
      preferences
    };
  }

  public static updateProfile(userId: string, data: Partial<UserCapabilityProfile>): void {
    const now = new Date().toISOString();
    Database.execute(
      `UPDATE user_profiles
       SET headline = COALESCE(?, headline),
           bio = COALESCE(?, bio),
           years_experience = COALESCE(?, years_experience),
           hourly_rate = COALESCE(?, hourly_rate),
           availability_hours_per_day = COALESCE(?, availability_hours_per_day),
           availability_days_per_week = COALESCE(?, availability_days_per_week),
           preferred_working_hours = COALESCE(?, preferred_working_hours),
           max_simultaneous_projects = COALESCE(?, max_simultaneous_projects),
           updated_at = ?
       WHERE user_id = ?`,
      [
        data.headline ?? null,
        data.bio ?? null,
        data.years_experience ?? null,
        data.hourly_rate ?? null,
        data.availability_hours_per_day ?? null,
        data.availability_days_per_week ?? null,
        data.preferred_working_hours ?? null,
        data.max_simultaneous_projects ?? null,
        now,
        userId
      ]
    );

    if (data.skills) {
      UserRepository.setSkills(userId, data.skills);
    }

    if (data.preferences) {
      UserRepository.updatePreferences(userId, data.preferences);
    }
  }

  public static setSkills(userId: string, skills: UserSkill[]): void {
    Database.transaction(() => {
      Database.execute('DELETE FROM user_skills WHERE user_id = ?', [userId]);
      const now = new Date().toISOString();
      for (const skill of skills) {
        Database.execute(
          `INSERT INTO user_skills (id, user_id, skill_name, category, proficiency_level, years_experience, verified, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            userId,
            skill.skill_name.trim(),
            skill.category || 'General',
            skill.proficiency_level,
            skill.years_experience || 1.0,
            skill.verified !== false ? 1 : 0,
            now
          ]
        );
      }
    });
  }

  public static updatePreferences(userId: string, preferences: Partial<UserPreferences>): void {
    const now = new Date().toISOString();
    const current = UserRepository.getProfile(userId)?.preferences;

    const updated: UserPreferences = {
      preferred_categories: preferences.preferred_categories ?? current?.preferred_categories ?? [],
      excluded_keywords: preferences.excluded_keywords ?? current?.excluded_keywords ?? [],
      preferred_difficulty: preferences.preferred_difficulty ?? current?.preferred_difficulty ?? 'Easy + Moderate',
      min_budget: preferences.min_budget ?? current?.min_budget ?? 20,
      preferred_max_workload: preferences.preferred_max_workload ?? current?.preferred_max_workload ?? 'Part-time',
      preferred_duration: preferences.preferred_duration ?? current?.preferred_duration ?? 'Short-term',
      preferred_deadline: preferences.preferred_deadline ?? current?.preferred_deadline ?? 'Flexible',
      preferred_communication_level: preferences.preferred_communication_level ?? current?.preferred_communication_level ?? 'Low',
      preferred_max_tasks: preferences.preferred_max_tasks ?? current?.preferred_max_tasks ?? 5,
      difficulty_weights: preferences.difficulty_weights ?? current?.difficulty_weights ?? DEFAULT_DIFFICULTY_WEIGHTS,
      scoring_thresholds: preferences.scoring_thresholds ?? current?.scoring_thresholds ?? DEFAULT_SCORING_THRESHOLDS
    };

    Database.execute(
      `UPDATE user_preferences
       SET preferred_categories = ?,
           excluded_keywords = ?,
           preferred_difficulty = ?,
           min_budget = ?,
           preferred_max_workload = ?,
           preferred_duration = ?,
           preferred_deadline = ?,
           preferred_communication_level = ?,
           preferred_max_tasks = ?,
           difficulty_weights = ?,
           scoring_thresholds = ?,
           updated_at = ?
       WHERE user_id = ?`,
      [
        JSON.stringify(updated.preferred_categories),
        JSON.stringify(updated.excluded_keywords),
        updated.preferred_difficulty,
        updated.min_budget,
        updated.preferred_max_workload,
        updated.preferred_duration,
        updated.preferred_deadline,
        updated.preferred_communication_level,
        updated.preferred_max_tasks,
        JSON.stringify(updated.difficulty_weights),
        JSON.stringify(updated.scoring_thresholds),
        now,
        userId
      ]
    );
  }
}
