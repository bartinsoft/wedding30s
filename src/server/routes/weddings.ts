import { Router } from 'express';
import { nanoid } from 'nanoid';
import multer from 'multer';
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import db from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';

const router = Router();

const upload = multer({ dest: 'public/uploads/tmp/' });

function generateSlug(p1: string, p2: string): string {
  const base = `${p1}-${p2}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = db.prepare('SELECT slug FROM weddings WHERE slug = ?').get(base);
  if (!existing) return base;

  return `${base}-${nanoid(4)}`;
}

router.post('/api/weddings', (req, res) => {
  try {
    const { partner1_name, partner2_name, date, location, venue, template, colors, email, story, menu, program } = req.body;

    if (!partner1_name || !partner2_name || !date || !location || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = nanoid();
    const slug = generateSlug(partner1_name, partner2_name);

    db.prepare(`
      INSERT INTO weddings (id, slug, partner1_name, partner2_name, date, location, venue, template, colors, email, story, menu, program)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, slug, partner1_name, partner2_name, date, location,
      venue || null,
      template || 'classic',
      colors ? JSON.stringify(colors) : '{"primary":"#7A8B5E","secondary":"#C4A35A","bg":"#FDFBF7","text":"#2C3E2D"}',
      email,
      story || null,
      menu || null,
      program || null
    );

    res.status(201).json({ id, slug });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create wedding' });
  }
});

router.get('/api/weddings/:id', (req, res) => {
  const wedding = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id);
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }
  res.json(wedding);
});

router.put('/api/weddings/:id', (req, res) => {
  const wedding = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id);
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  const fields = ['partner1_name', 'partner2_name', 'date', 'location', 'venue', 'template', 'colors', 'story', 'menu', 'program', 'custom_domain', 'email'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(field === 'colors' ? JSON.stringify(req.body[field]) : req.body[field]);
    }
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE weddings SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.post('/api/weddings/:id/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const wedding = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id);
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const uploadsDir = path.resolve('public/uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const outputPath = path.join(uploadsDir, `${req.params.id}.webp`);

    await sharp(req.file.path)
      .resize(1200)
      .webp({ quality: 85 })
      .toFile(outputPath);

    fs.unlinkSync(req.file.path);

    const photoUrl = `/uploads/${req.params.id}.webp`;
    db.prepare("UPDATE weddings SET photo_url = ?, updated_at = datetime('now') WHERE id = ?").run(photoUrl, req.params.id);

    res.json({ photo_url: photoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process photo' });
  }
});

router.post('/api/weddings/:id/publish', async (req, res) => {
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const wedding = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Wedding website: ${wedding.partner1_name} & ${wedding.partner2_name}`,
          },
          unit_amount: 2900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard/${req.params.id}?published=true`,
      cancel_url: `${baseUrl}/create?id=${req.params.id}`,
    });

    db.prepare("UPDATE weddings SET stripe_session_id = ?, updated_at = datetime('now') WHERE id = ?").run(session.id, req.params.id);

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/api/weddings/:id/publish-free', (req, res) => {
  try {
    const wedding = db.prepare('SELECT * FROM weddings WHERE id = ?').get(req.params.id) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    db.prepare("UPDATE weddings SET status = 'published', updated_at = datetime('now') WHERE id = ?").run(wedding.id);

    generateWeddingHtml({
      slug: wedding.slug,
      partner1_name: wedding.partner1_name,
      partner2_name: wedding.partner2_name,
      date: wedding.date,
      location: wedding.location,
      venue: wedding.venue || null,
      template: wedding.template,
      colors: wedding.colors,
      photo_url: wedding.photo_url || null,
      story: wedding.story || null,
      menu: wedding.menu || null,
      program: wedding.program || null,
    });

    res.json({ url: `/${wedding.slug}` });
  } catch (err) {
    console.error('Failed to publish wedding:', err);
    res.status(500).json({ error: 'Failed to publish wedding' });
  }
});

router.get('/api/weddings/:id/guests', (req, res) => {
  const wedding = db.prepare('SELECT id FROM weddings WHERE id = ?').get(req.params.id);
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  const guests = db.prepare('SELECT * FROM guests WHERE wedding_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json(guests);
});

router.post('/api/weddings/:slug/rsvp', (req, res) => {
  try {
    const wedding = db.prepare('SELECT id FROM weddings WHERE slug = ?').get(req.params.slug) as { id: string } | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const { name, email, attending, menu_choice, allergies, plus_one, plus_one_name, message } = req.body;

    if (!name || !attending) {
      res.status(400).json({ error: 'Name and attending status are required' });
      return;
    }

    const id = nanoid();

    db.prepare(`
      INSERT INTO guests (id, wedding_id, name, email, attending, menu_choice, allergies, plus_one, plus_one_name, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, wedding.id, name,
      email || null,
      attending,
      menu_choice || null,
      allergies || null,
      plus_one ? 1 : 0,
      plus_one_name || null,
      message || null
    );

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

export default router;
