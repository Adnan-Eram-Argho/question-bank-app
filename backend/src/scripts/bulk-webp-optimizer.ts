/**
 * ═══════════════════════════════════════════════════════════════
 *  BULK WEBP OPTIMIZER — Legacy Image Migration Script
 * ═══════════════════════════════════════════════════════════════
 *
 *  Purpose:  Convert all legacy JPG/PNG images in the agri-resources
 *            Supabase bucket to WebP format (quality 80).
 *
 *  Safety:   - Dry-run first, waits for user confirmation
 *            - Per-image try-catch (one failure never stops the batch)
 *            - DB update BEFORE original deletion
 *            - 300ms delay between images to avoid rate-limiting
 *
 *  Tables:   questions (image_url + image_urls[])
 *            users     (avatar_url)
 *
 *  Usage:    npx ts-node src/scripts/bulk-webp-optimizer.ts
 * ═══════════════════════════════════════════════════════════════
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import * as readline from 'readline';

// ── Bootstrap ────────────────────────────────────────────────
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = 'agri-resources';

// ── Helpers ──────────────────────────────────────────────────

/** Check if a URL points to a legacy (non-WebP) image */
const isLegacy = (url: string): boolean => {
  if (!url) return false;
  return !url.toLowerCase().endsWith('.webp');
};

/** Swap file extension to .webp */
const toWebPPath = (filePath: string): string => {
  const lastDot = filePath.lastIndexOf('.');
  if (lastDot === -1) return `${filePath}.webp`;
  return `${filePath.substring(0, lastDot)}.webp`;
};

/** Extract the storage file path from a full Supabase public URL */
const extractPath = (url: string): string | null => {
  const parts = url.split(`/${BUCKET}/`);
  if (parts.length < 2) return null;
  return decodeURIComponent(parts[1]);
};

/** Sleep utility for rate-limit protection */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** Prompt user for confirmation */
const confirm = (prompt: string): Promise<boolean> => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase() === 'GO');
    });
  });
};

// ── Core: Convert a single image URL ────────────────────────
interface ConversionResult {
  oldUrl: string;
  newUrl: string;
  savedBytes: number;
}

