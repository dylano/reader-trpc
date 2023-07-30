import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

const connectionString =
  process.env.DATABASE_URL || 'DATABASE_URL is undefined';
const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

migrate(db, { migrationsFolder: 'drizzle' })
  .then(() => {
    console.log('Migration complete');
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    process.exit(0);
  });
