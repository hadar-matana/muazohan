import { z } from 'zod';

// Upload schema
export const uploadSchema = z.object({
  folder: z.string().optional().default('songs'),
});

// Delete file schema
export const deleteFileSchema = z.object({
  key: z.string().min(1, 'File key is required'),
});

// Get signed URL schema
export const getSignedUrlSchema = z.object({
  key: z.string().min(1, 'File key is required'),
  expires: z.string().optional().transform(val => {
    const parsed = parseInt(val || '3600');
    return isNaN(parsed) ? 3600 : parsed;
  }),
});

// List files schema
export const listFilesSchema = z.object({
  prefix: z.string().optional().default(''),
});

// File validation schema
export const fileValidationSchema = z.object({
  size: z.number().max(50 * 1024 * 1024, 'File size must be less than 50MB'),
  mimetype: z.string().refine(
    (type) => {
      const allowedMimeTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/m4a',
        'audio/aac',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      return allowedMimeTypes.includes(type);
    },
    'Invalid file type. Allowed: audio files (mp3, wav, ogg, m4a, aac) and images (jpeg, png, gif, webp)'
  ),
});

// Export types
export type UploadData = z.infer<typeof uploadSchema>;
export type DeleteFileData = z.infer<typeof deleteFileSchema>;
export type GetSignedUrlData = z.infer<typeof getSignedUrlSchema>;
export type ListFilesData = z.infer<typeof listFilesSchema>;
export type FileValidationData = z.infer<typeof fileValidationSchema>;