const convertSingleImage = async (url: string): Promise<ConversionResult> => {
  const filePath = extractPath(url);
  if (!filePath) throw new Error(`Cannot extract path from: ${url}`);

  // Step A: Download original
  const { data: fileData, error: dlError } = await supabase.storage
    .from(BUCKET)
    .download(filePath);

  if (dlError || !fileData) throw new Error(`Download failed for ${filePath}: ${dlError?.message}`);

  const originalBuffer = Buffer.from(await fileData.arrayBuffer());
  const originalSize = originalBuffer.length;

  // Step B: Transform to WebP
  const webpBuffer = await sharp(originalBuffer).webp({ quality: 80 }).toBuffer();
  const webpSize = webpBuffer.length;

  // Step C: Upload new .webp file
  const webpPath = toWebPPath(filePath);

  const { error: upError } = await supabase.storage
    .from(BUCKET)
    .upload(webpPath, webpBuffer, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (upError) throw new Error(`Upload failed for ${webpPath}: ${upError.message}`);

  // Build new public URL
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(webpPath);
  const newUrl = publicUrlData.publicUrl;

  return {
    oldUrl: url,
    newUrl,
    savedBytes: originalSize - webpSize,
  };
};

// ── Phase: Process Questions ────────────────────────────────
const processQuestions = async (): Promise<{ converted: number; failed: number; totalSaved: number }> => {
  // Fetch ALL questions — we'll filter client-side since Supabase doesn't support NOT LIKE on arrays easily
  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, image_url, image_urls')
    .order('id', { ascending: true });

  if (error) throw new Error(`Failed to fetch questions: ${error.message}`);
  if (!questions || questions.length === 0) {
    console.log('  No questions found.');
    return { converted: 0, failed: 0, totalSaved: 0 };
  }

  // Filter to only those with at least one legacy URL
  const legacyQuestions = questions.filter(q => {
    if (q.image_url && isLegacy(q.image_url)) return true;
    if (q.image_urls && Array.isArray(q.image_urls)) {
      return q.image_urls.some((u: string) => isLegacy(u));
    }
    return false;
  });

  console.log(`  Found ${legacyQuestions.length} questions with legacy images.\n`);

  let converted = 0;
  let failed = 0;
  let totalSaved = 0;

  for (let i = 0; i < legacyQuestions.length; i++) {
    const q = legacyQuestions[i];
    const urls: string[] = q.image_urls && Array.isArray(q.image_urls) ? q.image_urls : [q.image_url];

    try {
      const newUrls: string[] = [];
      const oldUrls: string[] = [];
      let questionSaved = 0;

      // Convert each image in the question
      for (const url of urls) {
        if (!url) continue;

        if (!isLegacy(url)) {
          // Already WebP — keep as-is
          newUrls.push(url);
          continue;
        }

        const result = await convertSingleImage(url);
        newUrls.push(result.newUrl);
        oldUrls.push(result.oldUrl);
        questionSaved += result.savedBytes;

        await sleep(300); // Rate-limit protection
      }

      // Step D: DB Update — update BOTH columns atomically
      const { error: updateError } = await supabase
        .from('questions')
        .update({
          image_url: newUrls[0],
          image_urls: newUrls,
        })
        .eq('id', q.id);

      if (updateError) {
        throw new Error(`DB update failed for question ${q.id}: ${updateError.message}`);
      }

      // Step E: Cleanup — delete originals ONLY after successful DB update
      for (const oldUrl of oldUrls) {
        const oldPath = extractPath(oldUrl);
        if (oldPath) {
          const { error: delError } = await supabase.storage.from(BUCKET).remove([oldPath]);
          if (delError) {
            console.warn(`  ⚠️  Cleanup warning: Could not delete ${oldPath}: ${delError.message}`);
          }
        }
      }

      totalSaved += questionSaved;
      converted++;
      const savedKB = (questionSaved / 1024).toFixed(1);
      console.log(`  [${i + 1}/${legacyQuestions.length}] ✅ Question #${q.id} — ${urls.length} image(s) converted (saved ${savedKB} KB)`);

    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  [${i + 1}/${legacyQuestions.length}] ❌ Question #${q.id} — ${msg}`);
    }
  }

  return { converted, failed, totalSaved };
};

// ── Phase: Process Users ────────────────────────────────────
const processUsers = async (): Promise<{ converted: number; failed: number; totalSaved: number }> => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, avatar_url')
    .not('avatar_url', 'is', null)
    .order('id', { ascending: true });

  if (error) throw new Error(`Failed to fetch users: ${error.message}`);
  if (!users || users.length === 0) {
    console.log('  No users with avatars found.');
    return { converted: 0, failed: 0, totalSaved: 0 };
  }

  const legacyUsers = users.filter(u => u.avatar_url && isLegacy(u.avatar_url));
  console.log(`  Found ${legacyUsers.length} users with legacy avatars.\n`);

  let converted = 0;
  let failed = 0;
  let totalSaved = 0;

  for (let i = 0; i < legacyUsers.length; i++) {
    const u = legacyUsers[i];

    try {
      const result = await convertSingleImage(u.avatar_url);

      // Step D: DB Update
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: result.newUrl })
        .eq('id', u.id);

      if (updateError) {
        throw new Error(`DB update failed for user ${u.email}: ${updateError.message}`);
      }

      // Step E: Cleanup
      const oldPath = extractPath(result.oldUrl);
      if (oldPath) {
        const { error: delError } = await supabase.storage.from(BUCKET).remove([oldPath]);
        if (delError) {
          console.warn(`  ⚠️  Cleanup warning: Could not delete ${oldPath}: ${delError.message}`);
        }
      }

      totalSaved += result.savedBytes;
      converted++;
      const savedKB = (result.savedBytes / 1024).toFixed(1);
      console.log(`  [${i + 1}/${legacyUsers.length}] ✅ ${u.email} — avatar converted (saved ${savedKB} KB)`);

      await sleep(300);

    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  [${i + 1}/${legacyUsers.length}] ❌ ${u.email} — ${msg}`);
    }
  }

  return { converted, failed, totalSaved };
};

// ── Verification ────────────────────────────────────────────
const verify = async (): Promise<void> => {
  console.log('\n═══════════════════════════════════════════════');
  console.log('  POST-MIGRATION VERIFICATION');
  console.log('═══════════════════════════════════════════════\n');

  // Check questions
  const { data: legacyQ, error: qErr } = await supabase
    .from('questions')
    .select('id, image_url')
    .not('image_url', 'like', '%.webp');

  if (qErr) {
    console.error('  ❌ Verification query failed for questions:', qErr.message);
  } else {
    const count = legacyQ?.length ?? 0;
    if (count === 0) {
      console.log('  ✅ questions.image_url — ALL records are .webp');
    } else {
      console.warn(`  ⚠️  questions.image_url — ${count} records still have legacy URLs`);
      legacyQ?.slice(0, 5).forEach(q => console.warn(`     → Question #${q.id}: ${q.image_url}`));
    }
  }

  // Check users
  const { data: legacyU, error: uErr } = await supabase
    .from('users')
    .select('id, email, avatar_url')
    .not('avatar_url', 'is', null)
    .not('avatar_url', 'like', '%.webp');

  if (uErr) {
    console.error('  ❌ Verification query failed for users:', uErr.message);
  } else {
    const count = legacyU?.length ?? 0;
    if (count === 0) {
      console.log('  ✅ users.avatar_url — ALL records are .webp (or null)');
    } else {
      console.warn(`  ⚠️  users.avatar_url — ${count} records still have legacy URLs`);
      legacyU?.forEach(u => console.warn(`     → ${u.email}: ${u.avatar_url}`));
    }
  }
};

