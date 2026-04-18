import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { deleteFromStorage } from '../lib/storage';
import { requireAuth, requireAdmin, AuthenticatedRequest } from '../middleware';

const router = Router();

// Get master admin ID from environment variable (never hardcode sensitive IDs)
const MASTER_ADMIN_ID = process.env.MASTER_ADMIN_ID;

if (!MASTER_ADMIN_ID && process.env.NODE_ENV === 'production') {
  console.warn('[Security] MASTER_ADMIN_ID not set in production. Admin deletion protection is disabled.');
}

// Public — uses the service key so RLS is bypassed intentionally
router.get('/contributors', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, bio, avatar_url, role')
      .in('role', ['collector', 'admin'])
      .order('full_name', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch contributors';
    console.error('[Admin] Fetch contributors:', msg);
    res.status(500).json({ error: msg });
  }
});

router.get('/users', requireAuth, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve users';
    console.error('[Admin] Fetch users:', msg);
    res.status(500).json({ error: msg });
  }
});

router.post('/create-user', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
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
        .insert({ id: authData.user.id, email, role });
      if (dbError) {
        // Rollback: remove orphaned Auth account if DB insert fails
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
        throw dbError;
      }
    }

    res.status(201).json({ message: 'User provisioned successfully', user: authData.user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create user';
    console.error('[Admin] Create user:', msg);
    res.status(400).json({ error: msg });
  }
});

router.delete('/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const { userId } = req as AuthenticatedRequest;

  if (userId === id) {
    res.status(400).json({ error: 'You cannot delete your own account.' });
    return;
  }

  // 🛡️ Master Admin Protection Lock (configured via environment variable)
  if (MASTER_ADMIN_ID && id === MASTER_ADMIN_ID) {
    console.warn(`[Security] Deletion attempt blocked for master admin by user: ${userId}`);
    res.status(403).json({ error: 'Action Denied: This is the permanent master creator account and cannot be deleted.' });
    return;
  }

  try {
    const { data: user } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', id)
      .single();

    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    const { error: dbError } = await supabase.from('users').delete().eq('id', id);
    if (dbError) throw dbError;

    // Delete avatar only AFTER DB confirms deletion
    if (user?.avatar_url) {
      await deleteFromStorage(user.avatar_url).catch(() => {});
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete user';
    console.error('[Admin] Delete user:', msg);
    res.status(500).json({ error: msg });
  }
});

router.delete('/questions/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { data: question, error: fetchError } = await supabase
      .from('questions')
      .select('image_url, image_urls')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase.from('questions').delete().eq('id', id);
    if (deleteError) throw deleteError;

    // Delete images only AFTER DB confirms deletion
    if (question?.image_urls?.length > 0) {
      await Promise.all(question.image_urls.map((url: string) => deleteFromStorage(url).catch(() => {})));
    } else if (question?.image_url) {
      await deleteFromStorage(question.image_url).catch(() => {});
    }

    res.status(200).json({ message: 'Question deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete question';
    console.error('[Admin] Delete question:', msg);
    res.status(500).json({ error: msg });
  }
});

router.delete('/materials/:id', requireAuth, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('study_materials').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Study material deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete study material';
    console.error('[Admin] Delete material:', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;