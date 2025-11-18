// scripts/db-init.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'src', 'schema.sql');

function maskedConnInfo(conn) {
  if (!conn) return '[EMPTY]';
  try {
    const u = new URL(conn);
    const user = u.username ? '****' : '';
    return `${u.protocol}//${user ? user + '@' : ''}${u.hostname}:${u.port || '[default]'}${u.pathname || ''}`;
  } catch {
    return '[UNPARSABLE]';
  }
}

const useSSL = (process.env.PGSSL || '').toLowerCase() === 'true';

async function applySchemaInternal() {
  const conn = process.env.DATABASE_URL;
  console.log('[db-init] DATABASE_URL:', maskedConnInfo(conn));
  console.log('[db-init] PGSSL:', process.env.PGSSL || 'unset');
  console.log('[db-init] schema file:', schemaPath);

  if (!conn) {
    console.error('[db-init] No DATABASE_URL set, skipping schema apply');
    return;
  }

  let sql;
  try {
    sql = await fs.readFile(schemaPath, 'utf8');
  } catch (err) {
    console.error('[db-init] failed to read schema.sql:', err.message || err);
    throw err;
  }

  const pool = new Pool({
    connectionString: conn,
    ssl: useSSL ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('[db-init] applying schema to database…');
    await pool.query(sql);
    console.log('[db-init] schema applied successfully');
  } catch (err) {
    console.error('[db-init] error applying schema:', err.message || err);
    throw err;
  } finally {
    await pool.end();
  }
}

// exported for server.js to call on boot
export async function applySchemaOnBoot() {
  try {
    await applySchemaInternal();
  } catch (err) {
    // log only; don't crash the app on boot
    console.error('[db-init] applySchemaOnBoot() failed:', err.message || err);
  }
}

// CLI mode: `node scripts/db-init.js`
if (process.argv[1] && process.argv[1].endsWith('db-init.js')) {
  applySchemaInternal().catch(err => {
    console.error('[db-init] unexpected error:', err);
    process.exitCode = 1;
  });
}
