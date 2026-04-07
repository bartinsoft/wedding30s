import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import authRouter from './routes/auth.js';
import weddingsRouter from './routes/weddings.js';
import webhooksRouter from './routes/webhooks.js';
import sitemapRouter from './routes/sitemap.js';
import suggestionsRouter from './routes/suggestions.js';
import adminRouter from './routes/admin.js';
import { getFromS3, getWeddingHtml } from './storage/s3.js';

for (const dir of ['data', 'public/uploads/tmp', 'weddings', 'templates']) {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
}

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use('/api/webhooks/polar', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.resolve('public')));

const clientDist = path.resolve('dist/client');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.get('/media/*', async (req, res) => {
  const key = req.url.replace('/media/', '');
  const result = await getFromS3(key);
  if (!result) {
    res.status(404).send('Not found');
    return;
  }
  res.set('Content-Type', result.contentType);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  result.stream.pipe(res);
});

app.use(adminRouter);
app.use(webhooksRouter);
app.use(authRouter);
app.use(sitemapRouter);
app.use(suggestionsRouter);
app.use(weddingsRouter);

app.get('/api/wedding-page/:slug', async (req, res) => {
  const html = await getWeddingHtml(req.params.slug);
  if (html) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    return;
  }
  res.status(404).json({ error: 'Wedding not found' });
});

app.get('/:slug', async (req, res, next) => {
  const html = await getWeddingHtml(req.params.slug);
  if (html) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    return;
  }
  next();
});

if (fs.existsSync(clientDist)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(`wedding30s running on port ${port}`);
});

function shutdown() {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
