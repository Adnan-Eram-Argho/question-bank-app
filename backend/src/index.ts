import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true;
  // If no CORS origins are configured, allow all origins to avoid deployment lockouts.
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
  })
);
app.use(express.json());
app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Groq AI client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Missing required Supabase environment variables.');
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables.');
}
if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing required GROQ_API_KEY.');
}

// Multer memory storage with strict validation and upload bounds.
const storage = multer.memoryStorage();
const imageFileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new Error('Only image uploads are accepted.'));
    return;
  }
  callback(null, true);
};

const uploadQuestions = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
});
const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});

type AuthenticatedRequest = Request & {
  userId: string;
  userRole: string;
};

const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;
const basicRateLimit = (req: Request, res: Response, next: express.NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const current = requestCounts.get(ip);

  if (!current || now > current.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((current.resetAt - Date.now()) / 1000);
    res.set('Retry-After', String(retryAfterSeconds));
    res.status(429).json({ error: 'Too many requests. Try again shortly.' });
    return;
  }

  current.count += 1;
  requestCounts.set(ip, current);
  next();
};

app.use(basicRateLimit);

const requireAuth = async (req: Request, res: Response, next: express.NextFunction): Promise<void> => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Authentication middleware failed.' });
  }
};

const requireAdmin = (req: Request, res: Response, next: express.NextFunction): void => {
  const typedReq = req as AuthenticatedRequest;
  if (typedReq.userRole !== 'admin') {
    res.status(403).json({ error: 'Admin privileges required.' });
    return;
  }
  next();
};

/**
 * Helper to delete an image directly from Cloudinary by extracting its public ID from the URL.
 * 
 * @param imageUrl - Full secure URL of the image stored in Cloudinary.
 * @param folder - The Cloudinary destination folder name (e.g., 'user_avatars').
 */
const deleteImageFromCloudinary = async (imageUrl: string | null, folder: string): Promise<void> => {
  if (!imageUrl) return;

  try {
    const urlParts = imageUrl.split('/');
    const folderIndex = urlParts.findIndex((part) => part === folder);
    
    if (folderIndex !== -1) {
      const publicIdWithExtension = urlParts.slice(folderIndex).join('/');
      const lastDotIndex = publicIdWithExtension.lastIndexOf('.');
      const publicId = lastDotIndex !== -1 
        ? publicIdWithExtension.substring(0, lastDotIndex) 
        : publicIdWithExtension;
        
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(`[Cloudinary] Deletion failed for URL: ${imageUrl}`, error);
  }
};

/**
 * GET /
 * Health check endpoint.
 */
app.get('/', (req: Request, res: Response): void => {
  res.status(200).send('API is operational.');
});

/**
 * GET /api/contributors
 * Public route to fetch the list of contributors (collectors and admins).
 * This uses the supabase service key to bypass Row Level Security.
 */
app.get('/api/contributors', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, bio, avatar_url, role')
      .in('role', ['collector', 'admin'])
      .order('full_name', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[API Error] Fetch Contributors:', error.message);
    res.status(500).json({ error: 'Failed to fetch contributors' });
  }
});

/**
 * POST /api/admin/create-user
 * Admin route to safely create a new user in Supabase Auth and the public database schema.
 */
app.post('/api/admin/create-user', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    res.status(400).json({ error: 'Email, password, and role are required.' });
    return;
  }
  if (!['admin', 'collector'].includes(role)) {
    res.status(400).json({ error: 'Invalid role. Must be admin or collector.' });
    return;
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: authData.user.id, email: email, role: role });

      if (dbError) throw dbError;
    }

    res.status(201).json({ message: 'User provisioned successfully', user: authData.user });
  } catch (error: any) {
    console.error('[API Error] User Creation:', error.message);
    res.status(400).json({ error: error.message || 'Failed to create user' });
  }
});

/**
 * POST /api/upload
 * Handles question uploads, including proxying the image to Cloudinary and storing records in Supabase.
 */
app.post('/api/upload', requireAuth, uploadQuestions.array('images', 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Missing required image payload' });
      return;
    }

    const typedReq = req as AuthenticatedRequest;
    const { level, semester, course_name, question_type } = req.body;
    if (!level || !semester || !course_name || !question_type) {
      res.status(400).json({ error: 'Required fields are missing for question upload.' });
      return;
    }

    const streamUpload = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'question_bank' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // Upload all files to Cloudinary in parallel
    const uploadPromises = files.map((file) => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);
    const imageUrls = results.map((result) => result.secure_url);

    // Provide the first image as the primary image_url for backward compatibility in some views
    const imageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          image_url: imageUrl,
          image_urls: imageUrls,
          level,
          semester,
          course_name,
          question_type,
          uploaded_by: typedReq.userId,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Resource stored successfully', data });
  } catch (error: any) {
    console.error('[API Error] Question Upload:', error.message);
    res.status(500).json({ error: error.message || 'Failed to upload resource' });
  }
});

