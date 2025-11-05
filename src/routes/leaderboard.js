import { Router } from 'express';
import { pool } from '../db.js';

const r = Router();

// Simple aggregate leaderboard by total loot_value
r.get('/top', async (_req, res) => {
  const { rows } = await pool.query(
    `select p.display_name, coalesce(sum(m.loot_value),0) as score
     from players p
     left join matches m on m.player_id = p.id
     group by p.id, p.display_name
     order by score desc
     limit 50`
  );
  res.json(rows);
});

export default r;
