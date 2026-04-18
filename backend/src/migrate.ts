import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const BUCKET_NAME = 'agri-resources';

// Cloudinary আমাদে ব্লক না করতে দেক এই ডিলে রাখ
const DELAY_MS = 300; // ৩০০ মিলিসেকেন্ড
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function migrateImages() {
  console.log('🚀 Migration Started: Cloudinary -> Supabase...\n');

  const { data: questions, error } = await supabase
    .from('questions')
    .select('id, image_url, image_urls')
    .order('id');

  if (error) {
    console.error('❌ Failed to fetch questions:', error);
    return;
  }

  const total = questions.length;
  console.log(`📦 Found ${total} questions to process.\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < total; i++) {
    const question = questions[i];
    const oldUrls: string[] = question.image_urls || [];
    const newUrls: string[] = [];
    let needsUpdate = false;

    // ইতিমধ্যেই Cloudinary URL না থাকলে স্কিপ করো
    const hasCloudinaryUrl = oldUrls.some(url => url.includes('cloudinary.com'));
    
    if (!hasCloudinaryUrl) {
      skippedCount++;
      continue;
    }

    for (const oldUrl of oldUrls) {
      if (oldUrl.includes('cloudinary.com')) {
        try {
          const response = await fetch(oldUrl);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = response.headers.get('content-type') || 'image/jpeg';

          // Question ID দিয়ে ফাইলের নাম তৈরি (ট্র্যাকিংয়ের জন্য)
          const fileName = `questions/${question.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
              contentType,
              upsert: true,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

          newUrls.push(publicUrlData.publicUrl);
          needsUpdate = true;
          successCount++;

          // 🔥 Cloudinary Rate Limiting থেকে বাঁচতে এই লাইনটা জরুরি
          await sleep(DELAY_MS);
        } catch (err) {
          console.error(`❌ Error: ${oldUrl.substring(0, 60)}...`);
          newUrls.push(oldUrl); // ফেইল হলে পুরনো লিংকটাই রেখে দিবে
          failCount++;
        }
      } else {
        newUrls.push(oldUrl);
      }
    }

    if (needsUpdate) {
      const updateData: Record<string, unknown> = {
        image_urls: newUrls,
      };
      // ✅্যাড করা: image_url কেও প্রথম নতুন URL দিচ্ছি
      if (newUrls.length > 0) {
        updateData.image_url = newUrls[0];
      }

      const { error: updateError } = await supabase
        .from('questions')
        .update(updateData)
        .eq('id', question.id);

      if (updateError) {
        console.error(`❌ DB update failed for ID ${question.id}`);
      } else {
        console.log(`✅ [${i + 1}/${total}] Migrated question ID ${question.id}`);
      }
    }

    // প্রতি ১০টি পর প্রগ্রেস দেখাও
    if ((i + 1) % 10 === 0) {
      console.log(`�খন পর্যন্ত ${i + 1}/${total}...`);
    }
  }

  console.log('\n-----------------------------------');
  console.log('🎉 Migration Completed!');
  console.log(`✅ Successfully Migrated: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`�ভাবে স্কিপ করা: ${skippedCount} questions`);
}

migrateImages();