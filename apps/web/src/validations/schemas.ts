import { z } from 'zod';

// Song schema
export const songSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url('Must be a valid URL').optional(),
  artistId: z.string().min(1, 'Artist is required'),
  albumId: z.string().min(1, 'Album is required'),
});

// Artist schema
export const artistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

// Album schema
export const albumSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1, 'Artist is required'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});

// File upload schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024, // 50MB
    'File size must be less than 50MB'
  ).refine(
    (file) => {
      const allowedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
      ];
      return allowedTypes.includes(file.type);
    },
    'Invalid file type. Allowed: audio files (mp3, wav, ogg, m4a, aac) and images (jpeg, png, gif, webp)'
  ),
  folder: z.string().optional().default('songs'),
});

// Export types
export type SongFormData = z.infer<typeof songSchema>;
export type ArtistFormData = z.infer<typeof artistSchema>;
export type AlbumFormData = z.infer<typeof albumSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
