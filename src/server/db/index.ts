import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { schema } from './schema.js';

const dataDir = path.resolve('data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.resolve('data', 'wedding30s.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(schema);

export default db;
