import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function migrate() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const sql = await fs.readFile(path.join(here, '../migrations/001_init.sql'), 'utf8');
  await pool.query(sql);
}
