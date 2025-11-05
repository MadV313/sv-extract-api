import { Router } from 'express';
import { pool } from '../db.js';
import { randomUUID } from 'crypto';

const r = Router();

// Guest create (optionally accepts name, device_id)
r.post('/guest', async (req, res) => {
  const id = randomUUID();
  const name = (req.body && req.body.name) ? String(req.body.name).slice(0, 32) : `Guest-${id.slice(0, 6)}`;
  const deviceId = req.body?.device_id ? String(req.body.device_id).slice(0, 64) : null;

  await pool.query(
    'insert into players(id, display_name, device_id) values ($1,$2,$3)',
    [id, name, deviceId]
  );

  res.json({ id, name });
});

export default r;
