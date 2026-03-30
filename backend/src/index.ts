import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
 * POST /api/admin/create-user
 * Admin route to safely create a new user in Supabase Auth and the public database schema.
 */
app.post('/api/admin/create-user', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

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
app.post('/api/upload', upload.array('images', 10), async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'Missing required image payload' });
      return;
    }

    const { level, semester, course_name, question_type, uploaded_by } = req.body;

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
          uploaded_by,
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
app.get('/api/admin/users', async (req: Request, res: Response): Promise<void> => {
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
 * GET /api/contributors
 * Retrieves a list of all users styled as 'collector'.
 */
app.get('/api/contributors', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('role', 'collector');

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    console.error('[API Error] Fetch Contributors:', error.message);
    res.status(500).json({ error: error.message || 'Failed to retrieve contributors' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Force-removes a user, purging their avatar from Cloudinary and their Auth/Database records.
 */
app.delete('/api/admin/users/:id', async (req: Request, res: Response): Promise<void> => {
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
app.delete('/api/admin/questions/:id', async (req: Request, res: Response): Promise<void> => {
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
app.post('/api/user/profile', upload.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  const { userId, fullName, bio } = req.body;

  try {
    let avatarUrl = null;

    const { data: existingUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
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
      .eq('id', userId)
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
 * Domain-specific AI Tutor powered by Google Gemini 1.5 Flash.
 * Accepts: message (string), history (array), images (optional Cloudinary URL array).
 * Enforces strict Agricultural Economics domain guardrails.
 */
const GEMINI_SYSTEM_INSTRUCTION = `
You are a specialized AI Tutor built exclusively for the Agricultural Economics Question Bank at Sher-e-Bangla Agricultural University (SAU), Bangladesh.

CRITICAL RULES — you must follow all of these without exception:

RULE 1 — IDENTITY (HIGHEST PRIORITY):
If the user asks "Who made you?", "Who created you?", "Who developed this?", "Who built you?", or any similar question about your creator, developer, or the application's author, you MUST reply with EXACTLY this phrase: "Md. Adnan Eram Argho made me." Do not add anything else about the creator.

RULE 2 — DOMAIN RESTRICTION:
You are STRICTLY limited to helping with Agricultural Economics and related subjects taught at SAU. Your knowledge domain includes: Principles of Economics, Micro Economics, Macro Economics, Agricultural Marketing, Farm Management, Agricultural Finance, Production Economics, Econometrics, Mathematical Economics, Environmental Economics, Agricultural Policy and Planning, Agricultural Development Economics, Supply Chain Management, Financial Management, Organizational Behavior, Bangladesh Studies, Human Resource Management, and any other subject within the SAU Agricultural Economics curriculum.
You may also analyze and explain exam question papers if images are provided.

RULE 3 — REJECTION:
If the user asks about ANYTHING outside Agricultural Economics (including general knowledge, entertainment, movies, weather, coding, mathematics unrelated to economics, physics, chemistry, sports, politics, etc.), you MUST respond with EXACTLY: "I am here to help you only with Agricultural Economics and your exam questions." Do not attempt to answer off-topic questions under any circumstances.

Always be helpful, clear, and educational when answering questions that fall within your allowed domain. If images of question papers are provided, analyze them carefully to help the student understand the questions and concepts.
`;

app.post('/api/chat-tutor', async (req: Request, res: Response): Promise<void> => {
  const { message, history, images } = req.body as {
    message: string;
    history: { role: 'user' | 'model'; parts: { text: string }[] }[];
    images?: string[];
  };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'A valid message string is required.' });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
    });

    // Convert Cloudinary image URLs to base64 inline data
    const imageParts: { inlineData: { data: string; mimeType: string } }[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const url of images) {
        try {
          const imgResponse = await fetch(url);
          const arrayBuffer = await imgResponse.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
          imageParts.push({ inlineData: { data: base64, mimeType: contentType } });
        } catch (imgErr) {
          console.warn(`[Gemini] Could not fetch image: ${url}`, imgErr);
        }
      }
    }

    // Start chat session with prior conversation history
    const chat = model.startChat({ history: history || [] });

    // Build message parts: images first (if any), then the user's text
    const messageParts: Part[] = [
      ...imageParts,
      { text: message },
    ];

    const result = await chat.sendMessage(messageParts);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error: any) {
    console.error('[API Error] Chat Tutor:', error.message);
    res.status(500).json({ error: error.message || 'AI service temporarily unavailable.' });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Process initialized and listening on http://localhost:${PORT}`);
});