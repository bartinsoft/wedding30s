import { Router } from 'express';
import { query, queryOne } from '../db/index.js';

const router = Router();

router.get('/api/admin/metrics', async (req, res) => {
  const token = req.headers['x-admin-token'];
  const expected = process.env.ADMIN_METRICS_TOKEN || '';

  if (!token || !expected || token !== expected) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const [weddings] = await query('SELECT COUNT(*) as total FROM weddings') as any[];
  const [drafts] = await query("SELECT COUNT(*) as total FROM weddings WHERE status = 'draft'") as any[];
  const [published] = await query("SELECT COUNT(*) as total FROM weddings WHERE status = 'published'") as any[];
  const [users] = await query('SELECT COUNT(*) as total FROM users') as any[];
  const [guests] = await query('SELECT COUNT(*) as total FROM guests') as any[];
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
    users: users.total,
    weddings: {
      total: weddings.total,
      draft: drafts.total,
      published: published.total,
    },
    guests: {
      total: guests.total,
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
