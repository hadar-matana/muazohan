import { initTRPC } from '@trpc/server';
import { MicroserviceClient } from './services/MicroserviceClient';
import {
  artistIdSchema,
  albumIdSchema,
  searchQuerySchema,
  uploadSongSchema,
} from './validations';

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
    .input(artistIdSchema)
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
    .input(albumIdSchema)
    .query(async ({ input }) => {
      try {
        return await microserviceClient.getAlbumById(input.id);
      } catch (error) {
        console.error('Error in getAlbumById procedure:', error);
        throw new Error('Failed to fetch album');
      }
    }),

  searchSongs: t.procedure
    .input(searchQuerySchema)
    .query(async ({ input }) => {
      try {
        return await microserviceClient.searchSongs(input.query);
      } catch (error) {
        console.error('Error in searchSongs procedure:', error);
        throw new Error('Failed to search songs');
      }
    }),

  uploadSong: t.procedure
    .input(uploadSongSchema)
    .mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.fileData, 'base64');
        
        const mockFile = {
          buffer,
          originalname: input.fileName,
          mimetype: input.fileType,
          size: buffer.length,
        };
        
        const mp3Url = await microserviceClient.uploadFileToS3(mockFile, 'songs');
        
        const duration = await getAudioDurationFromBuffer(buffer);
        
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

async function getAudioDurationFromBuffer(buffer: Buffer): Promise<number> {

  console.log(`Getting duration for buffer of size: ${buffer.length} bytes`);
  return 180; 
}

export type AppRouter = typeof appRouter;
