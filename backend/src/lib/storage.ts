import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const BUCKET_NAME = 'agri-resources';

/**
 * Convert image buffer to WebP format with optimized quality
 * @param fileBuffer - Original image buffer (JPEG, PNG, etc.)
 * @param quality - WebP quality (0-100), default 80 for optimal balance
 * @returns Converted WebP buffer
 */
const convertToWebP = async (fileBuffer: Buffer, quality: number = 80): Promise<Buffer> => {
  return await sharp(fileBuffer)
    .webp({ quality })
    .toBuffer();
};

/**
 * Ensure filename has .webp extension
 * @param fileName - Original filename (e.g., 'folder/image.jpg')
 * @returns Filename with .webp extension (e.g., 'folder/image.webp')
 */
const ensureWebPExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${fileName}.webp`;
  }
  return `${fileName.substring(0, lastDotIndex)}.webp`;
};

/**
 * Upload file to Supabase Storage with automatic WebP conversion
 * @param fileBuffer - The file buffer to upload (any image format)
 * @param fileName - The destination path in the bucket (e.g., 'folder/file.jpg')
 * @param contentType - MIME type (will be overridden to image/webp after conversion)
 * @returns Public URL of the uploaded WebP file
 */
export const uploadToSupabase = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> => {
  try {
    // Convert image to WebP format with quality 80
    const webpBuffer = await convertToWebP(fileBuffer, 80);
    
    // Ensure filename has .webp extension
    const webpFileName = ensureWebPExtension(fileName);
    
    // Upload converted WebP to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(webpFileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error during upload';
    throw new Error(`WebP conversion and upload failed: ${errorMessage}`);
  }
};

/**
 * Delete file from Supabase Storage by URL
 * @param imageUrl - The full public URL of the file to delete (works with any extension including .webp)
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
