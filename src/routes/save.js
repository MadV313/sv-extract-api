import { Router } from 'express';
import { pool } from '../db.js';

const r = Router();

// Upsert save (default slot 0)
r.post('/:id', async (req, res) => {
  const playerId = req.params.id;
  const { slot = 0, data = {} } = req.body || {};

  await pool.query(
    `insert into saves(player_id, slot, data)
     values($1,$2,$3)
     on conflict(player_id, slot) do update set data=$3, updated_at=now()`,
    [playerId, slot, data]
  );

  // touch player last_seen as well
  await pool.query('update players set last_seen=now() where id=$1', [playerId]);

  res.json({ ok: true });
});

// List saves for a player
r.get('/:id', async (req, res) => {
  const playerId = req.params.id;
  const { rows } = await pool.query(
    'select slot, data, updated_at from saves where player_id=$1 order by slot asc',
    [playerId]
  );
  res.json(rows);
});

export default r;
