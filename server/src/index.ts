import 'dotenv/config';
import express, { Application } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cors from 'cors';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { catRouter, createContext } from './catRouter';
import { cats } from './db/schema';

const client = postgres(
  process.env.DATABASE_URL || 'DATABASE_URL is undefined'
);
const db = drizzle(client);

// Query example
db.select()
  .from(cats)
  .then((catList) => {
    console.log({ catList });
  });

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
