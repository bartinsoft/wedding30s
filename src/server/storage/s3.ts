import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';
import fs from 'node:fs';
import path from 'node:path';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET || 'wedding30s';

export async function uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return `/media/${key}`;
}

export async function uploadWeddingHtml(slug: string, html: string): Promise<void> {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: `weddings/${slug}/index.html`,
    Body: Buffer.from(html, 'utf-8'),
    ContentType: 'text/html; charset=utf-8',
    CacheControl: 'public, max-age=300',
  }));
}

export async function getWeddingHtml(slug: string): Promise<string | null> {
  // 1. Check local cache
  const localPath = path.resolve('weddings', slug, 'index.html');
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf-8');
  }

  // 2. Try S3
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: `weddings/${slug}/index.html`,
    }));
    const body = await streamToString(response.Body as Readable);

    // Cache locally
    const dir = path.resolve('weddings', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localPath, body, 'utf-8');

    return body;
  } catch {
    return null;
  }
}

async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export async function getFromS3(key: string): Promise<{ stream: Readable; contentType: string } | null> {
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }));

    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || 'application/octet-stream',
    };
  } catch {
    return null;
  }
}
