import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const BUCKET_NAME = 'agri-resources';

/**
 * Upload file to Supabase Storage and return public URL
 * @param fileBuffer - The file buffer to upload
 * @param fileName - The destination path in the bucket (e.g., 'folder/file.jpg')
 * @param contentType - MIME type of the file
 * @returns Public URL of the uploaded file
 */
export const uploadToSupabase = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

/**
 * Delete file from Supabase Storage by URL
 * @param imageUrl - The full public URL of the file to delete
 */
export const deleteFromStorage = async (imageUrl: string | null): Promise<void> => {
  if (!imageUrl || !imageUrl.includes('supabase.co')) return;
  
  try {
    const pathParts = imageUrl.split(`/${BUCKET_NAME}/`);
    if (pathParts.length < 2) return;
    
    const filePath = decodeURIComponent(pathParts[1]);
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]); 

    if (error) console.error('[Storage] Delete failed:', error.message);
    
  } catch (err) {
    console.error('[Storage] Delete error:', err);
  }
};