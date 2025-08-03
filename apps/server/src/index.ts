import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // או '*' לפיתוח
  credentials: true,
}));

import { createExpressMiddleware } from '@trpc/server/adapters/express';

app.use(
  '/',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(3001, () => {
  console.log('✅ Server with CORS running at http://localhost:3001');
});
