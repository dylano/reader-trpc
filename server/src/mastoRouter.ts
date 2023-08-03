import z from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import fetch from 'node-fetch';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { Context } from './trpcContext';

const client = postgres(
  process.env.DATABASE_URL || 'DATABASE_URL is undefined'
);
const db = drizzle(client);

const userAccountSchema = z.object({
  id: z.string(),
  username: z.string(),
  acct: z.string(),
  display_name: z.string(),
  url: z.string().url(),
  avatar: z.string().url(),
  header: z.string().url(),
});
const userAccountListSchema = z.array(userAccountSchema);
export type UserAccount = z.infer<typeof userAccountSchema>;
export type UserAccountList = z.infer<typeof userAccountListSchema>;

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
  account: userAccountSchema,
  card: tootCardSchema.nullable().optional(),
});
const tootListSchema = z.array(tootSchema);

export type Toot = z.infer<typeof tootSchema>;
export type TootList = z.infer<typeof tootListSchema>;

const t = initTRPC.context<Context>().create();

export const mastoRouter = t.router({
  toots: t.procedure.output(tootListSchema).query(async () => {
    const res = await fetch(
      `${process.env.MASTO_SERVER}/api/v1/timelines/home?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const json = await res.json();
    console.log(json);
    return tootListSchema.parse(json);
  }),
  follows: t.procedure.output(userAccountListSchema).query(async () => {
    const res = await fetch(
      `${process.env.MASTO_SERVER}/api/v1/accounts/${process.env.MASTO_ACCOUNT_ID}/following`
    );
    const json = await res.json();
    console.log(json);
    return userAccountListSchema.parse(json);
  }),
});

export type MastoRouter = typeof mastoRouter;
