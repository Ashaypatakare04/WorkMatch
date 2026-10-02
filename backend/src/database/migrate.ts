import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Database } from './connection.js';
import { SCHEMA_SQL } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runMigrations(): void {
  console.log('[Database] Running database migrations...');
  let schemaSql = SCHEMA_SQL;

  if (!schemaSql) {
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      schemaSql = fs.readFileSync(schemaPath, 'utf8');
    }
  }

  Database.exec(schemaSql);

  // Idempotent column migrations for users table (OAuth support)
  try {
    Database.exec("ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'email';");
  } catch {
    // Column already exists
  }
  try {
    Database.exec("ALTER TABLE users ADD COLUMN provider_id TEXT;");
  } catch {
    // Column already exists
  }
  try {
    Database.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT;");
  } catch {
    // Column already exists
  }

  console.log('[Database] Database schema initialized successfully.');
}

// Run directly if called from CLI
if (process.argv[1] && (process.argv[1].endsWith('migrate.ts') || process.argv[1].endsWith('migrate.js'))) {
  try {
    runMigrations();
    console.log('[Database] Done.');
  } catch (err) {
    console.error('[Database] Migration failed:', err);
    process.exit(1);
  }
}
