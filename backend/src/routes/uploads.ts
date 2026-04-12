import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { deleteFromCloudinary, streamUpload } from '../lib/cloudinary';
import { requireAuth, uploadQuestions, AuthenticatedRequest } from '../middleware';

const router = Router();

router.post('/upload', requireAuth, uploadQuestions.array('images', 10), async (req: Request, res: Response): Promise<void> => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: 'Missing required image payload.' });
    return;
  }

  const { userId } = req as AuthenticatedRequest;
  const { level, semester, course_name, question_type, faculty } = req.body;
  if (!level || !semester || !course_name || !question_type) {
    res.status(400).json({ error: 'Required fields are missing for question upload.' });
    return;
  }

  try {
    // Upload all pages in parallel; order is preserved by Promise.all
    const results = await Promise.all(files.map((f) => streamUpload(f.buffer, 'question_bank')));
    const imageUrls = results.map((r) => r.secure_url);

    const { data, error } = await supabase
      .from('questions')
      .insert([{
        image_url: imageUrls[0],
        image_urls: imageUrls,
        faculty: faculty || 'Agricultural Economics',
        level,
        semester,
        course_name,
        question_type,
        uploaded_by: userId,
      }])
      .select();

    if (error) {
      // Clean up orphaned Cloudinary images if DB insert fails
      for (const url of imageUrls) {
        await deleteFromCloudinary(url, 'question_bank').catch(() => {});
      }
      throw error;
    }
    res.status(201).json({ message: 'Resource stored successfully', data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload resource';
    console.error('[Uploads] Question upload:', msg);
    res.status(500).json({ error: msg });
  }
});

router.post('/upload-material', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { userId } = req as AuthenticatedRequest;
  const { title, type, level, semester, course_name, drive_link, faculty } = req.body;

  if (!title || !type || !level || !drive_link) {
    res.status(400).json({ error: 'Fields (title, type, level, drive_link) are always required.' });
    return;
  }
  if (!['book', 'note', 'pdf'].includes(type)) {
    res.status(400).json({ error: 'Invalid type. Must be "book", "note", or "pdf".' });
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

  try {
    const { data, error } = await supabase
      .from('study_materials')
      .insert([{
        title,
        type,
        faculty: faculty || 'Agricultural Economics',
        level,
        semester,
        course_name: type === 'pdf' ? null : course_name,
        drive_link,
        uploader_id: userId ?? null,
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'Study material uploaded successfully', data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to upload study material';
    console.error('[Uploads] Material upload:', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;
