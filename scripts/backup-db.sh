#!/bin/bash
set -e

# Load env vars from production .env
source /data/projects/wedding30s/.env

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="backup-${TIMESTAMP}.sql.gz"
TMP_PATH="/tmp/${FILENAME}"

echo "[$(date)] Starting backup..."

mysqldump -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" | gzip > "${TMP_PATH}"

SIZE=$(du -h "${TMP_PATH}" | cut -f1)
echo "[$(date)] Dump created: ${SIZE}"

# Upload to S3 via the wedding30s container (has AWS SDK)
docker cp "${TMP_PATH}" wedding30s:/tmp/${FILENAME}
docker exec wedding30s node -e "
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const fs = require('fs');
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const body = fs.readFileSync('/tmp/${FILENAME}');
  s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: 'backups/${FILENAME}',
    Body: body,
    ContentType: 'application/gzip',
  })).then(() => {
    fs.unlinkSync('/tmp/${FILENAME}');
    console.log('Uploaded to S3');
  }).catch(e => { console.error(e); process.exit(1); });
"

rm -f "${TMP_PATH}"

echo "[$(date)] Backup uploaded: s3://${S3_BUCKET}/backups/${FILENAME}"
