import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

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

  public static get(): DatabaseSync {
    if (!Database.instance) {
      Database.instance = new DatabaseSync(DB_PATH);
      Database.instance.exec('PRAGMA foreign_keys = ON;');
      Database.instance.exec('PRAGMA journal_mode = WAL;');
      Database.instance.exec('PRAGMA busy_timeout = 5000;');
    }
    return Database.instance;
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

  public static close(): void {
    if (Database.instance) {
      Database.instance.close();
      Database.instance = null;
    }
  }
}

export default Database;
