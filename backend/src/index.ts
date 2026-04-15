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

// 🛡️ Issue #4 Fix: Strict CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173']; // .env না থাকলে ডিফল্টভাবে শুধু তোমার লোকাল পিসি অ্যালাও করবে, পুরো দুনিয়া নয়!

// Log allowed origins on startup for debugging
console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // !origin মানে হলো সার্ভার-টু-সার্ভার বা মোবাইল অ্যাপের রিকোয়েস্ট (যেগুলো ব্রাউজার থেকে আসে না)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // অন্য কোনো ওয়েবসাইট (যেমন হ্যাকারদের সাইট) রিকোয়েস্ট করলে ব্লক করে দেবে!
        console.warn(`[CORS Blocked] Unauthorized origin attempted access: ${origin}`);
        callback(new Error('Blocked by CORS policy')); 
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
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