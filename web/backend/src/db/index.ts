import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';
import { resolve, dirname } from 'path';

const __dirname = import.meta.dir;
const dbPath = resolve(__dirname, '../../data.db');
const sqlite = new Database(dbPath, { create: true });
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export { schema };
