import { initTRPC } from '@trpc/server';
// import { z } from 'zod';
// import { mockSongs } from './songs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const t = initTRPC.create();

export const appRouter = t.router({
  getSongs: t.procedure.query(async () => {
    const songs = await prisma.songs.findMany();
    console.log(songs)

    return songs;
  }),
});

export type AppRouter = typeof appRouter;