/**
 * GET /api/admin/users
 * Retrieves a list of all users from the public schema.
 */
app.get('/api/admin/users', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[API Error] Fetch Users:', error.message);
    res.status(500).json({ error: error.message || 'Failed to retrieve users' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Force-removes a user, purging their avatar from Cloudinary and their Auth/Database records.
 */
app.delete('/api/admin/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    const { data: user } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', id)
      .single();

    if (user?.avatar_url) {
      await deleteImageFromCloudinary(user.avatar_url, 'user_avatars');
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    res.status(200).json({ message: 'Participant record dropped securely' });
  } catch (error: any) {
    console.error('[API Error] Delete User:', error.message);
    res.status(500).json({ error: error.message || 'Failed to execute deletion' });
  }
});

/**
 * DELETE /api/admin/questions/:id
 * Removes a specified question entry and its associated Cloudinary asset.
 */
app.delete('/api/admin/questions/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('image_url, image_urls')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (question?.image_urls && question.image_urls.length > 0) {
      // Delete all images in the array
      const deletePromises = question.image_urls.map((url: string) => 
        deleteImageFromCloudinary(url, 'question_bank')
      );
      await Promise.all(deletePromises);
    } else if (question?.image_url) {
      await deleteImageFromCloudinary(question.image_url, 'question_bank');
    }

    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: 'Resource permanently deleted' });
  } catch (error: any) {
    console.error('[API Error] Delete Question:', error.message);
    res.status(500).json({ error: error.message || 'System failure processing resource removal' });
  }
});

/**
 * POST /api/user/profile
 * Allows users to update personal data and optionally upload/rotate a new Cloudinary avatar.
 */
app.get('/api/user/profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, bio, avatar_url, role')
      .eq('id', typedReq.userId)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[API Error] Fetch Profile:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
});

app.post('/api/user/profile', requireAuth, uploadAvatar.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  const { fullName, bio } = req.body;
  const typedReq = req as AuthenticatedRequest;

  try {
    let avatarUrl = null;

    const { data: existingUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', typedReq.userId)
      .single();

    if (req.file) {
      const streamUpload = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'user_avatars' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      
      const result = await streamUpload(req.file.buffer);
      avatarUrl = result.secure_url;

      if (existingUser?.avatar_url) {
        await deleteImageFromCloudinary(existingUser.avatar_url, 'user_avatars');
      }
    }

    const updateData: Record<string, string> = {};
    if (fullName) updateData.full_name = fullName;
    if (bio) updateData.bio = bio;
    if (avatarUrl) updateData.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', typedReq.userId)
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Profile attributes updated', user: data[0] });
  } catch (error: any) {
    console.error('[API Error] Profile Sync:', error.message);
    res.status(500).json({ error: error.message || 'Operation halted during profile sync' });
  }
});

/**
 * POST /api/chat-tutor
 * Domain-specific AI Tutor powered by Groq (llama-3.2-90b-vision-preview).
 * Accepts: message (string), history (array of {role, text}), images (optional Cloudinary URL array).
 * Enforces strict Agricultural Economics domain guardrails.
 */
const GROQ_SYSTEM_INSTRUCTION = `You are a specialized AI Tutor built exclusively for the Agricultural Economics Question Bank at Sher-e-Bangla Agricultural University (SAU), Bangladesh.

CRITICAL RULES — you must follow all of these without exception:

RULE 1 — IDENTITY (HIGHEST PRIORITY):
If the user asks "Who made you?", "Who created you?", "Who developed this?", "Who built you?", or any similar question about your creator, developer, or the application's author, you MUST reply with EXACTLY this phrase: "Md. Adnan Eram Argho made me." Do not add anything else about the creator.

RULE 2 — DOMAIN RESTRICTION:
You are STRICTLY limited to helping with Agricultural Economics and related subjects taught at SAU. Your knowledge domain includes: Principles of Economics, Micro Economics, Macro Economics, Agricultural Marketing, Farm Management, Agricultural Finance, Production Economics, Econometrics, Mathematical Economics, Environmental Economics, Agricultural Policy and Planning, Agricultural Development Economics, Supply Chain Management, Financial Management, Organizational Behavior, Bangladesh Studies, Human Resource Management, and any other subject within the SAU Agricultural Economics curriculum. You may also analyze and explain exam question papers if images are provided.

RULE 3 — REJECTION:
If the user asks about ANYTHING outside Agricultural Economics (including general knowledge, entertainment, movies, weather, coding, mathematics unrelated to economics, physics, chemistry, sports, politics, etc.), you MUST respond with EXACTLY: "I am here to help you only with Agricultural Economics and your exam questions." Do not attempt to answer off-topic questions under any circumstances.

Always be helpful, clear, and educational when answering questions within your domain. If images of question papers are provided, analyze them carefully to help the student understand the questions and concepts.`;

