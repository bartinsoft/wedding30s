import { Router } from 'express';
import { nanoid } from 'nanoid';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'node:fs';
import { query, queryOne, execute } from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';
import { uploadToS3 } from '../storage/s3.js';

const router = Router();

const upload = multer({ dest: 'public/uploads/tmp/' });

async function generateSlug(p1: string, p2: string): Promise<string> {
  const base = `${p1}-${p2}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = await queryOne('SELECT slug FROM weddings WHERE slug = ?', [base]);
  if (!existing) return base;

  return `${base}-${nanoid(4)}`;
}

router.post('/api/weddings', async (req, res) => {
  try {
    const { partner1_name, partner2_name, date, location, venue, template, colors, email, story, menu, program } = req.body;

    if (!partner1_name || !partner2_name || !date || !location || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = nanoid();
    const slug = await generateSlug(partner1_name, partner2_name);
    const secret_token = nanoid(32);

    await execute(
      `INSERT INTO weddings (id, slug, partner1_name, partner2_name, date, location, venue, template, colors, email, story, menu, program, secret_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, slug, partner1_name, partner2_name, date, location,
        venue || null,
        template || 'classic-garden',
        colors ? JSON.stringify(colors) : '{"primary":"#7A8B5E","secondary":"#C4A35A","bg":"#FDFBF7","text":"#2C3E2D"}',
        email,
        story || null,
        menu ? JSON.stringify(menu) : null,
        program ? JSON.stringify(program) : null,
        secret_token,
      ]
    );

    res.status(201).json({ id, slug, secret_token });
  } catch (err) {
    console.error('Failed to create wedding:', err);
    res.status(500).json({ error: 'Failed to create wedding' });
  }
});

router.get('/api/weddings/:id', async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]);
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  const token = req.query.token as string || req.headers['x-wedding-token'] as string;
  if (wedding.secret_token && token !== wedding.secret_token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json(wedding);
});

router.put('/api/weddings/:id', async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]);
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  const token = req.query.token as string || req.headers['x-wedding-token'] as string;
  if (wedding.secret_token && token !== wedding.secret_token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const fields = ['partner1_name', 'partner2_name', 'date', 'location', 'venue', 'template', 'colors', 'story', 'menu', 'program', 'photos', 'custom_domain', 'email'];
  const updates: string[] = [];
  const values: unknown[] = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      const needsJson = field === 'colors' || field === 'photos' || field === 'menu' || field === 'program';
      values.push(needsJson && typeof req.body[field] === 'object' ? JSON.stringify(req.body[field]) : req.body[field]);
    }
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  updates.push('updated_at = NOW()');
  values.push(req.params.id);

  await execute(`UPDATE weddings SET ${updates.join(', ')} WHERE id = ?`, values);

  const updated = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]);
  res.json(updated);
});

router.post('/api/weddings/:id/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]);
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const buffer = await sharp(req.file.path)
      .resize(1200)
      .webp({ quality: 85 })
      .toBuffer();

    fs.unlinkSync(req.file.path);

    const key = `photos/${req.params.id}/hero.webp`;
    const photoUrl = await uploadToS3(buffer, key, 'image/webp');

    await execute("UPDATE weddings SET photo_url = ?, updated_at = NOW() WHERE id = ?", [photoUrl, req.params.id]);

    res.json({ photo_url: photoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process photo' });
  }
});

router.post('/api/weddings/:id/gallery', upload.array('photos', 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const photos: { url: string; year: string; label: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = await sharp(file.path)
        .resize(1200)
        .webp({ quality: 85 })
        .toBuffer();

      fs.unlinkSync(file.path);

      const key = `photos/${req.params.id}/gallery-${i}-${Date.now()}.webp`;
      const url = await uploadToS3(buffer, key, 'image/webp');

      photos.push({ url, year: '', label: '' });
    }

    const existingRaw = wedding.photos as string | null;
    const existingPhotos = existingRaw ? JSON.parse(existingRaw) : [];
    const allPhotos = [...existingPhotos, ...photos];

    await execute("UPDATE weddings SET photos = ?, updated_at = NOW() WHERE id = ?", [JSON.stringify(allPhotos), req.params.id]);

    res.json({ photos: allPhotos });
  } catch (err) {
    console.error('Failed to upload gallery photos:', err);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function getStripeKeys(email: string) {
  const useTest = !isProduction() || email.toLowerCase().endsWith('@bartinsoft.com');

  if (useTest) {
    return {
      secretKey: process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY!,
      mode: 'test' as const,
    };
  }
  return {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    mode: 'live' as const,
  };
}

router.post('/api/weddings/:id/publish', async (req, res) => {
  try {
    const Stripe = (await import('stripe')).default;

    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const { secretKey, mode } = getStripeKeys(wedding.email);
    const stripe = new Stripe(secretKey);

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Wedding30s — ${wedding.partner1_name} & ${wedding.partner2_name}`,
            description: 'Tu web de boda personalizada',
          },
          unit_amount: 2900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard/${req.params.id}?published=true&token=${wedding.secret_token}`,
      cancel_url: `${baseUrl}/create?id=${req.params.id}&token=${wedding.secret_token}`,
      metadata: { stripe_mode: mode, wedding_id: req.params.id },
      payment_intent_data: {
        statement_descriptor: 'WEDDING30S',
      },
    });

    await execute("UPDATE weddings SET stripe_session_id = ?, stripe_mode = ?, updated_at = NOW() WHERE id = ?", [session.id, mode, req.params.id]);

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/api/weddings/:id/publish-free', async (req, res) => {
  try {
    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    await execute("UPDATE weddings SET status = 'published', updated_at = NOW() WHERE id = ?", [wedding.id]);

    const photos = wedding.photos ? JSON.parse(wedding.photos as string) : null;

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
      photos,
    });

    res.json({ url: `/${wedding.slug}` });
  } catch (err) {
    console.error('Failed to publish wedding:', err);
    res.status(500).json({ error: 'Failed to publish wedding' });
  }
});

router.get('/api/weddings/:id/guests', async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, string> | undefined;
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  const token = req.query.token as string || req.headers['x-wedding-token'] as string;
  if (wedding.secret_token && token !== wedding.secret_token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const guests = await query('SELECT * FROM guests WHERE wedding_id = ? ORDER BY created_at DESC', [req.params.id]);
  res.json(guests);
});

router.post('/api/weddings/:slug/rsvp', async (req, res) => {
  try {
    const wedding = await queryOne('SELECT id FROM weddings WHERE slug = ?', [req.params.slug]) as { id: string } | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const { name, email, attending, menu_choice, allergies, plus_one, plus_one_name, message } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const id = nanoid();

    await execute(
      `INSERT INTO guests (id, wedding_id, name, email, attending, menu_choice, allergies, plus_one, plus_one_name, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, wedding.id, name,
        email || null,
        attending || 'yes',
        menu_choice || null,
        allergies || null,
        plus_one ? 1 : 0,
        plus_one_name || null,
        message || null,
      ]
    );

    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

export default router;
