import Database from 'better-sqlite3';
import path from 'node:path';
import { schema } from './schema.js';

const dbPath = path.resolve('data', 'wedding30s.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(schema);

export default db;
