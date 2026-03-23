import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import weddingsRouter from './routes/weddings.js';
import webhooksRouter from './routes/webhooks.js';

for (const dir of ['data', 'public/uploads/tmp', 'weddings', 'templates']) {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
}

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve('public')));

const clientDist = path.resolve('dist/client');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.use(webhooksRouter);
app.use(weddingsRouter);

app.get('/:slug', (req, res, next) => {
  const htmlPath = path.resolve('weddings', req.params.slug, 'index.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
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
