import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const BUCKET_NAME = 'agri-resources';

// Cloudinary যেন ব্লক না করে তাই ৩০০ মিলিসেকেন্ড ডিলে
const DELAY_MS = 300;
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function migrateAvatars() {
  console.log('🚀 Avatar Migration Started...\n');

  // ডাটাবেস থেকে শুধু সেই ইউজারদের আনবে যাদের প্রোফাইল ছবি আছে
  const { data: users, error } = await supabase
    .from('users')
    .select('id, avatar_url')
    .not('avatar_url', 'is', null);

  if (error) {
    console.error('❌ Failed to fetch users:', error);
    return;
  }

  const total = users.length;
  console.log(`📦 Found ${total} users with avatars.\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < total; i++) {
    const user = users[i];
    const oldUrl = user.avatar_url;

    // যদি অলরেডি Supabase-এর লিংক হয় বা Cloudinary না হয়, তবে স্কিপ করো
    if (!oldUrl || !oldUrl.includes('cloudinary.com')) {
      skippedCount++;
      continue;
    }

    try {
      // ছবি ডাউনলোড
      const response = await fetch(oldUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // 'avatars' ফোল্ডারে ইউজার আইডি দিয়ে ইউনিক নাম তৈরি
      const fileName = `avatars/${user.id}_${Date.now()}.jpg`;

      // সুপাবেসে আপলোড
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // নতুন পাবলিক ইউআরএল জেনারেট করা
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      // ইউজারের প্রোফাইলে নতুন লিংক আপডেট করা
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      console.log(`✅ [${i + 1}/${total}] Migrated avatar for User ID: ${user.id}`);
      successCount++;

      // Rate Limiting প্রটেকশন
      await sleep(DELAY_MS);

    } catch (err) {
      console.error(`❌ Error migrating avatar for user ${user.id}:`);
      failCount++;
    }
  }

  console.log('\n-----------------------------------');
  console.log('🎉 Avatar Migration Completed!');
  console.log(`✅ Successfully Migrated: ${successCount} avatars`);
  console.log(`❌ Failed: ${failCount} avatars`);
  console.log(`⏭️ Skipped (Already done/Invalid): ${skippedCount} users`);
}

migrateAvatars();