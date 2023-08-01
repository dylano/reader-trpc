import { v4 as uuid } from 'uuid';
import z from 'zod';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import fetch from 'node-fetch';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import {
  cats as catTable,
  insertCatSchema,
  selectCatSchema,
} from './db/schema';

const client = postgres(
  process.env.DATABASE_URL || 'DATABASE_URL is undefined'
);
const db = drizzle(client);

const mastoAcctSchema = z.object({
  id: z.string(),
  username: z.string(),
  display_name: z.string(),
  url: z.string().url(),
  avatar: z.string().url(),
});

const tootCardSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string(),
  image: z.string().url().nullable().optional(),
});

const tootSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  uri: z.string().url(),
  content: z.string(),
  account: mastoAcctSchema,
  card: tootCardSchema.nullable().optional(),
});

const tootListSchema = z.array(tootSchema);

export type Toot = z.infer<typeof tootSchema>;
export type TootList = z.infer<typeof tootListSchema>;

export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

export const catRouter = t.router({
  get: t.procedure
    .input(z.object({ id: z.string() }))
    .output(selectCatSchema)
    .query(async (opts) => {
      const { input } = opts;
      const foundCat = await db
        .select()
        .from(catTable)
        .where(eq(catTable.id, input.id));
      if (!foundCat) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `could not find cat with id ${input}`,
        });
      }
      return foundCat[0];
    }),
  list: t.procedure.query(() => {
    return db.select().from(catTable);
  }),
  create: t.procedure.input(insertCatSchema).mutation(async (opts) => {
    const newCat = await db
      .insert(catTable)
      .values({ ...opts.input, id: uuid() })
      .returning();
    return newCat;
  }),
  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .output(z.string())
    .mutation(async (opts) => {
      const { input } = opts;
      const deadCat = await db
        .delete(catTable)
        .where(eq(catTable.id, input.id))
        .returning();
      if (deadCat) {
        return `${deadCat[0].name} died`;
      }
      return `all cats survived`;
    }),
  masto: t.procedure.output(tootListSchema).query(async () => {
    const res = await fetch('https://mas.to/api/v1/timelines/home?limit=5', {
      headers: {
        Authorization: `Bearer <insert token>`,
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json();
    console.log(json);
    return tootListSchema.parse(json);
  }),
});

export type CatRouter = typeof catRouter;
