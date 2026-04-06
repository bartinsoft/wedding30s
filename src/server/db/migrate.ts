import 'dotenv/config';
import mysql from 'mysql2/promise';
import { schema } from './schema.js';

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'wedding30s',
    password: process.env.DB_PASSWORD || 'wedding30s_dev',
    database: process.env.DB_NAME || 'wedding30s',
    multipleStatements: true,
  });

  await connection.query(schema);

  // Add maps_url column if missing (existing databases)
  try {
    await connection.query('ALTER TABLE weddings ADD COLUMN maps_url TEXT AFTER decorations');
    console.log('Added maps_url column');
  } catch {
    // Column already exists
  }

  console.log('Migration complete');
  await connection.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
