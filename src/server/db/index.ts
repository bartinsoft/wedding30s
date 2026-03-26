import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'wedding30s',
  password: process.env.DB_PASSWORD || 'wedding30s_dev',
  database: process.env.DB_NAME || 'wedding30s',
  waitForConnections: true,
  connectionLimit: 10,
});

export async function query(sql: string, params: unknown[] = []): Promise<unknown[]> {
  const [rows] = await pool.execute(sql, params as any[]);
  return rows as unknown[];
}

export async function queryOne(sql: string, params: unknown[] = []): Promise<Record<string, unknown> | undefined> {
  const rows = await query(sql, params);
  return (rows as Record<string, unknown>[])[0];
}

export async function execute(sql: string, params: unknown[] = []): Promise<void> {
  await pool.execute(sql, params as any[]);
}

export default pool;
