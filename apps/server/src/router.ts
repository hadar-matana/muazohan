import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { SongService } from './services/SongService';
import { ArtistService } from './services/ArtistService';
import { AlbumService } from './services/AlbumService';

const t = initTRPC.create();

const prisma = new PrismaClient();
const songService = new SongService(prisma);
const artistService = new ArtistService(prisma);
const albumService = new AlbumService(prisma);

export const appRouter = t.router({
  getSongs: t.procedure.query(async () => {
    try {
      return await songService.getAllSongs();
    } catch (error) {
      console.error('Error in getSongs procedure:', error);
      throw new Error('Failed to fetch songs');
    }
  }),
  
  getArtists: t.procedure.query(async () => {
    try {
      return await artistService.getAllArtists();
    } catch (error) {
      console.error('Error in getArtists procedure:', error);
      throw new Error('Failed to fetch artists');
    }
  }),

  getArtistById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'id' in val) {
        return val as { id: string };
      }
      throw new Error('Invalid input');
    })
    .query(async ({ input }) => {
      try {
        return await artistService.getArtistById(input.id);
      } catch (error) {
        console.error('Error in getArtistById procedure:', error);
        throw new Error('Failed to fetch artist');
      }
    }),

  getAlbums: t.procedure.query(async () => {
    try {
      return await albumService.getAllAlbums();
    } catch (error) {
      console.error('Error in getAlbums procedure:', error);
      throw new Error('Failed to fetch albums');
    }
  }),

  getAlbumById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'id' in val) {
        return val as { id: string };
      }
      throw new Error('Invalid input');
    })
    .query(async ({ input }) => {
      try {
        return await albumService.getAlbumById(input.id);
      } catch (error) {
        console.error('Error in getAlbumById procedure:', error);
        throw new Error('Failed to fetch album');
      }
    }),

  getAlbumsByArtistId: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'artistId' in val) {
        return val as { artistId: string };
      }
      throw new Error('Invalid input');
    })
    .query(async ({ input }) => {
      try {
        return await albumService.getAlbumsByArtistId(input.artistId);
      } catch (error) {
        console.error('Error in getAlbumsByArtistId procedure:', error);
        throw new Error('Failed to fetch albums by artist');
      }
    }),
});

export type AppRouter = typeof appRouter;
