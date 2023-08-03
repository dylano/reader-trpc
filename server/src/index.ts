import 'dotenv/config';
import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import { createContext } from './trpcContext';
import { catRouter } from './catRouter';
import { mastoRouter } from './mastoRouter';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(
  '/cat',
  createExpressMiddleware({
    router: catRouter,
    createContext,
  })
);
app.use(
  '/masto',
  createExpressMiddleware({
    router: mastoRouter,
    createContext,
  })
);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
