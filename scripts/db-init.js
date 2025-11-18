// scripts/db-init.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'src', 'schema.sql');

async function applySchemaInternal() {
  console.log('[db-init] starting');
  console.log('[db-init] schema file:', schemaPath);

  let sql;
  try {
    sql = await fs.readFile(schemaPath, 'utf8');
  } catch (err) {
    console.error('[db-init] failed to read schema.sql:', err.message || err);
    throw err;
  }

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

// exported so we *could* call it from server.js later if we want
export async function applySchema() {
  return applySchemaInternal();
}

// CLI mode: `node scripts/db-init.js`
if (process.argv[1] && process.argv[1].endsWith('db-init.js')) {
  applySchemaInternal().catch(err => {
    console.error('[db-init] unexpected error:', err);
    process.exitCode = 1;
  });
}
