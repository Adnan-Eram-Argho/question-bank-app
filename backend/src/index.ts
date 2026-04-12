import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

// Fail fast — catch missing env vars before any route is registered
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required Supabase environment variables.');
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables.');
}
if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing required GROQ_API_KEY.');
}

import { basicRateLimit } from './middleware';
import authRouter from './routes/auth';
import uploadsRouter from './routes/uploads';
import aiRouter from './routes/ai';
import adminRouter from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Required for Render reverse proxy to expose real client IP
app.set('trust proxy', 1);

// CORS — empty CORS_ORIGIN means allow all origins (safe for initial deployment)
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
  })
);

app.use(express.json());

// Minimal security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use(basicRateLimit);

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/', (_req: Request, res: Response) => res.status(200).send('API is operational.'));

app.use('/api/user', authRouter);
app.use('/api', uploadsRouter);          // POST /api/upload, POST /api/upload-material
app.use('/api', aiRouter);               // POST /api/chat-tutor
// Double-mount adminRouter so that:
//   /api/admin/* → protected admin CRUD routes
//   /api/contributors → public contributors list (same router, different prefix)
app.use('/api/admin', adminRouter);
app.use('/api', adminRouter);

// ── Global error handler ──────────────────────────────────────────────────────

app.use((err: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: `Upload rejected: ${err.message}` });
    return;
  }
  if (err instanceof Error && err.message.includes('Only image uploads are accepted')) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () =>
  console.log(`[Server] Listening on http://localhost:${PORT}`)
);