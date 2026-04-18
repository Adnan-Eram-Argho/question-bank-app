import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { deleteFromStorage, uploadToSupabase } from '../lib/storage';
import { requireAuth, uploadAvatar, AuthenticatedRequest } from '../middleware';

const router = Router();

router.get('/profile', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { userId } = req as AuthenticatedRequest;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, bio, avatar_url, role')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch profile';
    console.error('[Auth] Fetch profile:', msg);
    res.status(500).json({ error: msg });
  }
});

router.post('/profile', requireAuth, uploadAvatar.single('avatar'), async (req: Request, res: Response): Promise<void> => {
  const { fullName, bio } = req.body;
  const { userId } = req as AuthenticatedRequest;
  
  // 🛡️ Variable declared outside try block for rollback support
  let avatarUrl: string | null = null; 

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (req.file) {
      const fileName = `avatars/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      avatarUrl = await uploadToSupabase(req.file.buffer, fileName, 'image/jpeg');
    }

    const updateData: Record<string, string | null> = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl) updateData.avatar_url = avatarUrl;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select();

    // Immediately throw to catch block if database update fails
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('User profile not found for update.');

    // 🛡️ Issue #8 Fix: Only delete old avatar after 100% successful database update
    if (avatarUrl && existingUser?.avatar_url) {
      await deleteFromStorage(existingUser.avatar_url).catch(() => {});
    }

    res.status(200).json({ message: 'Profile updated', user: data[0] });
  } catch (err: unknown) {
    // 🛡️ ROLLBACK: Database failed but image was uploaded to Supabase Storage!
    // Delete the newly uploaded avatar immediately to prevent storage bloat.
    if (avatarUrl) {
      console.warn(`[Rollback] DB update failed. Deleting orphaned avatar from Supabase: ${avatarUrl}`);
      await deleteFromStorage(avatarUrl).catch(() => {});
    }

    const msg = err instanceof Error ? err.message : 'Profile update failed';
    console.error('[Auth] Update profile:', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;