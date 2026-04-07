import { Router } from 'express';
import { query, queryOne } from '../db/index.js';

const router = Router();

const INTERNAL_EMAIL_DOMAINS = [
  'dmarc-examiner.com',
  'bartinsoft.com',
  'lcapps.es',
];

const INTERNAL_EMAILS = [
  'lm.martinb@gmail.com',
];

function buildInternalEmailFilter(emailColumn: string): string {
  const domainConditions = INTERNAL_EMAIL_DOMAINS
    .map(d => `${emailColumn} NOT LIKE '%@${d}'`)
    .join(' AND ');
  const exactConditions = INTERNAL_EMAILS
    .map(e => `${emailColumn} != '${e}'`)
    .join(' AND ');
  return `(${domainConditions} AND ${exactConditions})`;
}

router.get('/api/admin/metrics', async (req, res) => {
  const token = req.headers['x-admin-token'];
  const expected = process.env.ADMIN_METRICS_TOKEN || '';

  if (!token || !expected || token !== expected) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const realUserFilter = buildInternalEmailFilter('u.email');
  const realWeddingFilter = buildInternalEmailFilter('w.email');

  // Total counts
  const [weddings] = await query('SELECT COUNT(*) as total FROM weddings') as any[];
  const [drafts] = await query("SELECT COUNT(*) as total FROM weddings WHERE status = 'draft'") as any[];
  const [published] = await query("SELECT COUNT(*) as total FROM weddings WHERE status = 'published'") as any[];
  const [users] = await query('SELECT COUNT(*) as total FROM users') as any[];

  // Real counts (excluding internal emails)
  const [usersReal] = await query(
    `SELECT COUNT(*) as total FROM users u WHERE ${realUserFilter}`
  ) as any[];
  const [weddingsReal] = await query(
    `SELECT COUNT(*) as total FROM weddings w WHERE ${realWeddingFilter}`
  ) as any[];
  const [draftsReal] = await query(
    `SELECT COUNT(*) as total FROM weddings w WHERE status = 'draft' AND ${realWeddingFilter}`
  ) as any[];
  const [publishedReal] = await query(
    `SELECT COUNT(*) as total FROM weddings w WHERE status = 'published' AND ${realWeddingFilter}`
  ) as any[];

  // Guests (total and real - real = only from real weddings)
  const [guests] = await query('SELECT COUNT(*) as total FROM guests') as any[];
  const [guestsReal] = await query(
    `SELECT COUNT(*) as total FROM guests g INNER JOIN weddings w ON g.wedding_id = w.id WHERE ${realWeddingFilter}`
  ) as any[];
  const [rsvpYes] = await query("SELECT COUNT(*) as total FROM guests WHERE attending = 'yes'") as any[];
  const [rsvpNo] = await query("SELECT COUNT(*) as total FROM guests WHERE attending = 'no'") as any[];
  const [rsvpPending] = await query("SELECT COUNT(*) as total FROM guests WHERE attending = 'pending'") as any[];
  const [suggestions] = await query('SELECT COUNT(*) as total FROM suggestions') as any[];

  const templateRows = await query(
    "SELECT template, COUNT(*) as count FROM weddings WHERE status = 'published' GROUP BY template"
  ) as any[];
  const templates: Record<string, number> = {};
  for (const row of templateRows) {
    templates[row.template] = row.count;
  }

  const paletteRows = await query(
    "SELECT palette, COUNT(*) as count FROM weddings WHERE status = 'published' GROUP BY palette"
  ) as any[];
  const palettes: Record<string, number> = {};
  for (const row of paletteRows) {
    palettes[row.palette] = row.count;
  }

  res.json({
    users_real: usersReal.total,
    users_total: users.total,
    weddings: {
      total: weddings.total,
      real: weddingsReal.total,
      draft: drafts.total,
      draft_real: draftsReal.total,
      published: published.total,
      published_real: publishedReal.total,
    },
    guests: {
      total: guests.total,
      real: guestsReal.total,
      rsvp_yes: rsvpYes.total,
      rsvp_no: rsvpNo.total,
      rsvp_pending: rsvpPending.total,
    },
    suggestions: suggestions.total,
    templates,
    palettes,
    generated_at: new Date().toISOString(),
  });
});

export default router;
