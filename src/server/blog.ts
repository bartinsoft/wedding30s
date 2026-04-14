/**
 * Server-side rendered blog for wedding30s.
 *
 * Goal: SEO-first content marketing pages that funnel readers into the wizard.
 * Single CTA per page ("Create your wedding website in 5 minutes — €49") with
 * no variants, per the cúpula decision (2026-04-14).
 */

const BASE_URL = process.env.BASE_URL || 'https://wedding30s.com';
const GA4_ID = process.env.GA4_ID || process.env.VITE_GA4_ID || '';

export interface BlogPost {
  id: string;
  slug: string;
  locale: 'es' | 'en';
  title: string;
  description: string;
  content_html: string;
  hero_image: string | null;
  translated_slug: string | null;
  published_at: string | Date;
  updated_at?: string | Date;
}

const STRINGS: Record<'es' | 'en', { ctaButton: string; ctaSub: string; readMore: string; siteTitle: string; backToBlog: string; published: string; updated: string; }> = {
  en: {
    ctaButton: 'Create your wedding website',
    ctaSub: 'in 5 minutes — €49',
    readMore: 'Read more',
    siteTitle: 'Wedding30s — Beautiful wedding websites in 30 seconds',
    backToBlog: '← All articles',
    published: 'Published',
    updated: 'Updated',
  },
  es: {
    ctaButton: 'Crea la web de tu boda',
    ctaSub: 'en 5 minutos — 49€',
    readMore: 'Leer más',
    siteTitle: 'Wedding30s — Webs de boda preciosas en 30 segundos',
    backToBlog: '← Todos los artículos',
    published: 'Publicado',
    updated: 'Actualizado',
  },
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ga4Snippet(): string {
  if (!GA4_ID) return '';
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');</script>`;
}

function formatDate(value: string | Date, locale: 'es' | 'en'): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function postUrl(post: { slug: string; locale: 'es' | 'en' }): string {
  return post.locale === 'en'
    ? `${BASE_URL}/en/blog/${post.slug}/`
    : `${BASE_URL}/blog/${post.slug}/`;
}

const STYLES = `
  *,*::before,*::after{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#2d2a26;background:#fbf8f4;line-height:1.7;font-size:17px}
  a{color:#9d6b3a;text-decoration:none}
  a:hover{text-decoration:underline}
  .nav{position:sticky;top:0;z-index:50;background:rgba(251,248,244,0.96);backdrop-filter:blur(8px);border-bottom:1px solid #e8e1d6;padding:14px 20px}
  .nav-inner{max-width:780px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px}
  .brand{font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#2d2a26;letter-spacing:-0.01em}
  .cta{display:inline-flex;flex-direction:column;align-items:center;background:#9d6b3a;color:#fff !important;padding:9px 18px;border-radius:8px;font-weight:600;font-size:14px;line-height:1.2;transition:background .15s}
  .cta:hover{background:#7d5328;text-decoration:none}
  .cta-sub{font-size:11px;font-weight:400;opacity:.85;margin-top:2px}
  main{max-width:720px;margin:0 auto;padding:48px 20px 80px}
  .post-header{text-align:center;margin-bottom:40px}
  .post-meta{font-size:13px;color:#6b665f;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px}
  .post-title{font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:1.2;font-weight:700;margin:0 0 18px;color:#2d2a26;letter-spacing:-0.01em}
  .post-description{font-size:19px;color:#5a554c;margin:0;font-style:italic}
  .hero{margin:0 -20px 40px;border-radius:12px;overflow:hidden}
  .hero img{width:100%;height:auto;display:block}
  article{font-size:17px}
  article h2{font-family:Georgia,serif;font-size:28px;margin:48px 0 18px;color:#2d2a26;line-height:1.3}
  article h3{font-family:Georgia,serif;font-size:22px;margin:36px 0 14px;color:#2d2a26}
  article p{margin:0 0 18px}
  article ul,article ol{padding-left:24px;margin:0 0 18px}
  article li{margin-bottom:8px}
  article blockquote{border-left:3px solid #9d6b3a;padding:6px 0 6px 20px;margin:24px 0;color:#5a554c;font-style:italic}
  article img{max-width:100%;height:auto;border-radius:8px;margin:24px 0}
  article code{background:#f1ebe1;padding:2px 6px;border-radius:4px;font-size:.92em}
  article pre{background:#2d2a26;color:#fbf8f4;padding:18px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.55}
  article pre code{background:transparent;padding:0;color:inherit}
  .footer-cta{margin:64px -20px 0;padding:48px 24px;background:#fff;border-radius:12px;text-align:center;border:1px solid #e8e1d6}
  .footer-cta h2{font-family:Georgia,serif;font-size:30px;margin:0 0 14px;color:#2d2a26;line-height:1.25}
  .footer-cta p{margin:0 0 24px;color:#5a554c;font-size:17px}
  .footer-cta .cta{padding:14px 32px;font-size:16px}
  .footer-cta .cta-sub{font-size:13px}
  .post-list{list-style:none;padding:0;margin:0}
  .post-list li{padding:24px 0;border-bottom:1px solid #e8e1d6}
  .post-list li:last-child{border-bottom:none}
  .post-list h2{font-family:Georgia,serif;font-size:24px;margin:0 0 8px;line-height:1.3}
  .post-list h2 a{color:#2d2a26}
  .post-list .post-list-meta{font-size:12px;color:#6b665f;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}
  .post-list p{color:#5a554c;margin:0 0 12px}
  .back{display:inline-block;color:#6b665f;font-size:14px;margin-bottom:24px}
  @media (max-width:640px){
    .post-title{font-size:30px}
    .post-description{font-size:17px}
    main{padding:32px 18px 60px}
    .footer-cta h2{font-size:24px}
    .nav-inner{flex-wrap:wrap}
    .brand{font-size:18px}
    .cta{padding:8px 14px;font-size:13px}
  }
`;

function navHtml(locale: 'es' | 'en', t: typeof STRINGS['en']): string {
  const homeUrl = locale === 'en' ? '/en/' : '/';
  const wizardUrl = '/create';
  return `<nav class="nav" aria-label="Main">
  <div class="nav-inner">
    <a class="brand" href="${homeUrl}">Wedding30s</a>
    <a class="cta" href="${wizardUrl}">${t.ctaButton}<span class="cta-sub">${t.ctaSub}</span></a>
  </div>
</nav>`;
}

function footerCtaHtml(locale: 'es' | 'en'): string {
  if (locale === 'en') {
    return `<aside class="footer-cta">
  <h2>Ready to share your story?</h2>
  <p>Create your wedding website in 5 minutes. No design skills needed. Pay once, keep it forever.</p>
  <a class="cta" href="/create">Create your wedding website<span class="cta-sub">in 5 minutes — €49</span></a>
</aside>`;
  }
  return `<aside class="footer-cta">
  <h2>¿Listos para compartir vuestra historia?</h2>
  <p>Crea la web de vuestra boda en 5 minutos. Sin saber diseñar nada. Pagas una vez, la conservas para siempre.</p>
  <a class="cta" href="/create">Crea la web de tu boda<span class="cta-sub">en 5 minutos — 49€</span></a>
</aside>`;
}

function alternateLinksFor(post: BlogPost): string {
  if (!post.translated_slug) return '';
  const otherLocale = post.locale === 'en' ? 'es' : 'en';
  const enUrl = post.locale === 'en'
    ? postUrl(post)
    : postUrl({ slug: post.translated_slug, locale: 'en' });
  const esUrl = post.locale === 'es'
    ? postUrl(post)
    : postUrl({ slug: post.translated_slug, locale: 'es' });
  void otherLocale;
  return `<link rel="alternate" hreflang="es" href="${esUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">`;
}

export function renderBlogPostHtml(post: BlogPost): string {
  const t = STRINGS[post.locale];
  const url = postUrl(post);
  const ogImage = post.hero_image
    ? (post.hero_image.startsWith('http') ? post.hero_image : `${BASE_URL}${post.hero_image}`)
    : `${BASE_URL}/og-image.png`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: ogImage,
    datePublished: new Date(post.published_at).toISOString(),
    dateModified: post.updated_at ? new Date(post.updated_at).toISOString() : new Date(post.published_at).toISOString(),
    author: { '@type': 'Organization', name: 'Wedding30s', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Wedding30s',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon-32.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const backLink = post.locale === 'en' ? '/en/blog/' : '/blog/';

  return `<!DOCTYPE html>
<html lang="${post.locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
${ga4Snippet()}
<title>${escapeHtml(post.title)} | Wedding30s</title>
<meta name="description" content="${escapeHtml(post.description)}">
<link rel="canonical" href="${url}">
${alternateLinksFor(post)}
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHtml(post.title)}">
<meta property="og:description" content="${escapeHtml(post.description)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Wedding30s">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${post.locale === 'en' ? 'en_US' : 'es_ES'}">
<meta property="article:published_time" content="${new Date(post.published_at).toISOString()}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(post.title)}">
<meta name="twitter:description" content="${escapeHtml(post.description)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>${STYLES}</style>
<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
${navHtml(post.locale, t)}
<main>
<a class="back" href="${backLink}">${t.backToBlog}</a>
<header class="post-header">
  <div class="post-meta">${t.published} · ${formatDate(post.published_at, post.locale)}</div>
  <h1 class="post-title">${escapeHtml(post.title)}</h1>
  <p class="post-description">${escapeHtml(post.description)}</p>
</header>
${post.hero_image ? `<figure class="hero"><img src="${escapeHtml(post.hero_image)}" alt="${escapeHtml(post.title)}"></figure>` : ''}
<article>
${post.content_html}
</article>
${footerCtaHtml(post.locale)}
</main>
</body>
</html>`;
}

export function renderBlogIndexHtml(posts: BlogPost[], locale: 'es' | 'en'): string {
  const t = STRINGS[locale];
  const url = locale === 'en' ? `${BASE_URL}/en/blog/` : `${BASE_URL}/blog/`;
  const altUrl = locale === 'en' ? `${BASE_URL}/blog/` : `${BASE_URL}/en/blog/`;
  const indexTitle = locale === 'en'
    ? 'Wedding planning ideas, templates and inspiration | Wedding30s'
    : 'Ideas, plantillas e inspiración para tu boda | Wedding30s';
  const indexDescription = locale === 'en'
    ? 'Curated guides to help you plan, design and share your wedding website. Templates, RSVP tips, video invitations and more.'
    : 'Guías para ayudarte a planificar, diseñar y compartir la web de tu boda. Plantillas, consejos para invitaciones, vídeos y más.';

  const items = posts.map(p => `
<li>
  <div class="post-list-meta">${formatDate(p.published_at, locale)}</div>
  <h2><a href="${postUrl(p).replace(BASE_URL, '')}">${escapeHtml(p.title)}</a></h2>
  <p>${escapeHtml(p.description)}</p>
  <a href="${postUrl(p).replace(BASE_URL, '')}">${t.readMore} →</a>
</li>`).join('');

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
${ga4Snippet()}
<title>${escapeHtml(indexTitle)}</title>
<meta name="description" content="${escapeHtml(indexDescription)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es" href="${locale === 'es' ? url : altUrl}">
<link rel="alternate" hreflang="en" href="${locale === 'en' ? url : altUrl}">
<link rel="alternate" hreflang="x-default" href="${locale === 'en' ? url : altUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(indexTitle)}">
<meta property="og:description" content="${escapeHtml(indexDescription)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Wedding30s">
<meta property="og:image" content="${BASE_URL}/og-image.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<style>${STYLES}</style>
</head>
<body>
${navHtml(locale, t)}
<main>
<header class="post-header">
  <h1 class="post-title">${locale === 'en' ? 'The Wedding30s Blog' : 'El blog de Wedding30s'}</h1>
  <p class="post-description">${escapeHtml(indexDescription)}</p>
</header>
${posts.length > 0
  ? `<ul class="post-list">${items}</ul>`
  : `<p style="text-align:center;color:#6b665f;padding:40px 0">${locale === 'en' ? 'No articles yet — coming soon.' : 'Aún no hay artículos — muy pronto.'}</p>`}
${footerCtaHtml(locale)}
</main>
</body>
</html>`;
}
