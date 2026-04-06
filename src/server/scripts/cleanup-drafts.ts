import 'dotenv/config';
import mysql from 'mysql2/promise';

const DAYS = parseInt(process.env.CLEANUP_DAYS || '7', 10);

async function cleanup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'wedding30s',
    password: process.env.DB_PASSWORD || 'wedding30s_dev',
    database: process.env.DB_NAME || 'wedding30s',
  });

  // Delete guests of expired drafts first (FK constraint)
  const [guestResult] = await connection.execute(
    `DELETE g FROM guests g
     INNER JOIN weddings w ON g.wedding_id = w.id
     WHERE w.status = 'draft' AND w.created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [DAYS]
  ) as any;

  // Delete suggestions linked to expired drafts
  const [suggestionResult] = await connection.execute(
    `UPDATE suggestions SET wedding_id = NULL
     WHERE wedding_id IN (
       SELECT id FROM weddings WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)
     )`,
    [DAYS]
  ) as any;

  // Delete expired drafts
  const [result] = await connection.execute(
    `DELETE FROM weddings WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL ? DAY)`,
    [DAYS]
  ) as any;

  console.log(`Cleanup complete: ${result.affectedRows} drafts deleted (${guestResult.affectedRows} guests, ${suggestionResult.affectedRows} suggestions unlinked). Threshold: ${DAYS} days.`);

  await connection.end();
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
