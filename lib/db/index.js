import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { jobs } from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const sqlite = new Database(databaseUrl);
const db = drizzle(sqlite, { schema: { jobs } });

// Run migrations on startup
try {
  migrate(db, { migrationsFolder: './lib/db/migrations' });
  console.log('Database migrations completed successfully');
} catch (error) {
  console.log('No migrations to run or migration failed:', error.message);
}

export { db, jobs };