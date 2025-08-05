import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';
import { SongService } from './services/SongService';

const t = initTRPC.create();

const prisma = new PrismaClient();
const songService = new SongService(prisma);

export const appRouter = t.router({
  getSongs: t.procedure.query(async () => {
    try {
      return await songService.getAllSongs();
    } catch (error) {
      console.error('Error in getSongs procedure:', error);
      throw new Error('Failed to fetch songs');
    }
  }),
});

export type AppRouter = typeof appRouter;
