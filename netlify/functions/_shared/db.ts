import { neon } from '@neondatabase/serverless';

/** Get a Neon SQL query function. Uses DATABASE_URL from env. */
export function getDb() {
  return neon(process.env.DATABASE_URL!);
}
