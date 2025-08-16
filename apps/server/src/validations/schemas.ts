import { z } from 'zod';

// Artist ID schema
export const artistIdSchema = z.object({
  id: z.string().min(1, 'Artist ID is required')
});

// Album ID schema
export const albumIdSchema = z.object({
  id: z.string().min(1, 'Album ID is required')
});

// Search query schema
export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required')
});

// Upload song schema
export const uploadSongSchema = z.object({
  fileData: z.string(), // Base64 encoded file data
  fileName: z.string(),
  fileType: z.string(),
  title: z.string().min(1, 'Title is required'),
  artistId: z.string().optional(),
  albumId: z.string().optional(),
});

// Export types
export type ArtistIdData = z.infer<typeof artistIdSchema>;
export type AlbumIdData = z.infer<typeof albumIdSchema>;
export type SearchQueryData = z.infer<typeof searchQuerySchema>;
export type UploadSongData = z.infer<typeof uploadSongSchema>;
