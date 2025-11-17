// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import health from './src/routes/health.js';
import auth from './src/routes/auth.js';
import profile from './src/routes/profile.js';
import save from './src/routes/save.js';
import leaderboard from './src/routes/leaderboard.js';
import { pingDbOnce } from './src/db.js';

const app = express();

// Security + parsers
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
}));

// JSON body (raise/lower limit later if needed)
app.use(express.json({ limit: '1mb' }));

// Root -> health
app.get('/', (_req, res) => res.redirect('/health'));

// Routes
app.use('/health', health);
app.use('/v1/auth', auth);
app.use('/v1/profile', profile);
app.use('/v1/save', save);
app.use('/v1/leaderboard', leaderboard);

// Start
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
  pingDbOnce();
});
