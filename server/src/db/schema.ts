import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const cats = pgTable('cats', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
});

export type Cat = InferModel<typeof cats>;
export type NewCat = InferModel<typeof cats, 'insert'>;

export const insertCatSchema = createInsertSchema(cats).omit({ id: true });
export const selectCatSchema = createSelectSchema(cats);
