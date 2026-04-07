/**
 * Post-build prerender script.
 * Spins up a local static server from dist/client, renders / and /create
 * with Puppeteer, and saves the full HTML (with rendered body).
 */
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, join, extname } from 'path';

const DIST = resolve('dist/client');
const ROUTES = ['/', '/create'];
const PORT = 4173;

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

async function main() {
  // Start a simple static server for the built SPA
  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url!);
    if (!existsSync(filePath) || !extname(filePath)) {
      filePath = join(DIST, 'index.html');
    }
    try {
      const content = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise<void>(r => server.listen(PORT, r));
  console.log(`Static server on http://localhost:${PORT}`);

  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const url = `http://localhost:${PORT}${route}`;
    console.log(`Rendering ${route}...`);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for Vue to render
    await page.waitForSelector('#app > *', { timeout: 10000 });

    let html = await page.content();

    // Re-add the module script tag (Puppeteer strips type="module")
    // and make sure the original entry point is preserved for hydration
    const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
    const scriptMatch = indexHtml.match(/<script[^>]*src="[^"]*index[^"]*\.js"[^>]*><\/script>/);
    const cssMatch = indexHtml.match(/<link[^>]*href="[^"]*index[^"]*\.css"[^>]*>/);

    // Clean up any Puppeteer artifacts
    html = html.replace(/<style[^>]*data-vite-dev-id[^>]*>[\s\S]*?<\/style>/g, '');

    // Write the prerendered HTML
    const outDir = route === '/' ? DIST : join(DIST, route.slice(1));
    const { mkdirSync } = await import('fs');
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, 'index.html');
    writeFileSync(outPath, html, 'utf-8');
    console.log(`  → ${outPath} (${Math.round(html.length / 1024)} KB)`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerender complete.');
}

main().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
