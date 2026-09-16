import { Database } from '../database/connection.js';
import { NormalizedJob, generateJobHash } from '../models/NormalizedJob.js';
import { JobAnalysis } from '../models/JobAnalysis.js';
import { JobScore } from '../models/JobScore.js';
import { JobRisk } from '../models/JobRisk.js';

export interface JobFilterOptions {
  platform?: string;
  category?: string;
  minScore?: number;
  maxScore?: number;
  difficulty?: string;
  minBudget?: number;
  maxBudget?: number;
  riskLevel?: string;
  status?: 'all' | 'saved' | 'ignored' | 'active';
  query?: string;
  sortBy?: 'best_match' | 'newest' | 'highest_budget' | 'lowest_competition' | 'lowest_difficulty';
  limit?: number;
  offset?: number;
}

export class JobRepository {
  public static insertJob(job: NormalizedJob): { inserted: boolean; id: string } {
    const hash = job.hash || generateJobHash(job);
    const existing = Database.queryOne<{ id: string }>('SELECT id FROM jobs WHERE hash = ?', [hash]);
    if (existing) {
      return { inserted: false, id: existing.id };
    }

    Database.execute(
      `INSERT INTO jobs (
        id, platform, platform_job_id, url, title, description, category,
        budget_type, budget_min, budget_max, budget_currency, experience_level,
        estimated_duration, deadline, posted_at, client_name, client_country,
        client_rating, client_reviews_count, client_jobs_posted, client_jobs_hired,
        client_hire_rate, proposal_count, communication_requirements, requirements,
        external_links, source_data, hash, collected_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job.id,
        job.platform,
        job.platform_job_id,
        job.url,
        job.title,
        job.description,
        job.category,
        job.budget.type,
        job.budget.min,
        job.budget.max,
        job.budget.currency || 'USD',
        job.experience_level,
        job.estimated_duration,
        job.deadline,
        job.posted_at,
        job.client.name,
        job.client.country,
        job.client.rating,
        job.client.reviews,
        job.client.jobs_posted,
        job.client.jobs_hired,
        job.client.hire_rate,
        job.competition.proposal_count || 0,
        JSON.stringify(job.communication_requirements || []),
        JSON.stringify(job.requirements || []),
        JSON.stringify(job.external_links || []),
        JSON.stringify(job.source_data || {}),
        hash,
        job.collected_at
      ]
    );

    return { inserted: true, id: job.id };
  }

  public static insertBatch(jobs: NormalizedJob[]): { insertedCount: number; duplicateCount: number } {
    let insertedCount = 0;
    let duplicateCount = 0;

    Database.transaction(() => {
      for (const job of jobs) {
        const res = JobRepository.insertJob(job);
        if (res.inserted) {
          insertedCount++;
        } else {
          duplicateCount++;
        }
      }
    });

    return { insertedCount, duplicateCount };
  }

  public static findById(id: string): NormalizedJob | null {
    const r = Database.queryOne<any>('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!r) return null;
    return JobRepository.mapRowToNormalizedJob(r);
  }

  public static findByHash(hash: string): NormalizedJob | null {
    const r = Database.queryOne<any>('SELECT * FROM jobs WHERE hash = ?', [hash]);
    if (!r) return null;
    return JobRepository.mapRowToNormalizedJob(r);
  }

  public static listJobs(userId: string, filter: JobFilterOptions = {}): {
    jobs: (NormalizedJob & {
      score?: JobScore;
      risk?: JobRisk;
      analysis?: JobAnalysis;
      user_action?: 'saved' | 'ignored' | null;
      ignore_reason?: string;
    })[];
    total: number;
  } {
    let whereClauses: string[] = ['1=1'];
    let params: any[] = [];

    // Filter by platform
    if (filter.platform && filter.platform !== 'all') {
      whereClauses.push('j.platform = ?');
      params.push(filter.platform);
    }

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      whereClauses.push('j.category = ?');
      params.push(filter.category);
    }

    // Filter by min budget
    if (filter.minBudget !== undefined && filter.minBudget > 0) {
      whereClauses.push('(j.budget_max >= ? OR j.budget_min >= ?)');
      params.push(filter.minBudget, filter.minBudget);
    }

    // Filter by text search query
    if (filter.query && filter.query.trim().length > 0) {
      whereClauses.push('(j.title LIKE ? OR j.description LIKE ? OR j.category LIKE ?)');
      const q = `%${filter.query.trim()}%`;
      params.push(q, q, q);
    }

    // Filter by status (saved / ignored / active)
    if (filter.status === 'saved') {
      whereClauses.push('sj.status = "saved"');
    } else if (filter.status === 'ignored') {
      whereClauses.push('sj.status = "ignored"');
    } else if (filter.status === 'active') {
      whereClauses.push('(sj.status IS NULL OR sj.status != "ignored")');
    }

    // Filter by score thresholds
    if (filter.minScore !== undefined) {
      whereClauses.push('COALESCE(js.overall_score, 0) >= ?');
      params.push(filter.minScore);
    }
    if (filter.maxScore !== undefined) {
      whereClauses.push('COALESCE(js.overall_score, 0) <= ?');
      params.push(filter.maxScore);
    }

    // Filter by risk level
    if (filter.riskLevel && filter.riskLevel !== 'all') {
      whereClauses.push('jr.risk_level = ?');
      params.push(filter.riskLevel);
    }

    // Sorting
    let orderBy = 'j.posted_at DESC';
    if (filter.sortBy === 'best_match') {
      orderBy = 'COALESCE(js.overall_score, 0) DESC, j.posted_at DESC';
    } else if (filter.sortBy === 'newest') {
      orderBy = 'j.posted_at DESC';
    } else if (filter.sortBy === 'highest_budget') {
      orderBy = 'COALESCE(j.budget_max, j.budget_min, 0) DESC';
    } else if (filter.sortBy === 'lowest_competition') {
      orderBy = 'COALESCE(j.proposal_count, 0) ASC';
    } else if (filter.sortBy === 'lowest_difficulty') {
      orderBy = 'COALESCE(js.difficulty_score, 0) DESC';
    }

    const whereSql = whereClauses.join(' AND ');

    // Count query
    const countSql = `
      SELECT COUNT(*) as cnt
      FROM jobs j
      LEFT JOIN job_scores js ON j.id = js.job_id AND js.user_id = ?
      LEFT JOIN job_risks jr ON j.id = jr.job_id
      LEFT JOIN saved_jobs sj ON j.id = sj.job_id AND sj.user_id = ?
      WHERE ${whereSql}
    `;
    const countRow = Database.queryOne<{ cnt: number }>(countSql, [userId, userId, ...params]);
    const total = countRow ? countRow.cnt : 0;

    // Data query
    const limit = filter.limit || 50;
    const offset = filter.offset || 0;

    const dataSql = `
      SELECT
        j.*,
        js.id as score_id, js.overall_score, js.skill_score, js.experience_score,
        js.difficulty_score, js.budget_score, js.time_score, js.communication_score,
        js.preference_score, js.client_quality_score, js.matched_skills, js.missing_skills,
        js.explanation as score_explanation, js.scored_at,
        jr.risk_level, jr.risk_score, jr.warning_signals, jr.explanation as risk_explanation,
        ja.required_skills, ja.optional_skills, ja.experience_requirement,
        ja.technical_complexity, ja.estimated_hours, ja.step_count,
        ja.communication_level, ja.deadline_pressure, ja.budget_quality,
        ja.client_expectations, ja.analyzed_at,
        sj.status as user_action, sj.reason as ignore_reason
      FROM jobs j
      LEFT JOIN job_scores js ON j.id = js.job_id AND js.user_id = ?
      LEFT JOIN job_risks jr ON j.id = jr.job_id
      LEFT JOIN job_analyses ja ON j.id = ja.job_id
      LEFT JOIN saved_jobs sj ON j.id = sj.job_id AND sj.user_id = ?
      WHERE ${whereSql}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const rows = Database.query<any>(dataSql, [userId, userId, ...params, limit, offset]);

    const jobs = rows.map(r => {
      const job = JobRepository.mapRowToNormalizedJob(r);
      const score: JobScore | undefined = r.score_id
        ? {
            id: r.score_id,
            job_id: r.id,
            user_id: userId,
            overall_score: Number(r.overall_score),
            skill_score: Number(r.skill_score),
            experience_score: Number(r.experience_score),
            difficulty_score: Number(r.difficulty_score),
            budget_score: Number(r.budget_score),
            time_score: Number(r.time_score),
            communication_score: Number(r.communication_score),
            preference_score: Number(r.preference_score),
            client_quality_score: Number(r.client_quality_score),
            matched_skills: JSON.parse(r.matched_skills || '[]'),
            missing_skills: JSON.parse(r.missing_skills || '[]'),
            explanation: JSON.parse(r.score_explanation || '{}'),
            scored_at: r.scored_at
          }
        : undefined;

      const risk: JobRisk | undefined = r.risk_level
        ? {
            job_id: r.id,
            risk_level: r.risk_level,
            risk_score: Number(r.risk_score),
            warning_signals: JSON.parse(r.warning_signals || '[]'),
            explanation: r.risk_explanation || '',
            analyzed_at: r.analyzed_at || ''
          }
        : undefined;

      const analysis: JobAnalysis | undefined = r.technical_complexity
        ? {
            job_id: r.id,
            required_skills: JSON.parse(r.required_skills || '[]'),
            optional_skills: JSON.parse(r.optional_skills || '[]'),
            experience_requirement: r.experience_requirement || '',
            technical_complexity: r.technical_complexity,
            estimated_hours: Number(r.estimated_hours),
            step_count: Number(r.step_count),
            communication_level: r.communication_level,
            deadline_pressure: r.deadline_pressure,
            budget_quality: r.budget_quality,
            client_expectations: r.client_expectations || '',
            analyzed_at: r.analyzed_at || ''
          }
        : undefined;

      return {
        ...job,
        score,
        risk,
        analysis,
        user_action: r.user_action || null,
        ignore_reason: r.ignore_reason || ''
      };
    });

    return { jobs, total };
  }

  public static saveJobAnalysis(analysis: JobAnalysis): void {
    const now = new Date().toISOString();
    Database.execute(
      `INSERT OR REPLACE INTO job_analyses (
        id, job_id, required_skills, optional_skills, experience_requirement,
        technical_complexity, estimated_hours, step_count, communication_level,
        deadline_pressure, budget_quality, client_expectations, analyzed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysis.id || `ja_${analysis.job_id}`,
        analysis.job_id,
        JSON.stringify(analysis.required_skills),
        JSON.stringify(analysis.optional_skills),
        analysis.experience_requirement,
        analysis.technical_complexity,
        analysis.estimated_hours,
        analysis.step_count,
        analysis.communication_level,
        analysis.deadline_pressure,
        analysis.budget_quality,
        analysis.client_expectations,
        analysis.analyzed_at || now
      ]
    );
  }

  public static saveJobScore(score: JobScore): void {
    Database.execute(
      `INSERT OR REPLACE INTO job_scores (
        id, job_id, user_id, overall_score, skill_score, experience_score,
        difficulty_score, budget_score, time_score, communication_score,
        preference_score, client_quality_score, matched_skills, missing_skills,
        explanation, scored_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        score.id || `score_${score.job_id}_${score.user_id}`,
        score.job_id,
        score.user_id,
        score.overall_score,
        score.skill_score,
        score.experience_score,
        score.difficulty_score,
        score.budget_score,
        score.time_score,
        score.communication_score,
        score.preference_score,
        score.client_quality_score,
        JSON.stringify(score.matched_skills),
        JSON.stringify(score.missing_skills),
        JSON.stringify(score.explanation),
        score.scored_at
      ]
    );
  }

  public static saveJobRisk(risk: JobRisk): void {
    Database.execute(
      `INSERT OR REPLACE INTO job_risks (
        id, job_id, risk_level, risk_score, warning_signals, explanation, analyzed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        risk.id || `risk_${risk.job_id}`,
        risk.job_id,
        risk.risk_level,
        risk.risk_score,
        JSON.stringify(risk.warning_signals),
        risk.explanation,
        risk.analyzed_at
      ]
    );
  }

  public static setUserJobAction(userId: string, jobId: string, action: 'saved' | 'ignored', reason: string = ''): void {
    const now = new Date().toISOString();
    Database.execute(
      `INSERT OR REPLACE INTO saved_jobs (id, user_id, job_id, status, reason, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`action_${userId}_${jobId}`, userId, jobId, action, reason, now]
    );

    // Also record feedback event for personalization learning
    Database.execute(
      `INSERT INTO user_feedback (id, user_id, job_id, action, reason, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`, userId, jobId, action, reason, JSON.stringify({}), now]
    );
  }

