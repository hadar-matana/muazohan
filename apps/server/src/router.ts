import { initTRPC } from '@trpc/server';
import { container } from './container';

const t = initTRPC.create();

export const appRouter = t.router({
  getSongs: t.procedure.query(async () => {
    try {
      return await container.songService.getAllSongs();
    } catch (error) {
      console.error('Error in getSongs procedure:', error);
      throw new Error('Failed to fetch songs');
    }
  }),

  getSongById: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'id' in val) {
        return { id: val.id as string };
      }
      throw new Error('Invalid input: id is required');
    })
    .query(async ({ input }) => {
      try {
        return await container.songService.getSongById(input.id);
      } catch (error) {
        console.error('Error in getSongById procedure:', error);
        throw new Error('Failed to fetch song');
      }
    }),

  createSong: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null) {
        const song = val as any;
        if (!song.title || !song.artist || !song.album) {
          throw new Error('Invalid input: title, artist, and album are required');
        }
        return song;
      }
      throw new Error('Invalid input');
    })
    .mutation(async ({ input }) => {
      try {
        return await container.songService.createSong(input);
      } catch (error) {
        console.error('Error in createSong procedure:', error);
        throw new Error('Failed to create song');
      }
    }),

  updateSong: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'id' in val) {
        return val as { id: string; [key: string]: any };
      }
      throw new Error('Invalid input: id is required');
    })
    .mutation(async ({ input }) => {
      try {
        const { id, ...updateData } = input;
        return await container.songService.updateSong(id, updateData);
      } catch (error) {
        console.error('Error in updateSong procedure:', error);
        throw new Error('Failed to update song');
      }
    }),

  deleteSong: t.procedure
    .input((val: unknown) => {
      if (typeof val === 'object' && val !== null && 'id' in val) {
        return { id: val.id as string };
      }
      throw new Error('Invalid input: id is required');
    })
    .mutation(async ({ input }) => {
      try {
        await container.songService.deleteSong(input.id);
        return { success: true };
      } catch (error) {
        console.error('Error in deleteSong procedure:', error);
        throw new Error('Failed to delete song');
      }
    }),
});

export type AppRouter = typeof appRouter;
