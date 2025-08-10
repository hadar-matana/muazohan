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
});

export type AppRouter = typeof appRouter;
