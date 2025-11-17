// src/db.js
import pg from 'pg';

const { Pool } = pg;

// Railway and many managed DBs want ssl=true. Toggle via env PGSSL.
const useSSL = (process.env.PGSSL || '').toLowerCase() === 'true';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

// quick sanity check on startup (optional but helpful)
export async function pingDbOnce() {
  try {
    await pool.query('select 1');
    console.log('[db] connected');
  } catch (err) {
    console.error('[db] connection error:', err?.message || err);
  }
}
