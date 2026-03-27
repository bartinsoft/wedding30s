import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();
const BASE_URL = process.env.BASE_URL || 'https://wedding30s.com';

router.get('/sitemap.xml', async (_req, res) => {
  const weddings = (await query(
    'SELECT slug, updated_at FROM weddings WHERE status = ?',
    ['published'],
  )) as { slug: string; updated_at: string }[];

  const now = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/create</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

  for (const w of weddings) {
    const lastmod = new Date(w.updated_at).toISOString().split('T')[0];
    xml += `  <url>\n    <loc>${BASE_URL}/${w.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }

  xml += '</urlset>';

  res.set('Content-Type', 'application/xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

export default router;
