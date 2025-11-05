import { Router } from 'express';
import { pool } from '../db.js';

const r = Router();

// Get basic profile by id
r.get('/:id', async (req, res) => {
  const id = req.params.id;
  const { rows } = await pool.query(
    'select id, display_name, created_at, last_seen from players where id=$1',
    [id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'not_found' });

  // Touch last_seen
  await pool.query('update players set last_seen=now() where id=$1', [id]);

  res.json(rows[0]);
});

export default r;
