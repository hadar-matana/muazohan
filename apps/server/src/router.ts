import { initTRPC } from '@trpc/server';
// import { z } from 'zod';
import { mockSongs } from './songs';


const t = initTRPC.create();

export const appRouter = t.router({
  getSongs: t.procedure.query(() => {
    console.log('getSongs')
    return mockSongs;
  }),
});

export type AppRouter = typeof appRouter;
