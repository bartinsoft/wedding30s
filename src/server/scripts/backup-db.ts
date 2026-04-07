import 'dotenv/config';
import { execSync } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET || 'wedding30s';

async function backup() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = process.env.DB_PORT || '3306';
  const user = process.env.DB_USER || 'wedding30s';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'wedding30s';

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `backup-${timestamp}.sql.gz`;
  const tmpPath = `/tmp/${filename}`;

  console.log(`Creating backup of ${database}...`);

  execSync(
    `mysqldump -h ${host} -P ${port} -u ${user} -p'${password}' ${database} | gzip > ${tmpPath}`,
    { stdio: 'pipe' }
  );

  const fileBuffer = fs.readFileSync(tmpPath);
  const sizeKb = Math.round(fileBuffer.length / 1024);

  console.log(`Uploading ${filename} (${sizeKb} KB) to S3...`);

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: `backups/${filename}`,
    Body: fileBuffer,
    ContentType: 'application/gzip',
  }));

  fs.unlinkSync(tmpPath);

  console.log(`Backup uploaded: s3://${BUCKET}/backups/${filename}`);
}

backup().then(() => process.exit(0)).catch(err => {
  console.error('Backup failed:', err.message);
  process.exit(1);
});
