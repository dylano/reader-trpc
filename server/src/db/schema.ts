import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';

export const cats = pgTable('cats', {
  id: serial('id').primaryKey(),
  name: text('name'),
  age: integer('age'),
});
