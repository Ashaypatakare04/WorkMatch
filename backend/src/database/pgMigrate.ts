import pg from 'pg';
import { PG_SCHEMA_SQL } from './pgSchema.js';

const { Pool } = pg;

export async function runPgMigrations(connectionString?: string): Promise<boolean> {
  const url = connectionString || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    console.warn('[PostgreSQL Migration] No DATABASE_URL or POSTGRES_URL provided in environment.');
    return false;
  }

  console.log('[PostgreSQL Migration] Connecting to PostgreSQL database...');
  const pool = new Pool({
    connectionString: url,
    ssl: url.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  try {
    console.log('[PostgreSQL Migration] Executing WorkMatch AI PostgreSQL Schema DDL...');
    await client.query(PG_SCHEMA_SQL);
    console.log('[PostgreSQL Migration] PostgreSQL tables and indexes provisioned successfully.');
    return true;
  } catch (err: any) {
    console.error('[PostgreSQL Migration] Migration error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run directly from CLI if invoked
if (process.argv[1] && (process.argv[1].endsWith('pgMigrate.ts') || process.argv[1].endsWith('pgMigrate.js'))) {
  runPgMigrations()
    .then(success => {
      if (success) {
        console.log('[PostgreSQL Migration] Finished.');
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(() => process.exit(1));
}