app.post('/api/chat-tutor', async (req: Request, res: Response): Promise<void> => {
  const { message, history, images } = req.body as {
    message: string;
    history: { role: 'user' | 'assistant'; text: string }[];
    images?: string[];
  };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'A valid message string is required.' });
    return;
  }

  try {
    // Pass Cloudinary URLs directly to Groq to save server bandwidth and reduce latency
    const imageContentParts: { type: 'image_url'; image_url: { url: string } }[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const url of images) {
        imageContentParts.push({
          type: 'image_url',
          image_url: { url: url },
        });
      }
    }

    // Build the full messages array for Groq
    type GroqMessage = {
      role: 'system' | 'user' | 'assistant';
      content: string | { type: string; text?: string; image_url?: { url: string } }[];
    };

    const messages: GroqMessage[] = [
      // 1. System instruction (guardrails + identity rules)
      { role: 'system', content: GROQ_SYSTEM_INSTRUCTION },

      // 2. Prior conversation history
      ...(history || []).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.text,
      })),

      // 3. Current user message (text + any images)
      {
        role: 'user' as const,
        content: [
          { type: 'text', text: message },
          ...imageContentParts,
        ],
      },
    ];

    const completion = await groq.chat.completions.create({
      // model: 'llama-3.1-8b-instant',
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: messages as any,
      max_tokens: 1024,
    });

    const responseText = completion.choices[0]?.message?.content || 'No response generated.';
    res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error('[API Error] Chat Tutor (Groq):', error.message);
    res.status(500).json({ error: error.message || 'AI service temporarily unavailable.' });
  }
});

/**
 * POST /api/upload-material
 * Inserts a new study material (book, note, or pdf) record into the `study_materials` table.
 * Accepts JSON body: { title, type, level, semester, course_name, drive_link, uploader_id }
 * No file processing — Google Drive links only.
 */
app.post('/api/upload-material', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const typedReq = req as AuthenticatedRequest;
  const { title, type, level, semester, course_name, drive_link } = req.body;

  if (!title || !type || !level || !drive_link) {
    res.status(400).json({ error: 'Fields (title, type, level, drive_link) are always required.' });
    return;
  }

  if ((type === 'book' || type === 'note') && (!semester || !course_name)) {
    res.status(400).json({ error: 'Semester and Course Name are required for Books and Notes.' });
    return;
  }

  if (type === 'pdf' && !semester) {
    res.status(400).json({ error: 'Semester is required for Gen. PDFs.' });
    return;
  }

  if (!['book', 'note', 'pdf'].includes(type)) {
    res.status(400).json({ error: 'Invalid type. Must be "book", "note", or "pdf".' });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('study_materials')
      .insert([{ 
        title, 
        type, 
        level, 
        semester, 
        course_name: type === 'pdf' ? null : course_name, 
        drive_link, 
        uploader_id: typedReq.userId || null 
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Study material uploaded successfully', data });
  } catch (error: any) {
    console.error('[API Error] Upload Material:', error.message);
    res.status(500).json({ error: error.message || 'Failed to upload study material' });
  }
});

/**
 * DELETE /api/admin/materials/:id
 * Removes a study material record from the `study_materials` table.
 * Uses the service key to bypass Row Level Security.
 */
app.delete('/api/admin/materials/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    const { error } = await supabase
      .from('study_materials')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ message: 'Study material permanently deleted' });
  } catch (error: any) {
    console.error('[API Error] Delete Material:', error.message);
    res.status(500).json({ error: error.message || 'Failed to delete study material' });
  }
});

app.use((error: any, _req: Request, res: Response, _next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: `Upload rejected: ${error.message}` });
    return;
  }
  if (error?.message === 'Only image uploads are accepted.') {
    res.status(400).json({ error: error.message });
    return;
  }
  console.error('[Unhandled Error]', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[Server] Process initialized and listening on http://localhost:${PORT}`);
});