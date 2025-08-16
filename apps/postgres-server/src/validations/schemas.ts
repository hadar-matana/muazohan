import { z } from 'zod';

// Song schemas
export const songCreateSchema = z.object({
  title: z.string().min(1).max(255),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1).optional(),
  albumId: z.string().min(1).optional(),
});

export const songUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1).optional(),
  albumId: z.string().min(1).optional(),
});

// Artist schemas
export const artistCreateSchema = z.object({
  name: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
});

export const artistUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().optional(),
});

// Album schemas
export const albumCreateSchema = z.object({
  name: z.string().min(1).max(255),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const albumUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

// Common schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => {
    const parsed = parseInt(val || '1');
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }),
  limit: z.string().optional().transform(val => {
    const parsed = parseInt(val || '20');
    return isNaN(parsed) || parsed < 1 ? 20 : Math.min(parsed, 100); // Max 100 items per page
  }),
});

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});

// Export types
export type SongCreateData = z.infer<typeof songCreateSchema>;
export type SongUpdateData = z.infer<typeof songUpdateSchema>;
export type ArtistCreateData = z.infer<typeof artistCreateSchema>;
export type ArtistUpdateData = z.infer<typeof artistUpdateSchema>;
export type AlbumCreateData = z.infer<typeof albumCreateSchema>;
export type AlbumUpdateData = z.infer<typeof albumUpdateSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type IdParamData = z.infer<typeof idParamSchema>;
export type SearchQueryData = z.infer<typeof searchQuerySchema>;
