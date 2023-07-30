import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import { catRouter, createContext } from './catRouter';

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

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
