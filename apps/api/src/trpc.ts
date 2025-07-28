import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// Create context
export const createContext = () => ({});
type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export tRPC utilities
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;