// ── Main ────────────────────────────────────────────────────
const main = async () => {
  console.log('\n═══════════════════════════════════════════════');
  console.log('  BULK WEBP OPTIMIZER — DRY RUN REPORT');
  console.log('═══════════════════════════════════════════════\n');

  // Count legacy questions
  const { data: allQ } = await supabase.from('questions').select('id, image_url, image_urls');
  const legacyQuestions = (allQ || []).filter(q => {
    if (q.image_url && isLegacy(q.image_url)) return true;
    if (q.image_urls && Array.isArray(q.image_urls)) return q.image_urls.some((u: string) => isLegacy(u));
    return false;
  });

  // Count total individual legacy images across all questions
  let totalLegacyImages = 0;
  for (const q of legacyQuestions) {
    const urls: string[] = q.image_urls && Array.isArray(q.image_urls) ? q.image_urls : [q.image_url];
    totalLegacyImages += urls.filter((u: string) => u && isLegacy(u)).length;
  }

  // Count legacy users
  const { data: allU } = await supabase
    .from('users')
    .select('id, avatar_url')
    .not('avatar_url', 'is', null);
  const legacyUsers = (allU || []).filter(u => u.avatar_url && isLegacy(u.avatar_url));

  console.log(`  Questions with legacy images:  ${legacyQuestions.length}`);
  console.log(`  Total legacy image files:       ${totalLegacyImages}`);
  console.log(`  Users with legacy avatars:      ${legacyUsers.length}`);
  console.log(`  Total files to convert:         ${totalLegacyImages + legacyUsers.length}`);
  console.log('\n═══════════════════════════════════════════════');

  if (totalLegacyImages + legacyUsers.length === 0) {
    console.log('\n  ✅ Nothing to migrate — all images are already WebP!');
    process.exit(0);
  }

  // Wait for confirmation
  const proceed = await confirm('\n  Type "GO" to proceed, or Ctrl+C to abort: ');
  if (!proceed) {
    console.log('\n  Aborted by user.');
    process.exit(0);
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log('  PHASE 1: Converting Question Images');
  console.log('═══════════════════════════════════════════════\n');

  const qResult = await processQuestions();

  console.log('\n═══════════════════════════════════════════════');
  console.log('  PHASE 2: Converting User Avatars');
  console.log('═══════════════════════════════════════════════\n');

  const uResult = await processUsers();

  // ── Final Summary ──
  const totalConverted = qResult.converted + uResult.converted;
  const totalFailed = qResult.failed + uResult.failed;
  const totalSavedMB = ((qResult.totalSaved + uResult.totalSaved) / (1024 * 1024)).toFixed(2);

  console.log('\n═══════════════════════════════════════════════');
  console.log('  MIGRATION COMPLETE — FINAL SUMMARY');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`  Questions converted:  ${qResult.converted}/${qResult.converted + qResult.failed}`);
  console.log(`  Avatars converted:    ${uResult.converted}/${uResult.converted + uResult.failed}`);
  console.log(`  Total converted:      ${totalConverted}`);
  console.log(`  Total failed:         ${totalFailed}`);
  console.log(`  Storage reclaimed:    ~${totalSavedMB} MB`);
  console.log('\n═══════════════════════════════════════════════\n');

  // Run verification
  await verify();

  process.exit(0);
};

main().catch((err) => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});
