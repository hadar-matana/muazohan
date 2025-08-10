import { z } from 'zod';

// Common validation schemas for the web application
export const songSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url('Must be a valid URL').optional(),
  artistId: z.string().min(1, 'Artist is required'),
  albumId: z.string().min(1, 'Album is required'),
});

export const artistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

export const albumSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1, 'Artist is required'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});

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

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    };
  }
};

// Real-time validation helper for forms
export const validateField = <T>(schema: z.ZodSchema<T>, fieldName: string, value: unknown): string | null => {
  try {
    // Create a partial schema for the specific field
    const fieldSchema = z.object({ [fieldName]: schema.shape[fieldName as keyof T] });
    fieldSchema.parse({ [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => err.path[0] === fieldName);
      return fieldError ? fieldError.message : null;
    }
    return 'Invalid field';
  }
};

// Export types
export type SongFormData = z.infer<typeof songSchema>;
export type ArtistFormData = z.infer<typeof artistSchema>;
export type AlbumFormData = z.infer<typeof albumSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
