import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { MicroserviceClient } from './services/MicroserviceClient';

const t = initTRPC.create();

const microserviceClient = new MicroserviceClient();

export const appRouter = t.router({
  getSongs: t.procedure.query(async () => {
    try {
      return await microserviceClient.getAllSongs();
    } catch (error) {
      console.error('Error in getSongs procedure:', error);
      throw new Error('Failed to fetch songs');
    }
  }),
  
  getArtists: t.procedure.query(async () => {
    try {
      return await microserviceClient.getAllArtists();
    } catch (error) {
      console.error('Error in getArtists procedure:', error);
      throw new Error('Failed to fetch artists');
    }
  }),

  getArtistById: t.procedure
    .input(z.object({
      id: z.string().min(1, 'Artist ID is required')
    }))
    .query(async ({ input }) => {
      try {
        return await microserviceClient.getArtistById(input.id);
      } catch (error) {
        console.error('Error in getArtistById procedure:', error);
        throw new Error('Failed to fetch artist');
      }
    }),

  getAlbums: t.procedure.query(async () => {
    try {
      return await microserviceClient.getAllAlbums();
    } catch (error) {
      console.error('Error in getAlbums procedure:', error);
      throw new Error('Failed to fetch albums');
    }
  }),

  getAlbumById: t.procedure
    .input(z.object({
      id: z.string().min(1, 'Album ID is required')
    }))
    .query(async ({ input }) => {
      try {
        return await microserviceClient.getAlbumById(input.id);
      } catch (error) {
        console.error('Error in getAlbumById procedure:', error);
        throw new Error('Failed to fetch album');
      }
    }),

  searchSongs: t.procedure
    .input(z.object({
      query: z.string().min(1, 'Search query is required')
    }))
    .query(async ({ input }) => {
      try {
        return await microserviceClient.searchSongs(input.query);
      } catch (error) {
        console.error('Error in searchSongs procedure:', error);
        throw new Error('Failed to search songs');
      }
    }),

  uploadSong: t.procedure
    .input(z.object({
      fileData: z.string(), // Base64 encoded file data
      fileName: z.string(),
      fileType: z.string(),
      title: z.string().min(1, 'Title is required'),
      artistId: z.string().optional(),
      albumId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log('here4')
        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, 'base64');
        
        // Create a mock file object for the S3 service
        const mockFile = {
          buffer,
          originalname: input.fileName,
          mimetype: input.fileType,
          size: buffer.length,
        };
        
        // Upload file to S3
        const mp3Url = await microserviceClient.uploadFileToS3(mockFile, 'songs');
        
        // Get audio duration from the buffer
        const duration = await getAudioDurationFromBuffer(buffer);
        
        // Create song in database
        const song = await microserviceClient.createSong({
          title: input.title,
          duration,
          url: mp3Url,
          artistId: input.artistId,
          albumId: input.albumId,
        });
        
        return song;
      } catch (error) {
        console.error('Error in uploadSong procedure:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          input: {
            fileName: input.fileName,
            fileType: input.fileType,
            title: input.title,
            artistId: input.artistId,
            albumId: input.albumId,
            fileDataLength: input.fileData.length
          }
        });
        throw new Error('Failed to upload song');
      }
    }),
});

// Helper function to get audio duration from buffer
async function getAudioDurationFromBuffer(buffer: Buffer): Promise<number> {
  // For now, return a default duration since getting actual duration from buffer is complex
  // In a real implementation, you might want to use a library like 'music-metadata' or 'audio-duration'
  // TODO: Implement actual audio duration extraction
  console.log(`Getting duration for buffer of size: ${buffer.length} bytes`);
  return 180; // Default 3 minutes
}

export type AppRouter = typeof appRouter;
