// scripts/db-init.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'src', 'schema.sql');

async function main() {
  console.log('[db-init] starting');
  console.log('[db-init] schema file:', schemaPath);

  let sql;
  try {
    sql = await fs.readFile(schemaPath, 'utf8');
  } catch (err) {
    console.error('[db-init] failed to read schema.sql:', err.message || err);
    process.exitCode = 1;
    return;
  }

  try {
    console.log('[db-init] applying schema to database…');
    // node-postgres will run multiple statements in one query just fine
    await pool.query(sql);
    console.log('[db-init] schema applied successfully');
  } catch (err) {
    console.error('[db-init] error applying schema:', err.message || err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('[db-init] unexpected error:', err);
  process.exitCode = 1;
});
