import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../server/src/router';

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> = createTRPCReact<AppRouter>();
