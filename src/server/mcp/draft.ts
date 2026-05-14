import { nanoid } from 'nanoid';
import { queryOne, execute } from '../db/index.js';
import { getPolarConfig } from '../routes/weddings.js';

const VALID_TEMPLATES = ['classic-garden', 'minimal-white', 'romantic-blush', 'modern-dark'];
const VALID_LANGUAGES = ['es', 'en'];

export type DraftInput = {
  partner1_name: string;
  partner2_name: string;
  date: string;
  location: string;
  email: string;
  venue?: string;
  template?: string;
  language?: string;
  story?: string;
  maps_url?: string;
};

export type DraftResult = {
  draft_id: string;
  preview_url: string;
  checkout_url: string;
  expires_at: string;
};

async function generateSlug(p1: string, p2: string, date: string): Promise<string> {
  const d = date.replace(/-/g, '').slice(0, 8);
  const names = `${p1}-${p2}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const base = `${d}-${names}`;
  const existing = await queryOne('SELECT slug FROM weddings WHERE slug = ?', [base]);
  if (!existing) return base;
  return `${base}-${nanoid(4)}`;
}

export async function createWeddingDraft(input: DraftInput): Promise<DraftResult> {
  if (input.template && !VALID_TEMPLATES.includes(input.template)) {
    throw new Error(`Invalid template. Must be one of: ${VALID_TEMPLATES.join(', ')}`);
  }
  if (input.language && !VALID_LANGUAGES.includes(input.language)) {
    throw new Error(`Invalid language. Must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }

  const id = nanoid();
  const slug = await generateSlug(input.partner1_name, input.partner2_name, input.date);
  const secret_token = nanoid(32);

  await execute(
    `INSERT INTO weddings (id, slug, partner1_name, partner2_name, date, location, venue, template, language, email, story, maps_url, secret_token, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
    [
      id, slug, input.partner1_name, input.partner2_name, input.date, input.location,
      input.venue || null,
      input.template || 'classic-garden',
      input.language || 'es',
      input.email,
      input.story || null,
      input.maps_url || null,
      secret_token,
    ]
  );

  const { Polar } = await import('@polar-sh/sdk');
  const { accessToken, productId, server, mode } = getPolarConfig(input.email);
  const polar = new Polar({ accessToken, server });

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const checkout = await polar.checkouts.create({
    products: [productId],
    successUrl: `${baseUrl}/dashboard/${id}?published=true&token=${secret_token}`,
    customerEmail: input.email,
    metadata: { polar_mode: mode, wedding_id: id, source: 'agent' },
  });

  await execute(
    "UPDATE weddings SET polar_checkout_id = ?, polar_mode = ?, updated_at = NOW() WHERE id = ?",
    [checkout.id, mode, id]
  );

  const cleanupDays = parseInt(process.env.CLEANUP_DAYS || '7', 10);
  const expiresAt = new Date(Date.now() + cleanupDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    draft_id: id,
    preview_url: `${baseUrl}/preview/${id}?token=${secret_token}`,
    checkout_url: checkout.url,
    expires_at: expiresAt,
  };
}
