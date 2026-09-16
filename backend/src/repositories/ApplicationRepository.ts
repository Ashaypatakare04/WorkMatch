import { Database } from '../database/connection.js';
import { Application, ApplicationStatus, ApplicationMode, ApplicationOutcome } from '../models/Application.js';
import { Proposal } from '../models/Proposal.js';

export class ApplicationRepository {
  public static createOrUpdate(app: {
    job_id: string;
    user_id: string;
    proposal_id?: string | null;
    status: ApplicationStatus;
    mode: ApplicationMode;
    connect_cost?: number;
    notes?: string;
    outcome?: ApplicationOutcome;
  }): Application {
    const now = new Date().toISOString();
    const existing = Database.queryOne<any>(
      'SELECT id, created_at, status FROM applications WHERE user_id = ? AND job_id = ?',
      [app.user_id, app.job_id]
    );

    const appId = existing ? existing.id : `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const createdAt = existing ? existing.created_at : now;
    const appliedAt = app.status === 'applied' ? now : null;

    Database.execute(
      `INSERT OR REPLACE INTO applications (
        id, job_id, user_id, proposal_id, status, mode, connect_cost, applied_at, notes, outcome, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appId,
        app.job_id,
        app.user_id,
        app.proposal_id ?? null,
        app.status,
        app.mode,
        app.connect_cost || 0,
        appliedAt,
        app.notes || '',
        app.outcome || 'pending',
        createdAt,
        now
      ]
    );

    // Record audit event
    Database.execute(
      `INSERT INTO application_events (id, application_id, event_type, payload, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        `event_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        appId,
        existing ? `status_changed_to_${app.status}` : 'application_created',
        JSON.stringify({ status: app.status, mode: app.mode }),
        now
      ]
    );

    return ApplicationRepository.getById(appId)!;
  }

  public static getById(id: string): Application | null {
    const r = Database.queryOne<any>('SELECT * FROM applications WHERE id = ?', [id]);
    if (!r) return null;
    return {
      id: r.id,
      job_id: r.job_id,
      user_id: r.user_id,
      proposal_id: r.proposal_id,
      status: r.status,
      mode: r.mode,
      connect_cost: Number(r.connect_cost),
      applied_at: r.applied_at,
      notes: r.notes,
      outcome: r.outcome,
      created_at: r.created_at,
      updated_at: r.updated_at
    };
  }

  public static listByUser(userId: string): (Application & {
    job_title: string;
    platform: string;
    category: string;
    budget_max: number;
    budget_type: string;
    overall_score: number;
    proposal_content?: string;
  })[] {
    const sql = `
      SELECT
        a.*,
        j.title as job_title,
        j.platform,
        j.category,
        j.budget_max,
        j.budget_type,
        COALESCE(js.overall_score, 0) as overall_score,
        p.content as proposal_content
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN job_scores js ON j.id = js.job_id AND js.user_id = a.user_id
      LEFT JOIN proposals p ON a.proposal_id = p.id
      WHERE a.user_id = ?
      ORDER BY a.updated_at DESC
    `;
    const rows = Database.query<any>(sql, [userId]);
    return rows.map(r => ({
      id: r.id,
      job_id: r.job_id,
      user_id: r.user_id,
      proposal_id: r.proposal_id,
      status: r.status,
      mode: r.mode,
      connect_cost: Number(r.connect_cost),
      applied_at: r.applied_at,
      notes: r.notes,
      outcome: r.outcome,
      created_at: r.created_at,
      updated_at: r.updated_at,
      job_title: r.job_title,
      platform: r.platform,
      category: r.category,
      budget_max: Number(r.budget_max || 0),
      budget_type: r.budget_type,
      overall_score: Number(r.overall_score),
      proposal_content: r.proposal_content
    }));
  }

  public static saveProposal(proposal: Proposal): Proposal {
    const id = proposal.id || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    Database.execute(
      `INSERT INTO proposals (
        id, job_id, user_id, version_number, style, title, content, word_count,
        claims_verification, addressed_requirements, why_written, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        proposal.job_id,
        proposal.user_id,
        proposal.version_number || 1,
        proposal.style,
        proposal.title || '',
        proposal.content,
        proposal.word_count,
        JSON.stringify(proposal.claims_verification),
        JSON.stringify(proposal.addressed_requirements),
        proposal.why_written,
        proposal.created_at || now
      ]
    );

    return { ...proposal, id, created_at: proposal.created_at || now };
  }

  public static getProposalsForJob(userId: string, jobId: string): Proposal[] {
    const rows = Database.query<any>(
      'SELECT * FROM proposals WHERE user_id = ? AND job_id = ? ORDER BY version_number ASC',
      [userId, jobId]
    );
    return rows.map(r => ({
      id: r.id,
      job_id: r.job_id,
      user_id: r.user_id,
      version_number: Number(r.version_number),
      style: r.style,
      title: r.title,
      content: r.content,
      word_count: Number(r.word_count),
      claims_verification: JSON.parse(r.claims_verification || '{}'),
      addressed_requirements: JSON.parse(r.addressed_requirements || '[]'),
      why_written: r.why_written,
      created_at: r.created_at
    }));
  }
}