  public static removeUserJobAction(userId: string, jobId: string): void {
    Database.execute('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [userId, jobId]);
  }

  private static mapRowToNormalizedJob(r: any): NormalizedJob {
    return {
      id: r.id,
      platform: r.platform,
      platform_job_id: r.platform_job_id,
      url: r.url,
      title: r.title,
      description: r.description,
      category: r.category,
      skills: JSON.parse(r.requirements || '[]'),
      budget: {
        type: r.budget_type as 'fixed' | 'hourly',
        min: r.budget_min !== null ? Number(r.budget_min) : null,
        max: r.budget_max !== null ? Number(r.budget_max) : null,
        currency: r.budget_currency || 'USD'
      },
      experience_level: r.experience_level,
      estimated_duration: r.estimated_duration || '',
      deadline: r.deadline || '',
      posted_at: r.posted_at,
      client: {
        name: r.client_name || '',
        country: r.client_country || '',
        rating: r.client_rating !== null ? Number(r.client_rating) : null,
        reviews: r.client_reviews_count !== null ? Number(r.client_reviews_count) : null,
        jobs_posted: r.client_jobs_posted !== null ? Number(r.client_jobs_posted) : null,
        jobs_hired: r.client_jobs_hired !== null ? Number(r.client_jobs_hired) : null,
        hire_rate: r.client_hire_rate !== null ? Number(r.client_hire_rate) : null
      },
      competition: {
        proposal_count: r.proposal_count !== null ? Number(r.proposal_count) : 0
      },
      communication_requirements: JSON.parse(r.communication_requirements || '[]'),
      requirements: JSON.parse(r.requirements || '[]'),
      external_links: JSON.parse(r.external_links || '[]'),
      source_data: JSON.parse(r.source_data || '{}'),
      collected_at: r.collected_at,
      hash: r.hash
    };
  }
}
