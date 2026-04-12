import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { supabase } from '../lib/supabase';

// ── Augmented request type ────────────────────────────────────────────────────

export type AuthenticatedRequest = Request & {
  userId: string;
  userRole: string;
};

// ── Multer instances ──────────────────────────────────────────────────────────

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only image uploads are accepted.'));
    return;
  }
  cb(null, true);
};

const storage = multer.memoryStorage();

export const uploadQuestions = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});

export const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

// ── Rate limiter ──────────────────────────────────────────────────────────────

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;

// Memory leak fix: prune expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestCounts) {
    if (now > data.resetAt) requestCounts.delete(ip);
  }
}, 5 * 60 * 1000);

export const basicRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.header('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const current = requestCounts.get(ip);

  if (!current || now > current.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests. Try again shortly.' });
    return;
  }

  current.count += 1;
  requestCounts.set(ip, current);
  next();
};

// ── Auth middleware ───────────────────────────────────────────────────────────

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid bearer token.' });
      return;
    }

    const token = authHeader.slice(7).trim();
    const { data: authUser, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser.user) {
      res.status(401).json({ error: 'Unauthorized request.' });
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', authUser.user.id)
      .single();

    if (profileError || !profile?.id) {
      res.status(403).json({ error: 'Unable to resolve user role.' });
      return;
    }

    const typedReq = req as AuthenticatedRequest;
    typedReq.userId = profile.id;
    typedReq.userRole = profile.role || 'user';
    next();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication middleware failed.';
    res.status(500).json({ error: msg });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if ((req as AuthenticatedRequest).userRole !== 'admin') {
    res.status(403).json({ error: 'Admin privileges required.' });
    return;
  }
  next();
};
