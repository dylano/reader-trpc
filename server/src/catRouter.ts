import { v4 as uuid } from 'uuid';
import z from 'zod';
import { initTRPC, TRPCError } from '@trpc/server';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import type { Context } from './trpcContext';
import {
  cats as catTable,
  insertCatSchema,
  selectCatSchema,
} from './db/schema';

const client = postgres(
  process.env.DATABASE_URL || 'DATABASE_URL is undefined'
);
const db = drizzle(client);

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
});

export type CatRouter = typeof catRouter;
