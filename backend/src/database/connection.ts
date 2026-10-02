import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import pg from 'pg';

const { Pool } = pg;

const isVercel = Boolean(process.env.VERCEL);
const DB_PATH = process.env.DATABASE_PATH || (isVercel ? path.join(os.tmpdir(), 'workmatch.sqlite') : path.resolve(process.cwd(), 'data', 'workmatch.sqlite'));
const DB_DIR = path.dirname(DB_PATH);

if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (err) {
    console.warn(`[Database] Directory creation notice for ${DB_DIR}:`, err);
  }
}

export class Database {
  private static instance: DatabaseSync | null = null;
  private static pgPool: pg.Pool | null = null;

  public static isPostgres(): boolean {
    return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  }

  public static getEngineName(): 'PostgreSQL' | 'SQLite' {
    return Database.isPostgres() ? 'PostgreSQL' : 'SQLite';
  }

  public static get(): DatabaseSync {
    if (!Database.instance) {
      Database.instance = new DatabaseSync(DB_PATH);
      Database.instance.exec('PRAGMA foreign_keys = ON;');
      Database.instance.exec('PRAGMA journal_mode = WAL;');
      Database.instance.exec('PRAGMA busy_timeout = 5000;');
    }
    return Database.instance;
  }

  public static getPgPool(): pg.Pool {
    if (!Database.pgPool) {
      const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
      Database.pgPool = new Pool({
        connectionString: url,
        ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
      });
    }
    return Database.pgPool;
  }

  /**
   * Translates SQLite `?` placeholder parameters to PostgreSQL `$1, $2, ...` syntax.
   */
  public static toPostgresSql(sql: string): string {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  }

  public static query<T = any>(sql: string, params: any[] = []): T[] {
    const db = Database.get();
    const stmt = db.prepare(sql);
    return stmt.all(...params) as T[];
  }

  public static queryOne<T = any>(sql: string, params: any[] = []): T | null {
    const results = Database.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  public static execute(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number | bigint } {
    const db = Database.get();
    const stmt = db.prepare(sql);
    const result = stmt.run(...params);
    return {
      changes: Number(result.changes || 0),
      lastInsertRowid: result.lastInsertRowid
    };
  }

  public static exec(script: string): void {
    const db = Database.get();
    db.exec(script);
  }

  public static transaction<T>(callback: () => T): T {
    const db = Database.get();
    db.exec('BEGIN TRANSACTION;');
    try {
      const result = callback();
      db.exec('COMMIT;');
      return result;
    } catch (error) {
      db.exec('ROLLBACK;');
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Asynchronous Database Methods (supports PostgreSQL & SQLite)
  // ─────────────────────────────────────────────────────────────

  public static async queryAsync<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (Database.isPostgres()) {
      const pool = Database.getPgPool();
      const pgSql = Database.toPostgresSql(sql);
      const res = await pool.query(pgSql, params);
      return res.rows as T[];
    }
    return Database.query<T>(sql, params);
  }

  public static async queryOneAsync<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await Database.queryAsync<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  public static async executeAsync(sql: string, params: any[] = []): Promise<{ changes: number }> {
    if (Database.isPostgres()) {
      const pool = Database.getPgPool();
      const pgSql = Database.toPostgresSql(sql);
      const res = await pool.query(pgSql, params);
      return { changes: res.rowCount || 0 };
    }
    const res = Database.execute(sql, params);
    return { changes: res.changes };
  }

  public static async transactionAsync<T>(callback: () => Promise<T>): Promise<T> {
    if (Database.isPostgres()) {
      const pool = Database.getPgPool();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback();
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    }

    const db = Database.get();
    db.exec('BEGIN TRANSACTION;');
    try {
      const result = await callback();
      db.exec('COMMIT;');
      return result;
    } catch (error) {
      db.exec('ROLLBACK;');
      throw error;
    }
  }

  public static async isHealthy(): Promise<{ status: 'HEALTHY' | 'UNHEALTHY'; engine: string; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      if (Database.isPostgres()) {
        const pool = Database.getPgPool();
        await pool.query('SELECT 1');
      } else {
        Database.queryOne('SELECT 1');
      }
      return {
        status: 'HEALTHY',
        engine: Database.getEngineName(),
        latencyMs: Date.now() - start
      };
    } catch (err: any) {
      return {
        status: 'UNHEALTHY',
        engine: Database.getEngineName(),
        latencyMs: Date.now() - start,
        error: err.message
      };
    }
  }

  // ─────────────────────────────────────────────────────────────
  // State Backup & Restore (Prevents Data Loss on Serverless restarts)
  // ─────────────────────────────────────────────────────────────

  public static exportState(userId?: string): Record<string, any[]> {
    const tables = [
      'users',
      'user_profiles',
      'user_skills',
      'user_preferences',
      'automation_settings',
      'applications',
      'notification_preferences'
    ];

    const state: Record<string, any[]> = {};
    for (const table of tables) {
      if (userId) {
        if (table === 'users') {
          state[table] = Database.query('SELECT * FROM users WHERE id = ?', [userId]);
        } else {
          state[table] = Database.query(`SELECT * FROM ${table} WHERE user_id = ?`, [userId]);
        }
      } else {
        state[table] = Database.query(`SELECT * FROM ${table}`);
      }
    }
    return state;
  }

  public static importState(state: Record<string, any[]>): void {
    const tableOrder = [
      'users',
      'user_profiles',
      'user_skills',
      'user_preferences',
      'automation_settings',
      'jobs',
      'applications',
      'notification_preferences'
    ];

    // Sort tables by dependencies
    const sortedEntries = Object.entries(state).sort(([a], [b]) => {
      const idxA = tableOrder.indexOf(a);
      const idxB = tableOrder.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    Database.transaction(() => {
      for (const [table, rows] of sortedEntries) {
        if (!Array.isArray(rows) || rows.length === 0) continue;

        for (const row of rows) {
          const keys = Object.keys(row);
          const placeholders = keys.map(() => '?').join(', ');
          const values = Object.values(row);

          Database.execute(
            `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
          );
        }
      }
    });
  }

  public static close(): void {
    if (Database.instance) {
      Database.instance.close();
      Database.instance = null;
    }
    if (Database.pgPool) {
      Database.pgPool.end().catch(() => {});
      Database.pgPool = null;
    }
  }
}

export default Database;
