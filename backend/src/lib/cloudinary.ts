import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };

/** Wraps Cloudinary's callback-based upload_stream in a Promise. */
export const streamUpload = (fileBuffer: Buffer, folder: string): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

/**
 * Extracts the Cloudinary public_id from a secure URL and calls destroy().
 * Silently logs on failure so a bad URL never crashes a delete route.
 */
export const deleteFromCloudinary = async (imageUrl: string | null, folder: string): Promise<void> => {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split('/');
    const folderIndex = parts.findIndex((p) => p === folder);
    if (folderIndex === -1) return;
    const withExt = parts.slice(folderIndex).join('/');
    const lastDot = withExt.lastIndexOf('.');
    const publicId = lastDot !== -1 ? withExt.substring(0, lastDot) : withExt;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`[Cloudinary] Deletion failed for URL: ${imageUrl}`, err);
  }
};
