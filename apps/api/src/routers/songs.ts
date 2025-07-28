import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { mockSongs } from '../data/mockSongs';

export const songsRouter = router({
  // Get all songs
  getAll: publicProcedure.query(() => {
    return mockSongs;
  }),

  // Get song by ID
  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const song = mockSongs.find(song => song.id === input);
      if (!song) {
        throw new Error('Song not found');
      }
      return song;
    }),

  // Search songs
  search: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const searchTerm = input.toLowerCase();
      return mockSongs.filter(song => 
        song.title.toLowerCase().includes(searchTerm) ||
        song.artist.name.toLowerCase().includes(searchTerm) ||
        song.album.name.toLowerCase().includes(searchTerm)
      );
    }),
});