import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query, execute } from '../db/index.js';
import { renderBlogPostHtml, renderBlogIndexHtml, type BlogPost } from '../blog.js';

const router = Router();

const ADMIN_TOKEN = process.env.ADMIN_METRICS_TOKEN || '';

function isValidLocale(locale: unknown): locale is 'es' | 'en' {
  return locale === 'es' || locale === 'en';
}

async function fetchPostBySlug(slug: string, locale: 'es' | 'en'): Promise<BlogPost | null> {
  const rows = (await query(
    'SELECT * FROM blog_posts WHERE slug = ? AND locale = ? LIMIT 1',
    [slug, locale],
  )) as BlogPost[];
  return rows[0] ?? null;
}

async function fetchPostsByLocale(locale: 'es' | 'en'): Promise<BlogPost[]> {
  return (await query(
    'SELECT * FROM blog_posts WHERE locale = ? AND published_at <= NOW() ORDER BY published_at DESC',
    [locale],
  )) as BlogPost[];
}

router.get('/blog', async (_req, res) => {
  const posts = await fetchPostsByLocale('es');
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=600');
  res.send(renderBlogIndexHtml(posts, 'es'));
});

router.get('/blog/:slug', async (req, res, next) => {
  const post = await fetchPostBySlug(req.params.slug, 'es');
  if (!post) return next();
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=600');
  res.send(renderBlogPostHtml(post));
});

router.get('/en/blog', async (_req, res) => {
  const posts = await fetchPostsByLocale('en');
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=600');
  res.send(renderBlogIndexHtml(posts, 'en'));
});

router.get('/en/blog/:slug', async (req, res, next) => {
  const post = await fetchPostBySlug(req.params.slug, 'en');
  if (!post) return next();
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=600');
  res.send(renderBlogPostHtml(post));
});

/**
 * Admin upsert endpoint for the IA content pipeline.
 * Auth via X-Admin-Token (same as /api/admin/metrics).
 *
 * Body:
 *   slug, locale (es|en), title, description, content_html
 *   hero_image?, translated_slug?, published_at?
 */
router.post('/api/admin/blog/posts', async (req, res) => {
  const token = req.header('X-Admin-Token');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { slug, locale, title, description, content_html, hero_image, translated_slug, published_at } = req.body ?? {};

  if (!slug || typeof slug !== 'string') return res.status(400).json({ error: 'slug required' });
  if (!isValidLocale(locale)) return res.status(400).json({ error: 'locale must be es|en' });
  if (!title || typeof title !== 'string') return res.status(400).json({ error: 'title required' });
  if (!description || typeof description !== 'string') return res.status(400).json({ error: 'description required' });
  if (!content_html || typeof content_html !== 'string') return res.status(400).json({ error: 'content_html required' });

  const publishedAt = published_at ? new Date(published_at) : new Date();
  if (Number.isNaN(publishedAt.getTime())) return res.status(400).json({ error: 'invalid published_at' });

  const existing = await fetchPostBySlug(slug, locale);

  if (existing) {
    await execute(
      `UPDATE blog_posts
       SET title = ?, description = ?, content_html = ?, hero_image = ?, translated_slug = ?, published_at = ?
       WHERE slug = ? AND locale = ?`,
      [title, description, content_html, hero_image ?? null, translated_slug ?? null, publishedAt, slug, locale],
    );
    return res.json({ status: 'updated', id: existing.id, url: locale === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/` });
  }

  const id = randomUUID();
  await execute(
    `INSERT INTO blog_posts (id, slug, locale, title, description, content_html, hero_image, translated_slug, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, slug, locale, title, description, content_html, hero_image ?? null, translated_slug ?? null, publishedAt],
  );
  return res.json({ status: 'created', id, url: locale === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/` });
});

router.delete('/api/admin/blog/posts/:locale/:slug', async (req, res) => {
  const token = req.header('X-Admin-Token');
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { locale, slug } = req.params;
  if (!isValidLocale(locale)) return res.status(400).json({ error: 'locale must be es|en' });
  await execute('DELETE FROM blog_posts WHERE slug = ? AND locale = ?', [slug, locale]);
  res.json({ status: 'deleted' });
});

export default router;
