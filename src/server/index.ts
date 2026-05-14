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
import blogRouter from './routes/blog.js';
import wellKnownRouter from './routes/well-known.js';
import { getFromS3, getWeddingHtml } from './storage/s3.js';
import { agentLinkHeaders } from './middleware/agent-headers.js';
import { createRateLimiter } from './middleware/rate-limit.js';
import { wantsMarkdown, sendMarkdown, markdownNegotiation } from './middleware/markdown-negotiation.js';
import { handleMcpRequest, mcpMethodNotAllowed } from './mcp/index.js';
import { createWeddingDraft } from './mcp/draft.js';

for (const dir of ['data', 'public/uploads/tmp', 'weddings', 'templates']) {
  fs.mkdirSync(path.resolve(dir), { recursive: true });
}

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.set('trust proxy', true);

app.use('/api/webhooks/polar', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const MCP_HOST = process.env.MCP_HOST || 'mcp.wedding30s.com';
const mcpRateLimit = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 30 });
app.use((req, res, next) => {
  if (req.hostname !== MCP_HOST) return next();
  if (req.method === 'POST' && (req.path === '/' || req.path === '/mcp')) {
    return mcpRateLimit(req, res, () => handleMcpRequest(req, res));
  }
  if (req.path === '/' || req.path === '/mcp') return mcpMethodNotAllowed(req, res);
  res.status(404).json({ error: 'Not found on MCP host' });
});

const agentDraftRateLimit = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 10 });
app.post('/api/agent/create-wedding-draft', agentDraftRateLimit, async (req, res) => {
  try {
    const result = await createWeddingDraft(req.body);
    res.status(201).json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: msg });
  }
});

app.get('/', agentLinkHeaders);
app.head('/', agentLinkHeaders);

const BASE = process.env.BASE_URL || 'https://wedding30s.com';
const HOMEPAGE_MD = `# wedding30s

Create a beautiful wedding invitation website in minutes. **EUR 49 one-time** payment, no subscription, no ads.

## What you get

- A single-page wedding site at \`wedding30s.com/your-slug\`
- RSVP form with menu choices and allergies
- Photo gallery, story, program, menu sections
- 4 templates: classic-garden, minimal-white, romantic-blush, modern-dark
- Spanish and English

## How it works

1. Open [${BASE}/create](${BASE}/create)
2. Fill the wizard: names, date, location, story, photos
3. Preview as you go
4. Pay EUR 49 once → site goes live

## For AI agents

- Agent skills catalog: [${BASE}/.well-known/agent-skills/index.json](${BASE}/.well-known/agent-skills/index.json)
- API catalog: [${BASE}/.well-known/api-catalog](${BASE}/.well-known/api-catalog)
- MCP server: \`https://mcp.wedding30s.com\`
- llms.txt: [${BASE}/llms.txt](${BASE}/llms.txt)

Agents can create unpaid drafts via the MCP \`create_wedding_draft\` tool. Publishing requires a human-completed checkout.

## Links

- Home: [${BASE}/](${BASE}/)
- Blog (ES): [${BASE}/blog](${BASE}/blog)
- Blog (EN): [${BASE}/en/blog](${BASE}/en/blog)
- Create: [${BASE}/create](${BASE}/create)
- Terms: [${BASE}/legal/legal](${BASE}/legal/legal)
- Privacy: [${BASE}/legal/privacy](${BASE}/legal/privacy)

## Contact

support@wedding30s.com
`;

app.get('/', (req, res, next) => {
  if (wantsMarkdown(req)) {
    res.set('Cache-Control', 'public, max-age=300');
    return sendMarkdown(res, HOMEPAGE_MD);
  }
  next();
});

app.use(markdownNegotiation);

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

app.use(wellKnownRouter);
app.use(adminRouter);
app.use(webhooksRouter);
app.use(authRouter);
app.use(sitemapRouter);
app.use(suggestionsRouter);
app.use(weddingsRouter);
app.use(blogRouter);

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
