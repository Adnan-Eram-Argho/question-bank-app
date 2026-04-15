import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { deleteFromCloudinary, streamUpload } from '../lib/cloudinary';
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
  
  // 🛡️ Rollback এর জন্য ভেরিয়েবলটি try ব্লকের বাইরে রাখা হলো
  let avatarUrl: string | null = null; 

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (req.file) {
      const result = await streamUpload(req.file.buffer, 'user_avatars');
      avatarUrl = result.secure_url;
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

    // ডাটাবেস আপডেট ফেইল করলে সাথে সাথে catch ব্লকে পাঠিয়ে দেবে
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('User profile not found for update.');

    // 🛡️ Issue #8 Fix: ডাটাবেস ১০০% সাকসেসফুল হলে তবেই ইউজারের "পুরনো" ছবি ডিলিট হবে
    if (avatarUrl && existingUser?.avatar_url) {
      await deleteFromCloudinary(existingUser.avatar_url, 'user_avatars').catch(() => {});
    }

    res.status(200).json({ message: 'Profile updated', user: data[0] });
  } catch (err: unknown) {
    // 🛡️ ROLLBACK: ডাটাবেস ফেইল করেছে, কিন্তু ছবি Cloudinary তে উঠে গেছে! 
    // তাই "নতুন আপলোড হওয়া" ছবিটা সাথে সাথে ক্লাউডিনারি থেকে মুছে দাও, যাতে স্টোরেজ ফুল না হয়।
    if (avatarUrl) {
      console.warn(`[Rollback] DB update failed. Deleting orphaned avatar from Cloudinary: ${avatarUrl}`);
      await deleteFromCloudinary(avatarUrl, 'user_avatars').catch(() => {});
    }

    const msg = err instanceof Error ? err.message : 'Profile update failed';
    console.error('[Auth] Update profile:', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;