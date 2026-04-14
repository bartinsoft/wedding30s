import { Router } from 'express';
import { query } from '../db/index.js';

const router = Router();
const BASE_URL = process.env.BASE_URL || 'https://wedding30s.com';

router.get('/sitemap.xml', async (_req, res) => {
  const weddings = (await query(
    'SELECT slug, updated_at FROM weddings WHERE status = ?',
    ['published'],
  )) as { slug: string; updated_at: string }[];

  const blogPosts = (await query(
    `SELECT slug, locale, updated_at, translated_slug
     FROM blog_posts WHERE published_at <= NOW()
     ORDER BY published_at DESC`,
  )) as { slug: string; locale: 'es' | 'en'; updated_at: string; translated_slug: string | null }[];

  const now = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  xml += `  <url>\n    <loc>${BASE_URL}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/create</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/blog/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  xml += `  <url>\n    <loc>${BASE_URL}/en/blog/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

  for (const w of weddings) {
    const lastmod = new Date(w.updated_at).toISOString().split('T')[0];
    xml += `  <url>\n    <loc>${BASE_URL}/${w.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }

  for (const p of blogPosts) {
    const lastmod = new Date(p.updated_at).toISOString().split('T')[0];
    const path = p.locale === 'en' ? `/en/blog/${p.slug}/` : `/blog/${p.slug}/`;
    let alts = '';
    if (p.translated_slug) {
      const esUrl = p.locale === 'es' ? `${BASE_URL}/blog/${p.slug}/` : `${BASE_URL}/blog/${p.translated_slug}/`;
      const enUrl = p.locale === 'en' ? `${BASE_URL}/en/blog/${p.slug}/` : `${BASE_URL}/en/blog/${p.translated_slug}/`;
      alts = `\n    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>`;
    }
    xml += `  <url>\n    <loc>${BASE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>${alts}\n  </url>\n`;
  }

  xml += '</urlset>';

  res.set('Content-Type', 'application/xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

export default router;
