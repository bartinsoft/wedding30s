import { Router } from 'express';
import { nanoid } from 'nanoid';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'node:fs';
import { query, queryOne, execute } from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';
import { uploadToS3 } from '../storage/s3.js';
import { optionalAuth } from '../middleware/auth.js';
import { sendEmail, wrapEmailTemplate } from '../email.js';
import type { Request } from 'express';

const router = Router();

const upload = multer({ dest: 'public/uploads/tmp/' });

export async function regenerateIfPublished(wedding: Record<string, any>) {
  if (wedding.status !== 'published') return;
  try {
    const photos = wedding.photos ? (typeof wedding.photos === 'string' ? JSON.parse(wedding.photos) : wedding.photos) : null;
    await generateWeddingHtml({
      slug: wedding.slug,
      partner1_name: wedding.partner1_name,
      partner2_name: wedding.partner2_name,
      date: wedding.date,
      location: wedding.location,
      venue: wedding.venue || null,
      template: wedding.template,
      colors: typeof wedding.colors === 'string' ? wedding.colors : JSON.stringify(wedding.colors),
      photo_url: wedding.photo_url || null,
      story: wedding.story || null,
      menu: wedding.menu || null,
      program: wedding.program || null,
      photos,
      language: wedding.language || 'es',
      maps_url: wedding.maps_url || null,
    });
  } catch (err) {
    console.error('Failed to regenerate wedding HTML:', err);
  }
}

function authorizeWedding(req: Request, wedding: Record<string, any>): boolean {
  // JWT auth: user owns the wedding
  if (req.user && wedding.user_id && req.user.id === wedding.user_id) return true;
  // Secret token auth
  const token = req.query.token as string || req.headers['x-wedding-token'] as string;
  if (wedding.secret_token && token === wedding.secret_token) return true;
  return false;
}

async function generateSlug(p1: string, p2: string, date: string): Promise<string> {
  const d = date.replace(/-/g, '').slice(0, 8); // yyyymmdd
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

router.post('/api/weddings', async (req, res) => {
  try {
    const { partner1_name, partner2_name, date, location, venue, template, colors, palette, email, story, menu, program } = req.body;

    if (!partner1_name || !partner2_name || !date || !location || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const id = nanoid();
    const slug = await generateSlug(partner1_name, partner2_name, date);
    const secret_token = nanoid(32);

    await execute(
      `INSERT INTO weddings (id, slug, partner1_name, partner2_name, date, location, venue, template, colors, palette, email, story, menu, program, secret_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, slug, partner1_name, partner2_name, date, location,
        venue || null,
        template || 'classic-garden',
        colors ? JSON.stringify(colors) : '{"primary":"#7A8B5E","secondary":"#C4A35A","bg":"#FDFBF7","text":"#2C3E2D"}',
        palette || 'sage-cream',
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

router.get('/api/weddings/:id', optionalAuth, async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any> | undefined;
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  if (!authorizeWedding(req, wedding)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json(wedding);
});

router.put('/api/weddings/:id', optionalAuth, async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any> | undefined;
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  if (!authorizeWedding(req, wedding)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const fields = ['partner1_name', 'partner2_name', 'date', 'location', 'venue', 'template', 'colors', 'palette', 'story', 'menu', 'program', 'photos', 'gallery_style', 'custom_domain', 'email', 'maps_url'];
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

  const updated = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any>;
  regenerateIfPublished(updated);
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

function getPolarConfig(email: string) {
  const useTest = !isProduction() || email.toLowerCase().endsWith('@bartinsoft.com');

  if (useTest) {
    return {
      accessToken: process.env.POLAR_ACCESS_TOKEN_TEST || process.env.POLAR_ACCESS_TOKEN!,
      productId: process.env.POLAR_PRODUCT_ID_TEST || process.env.POLAR_PRODUCT_ID!,
      server: 'sandbox' as const,
      mode: 'test' as const,
    };
  }
  return {
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    productId: process.env.POLAR_PRODUCT_ID!,
    server: 'production' as const,
    mode: 'live' as const,
  };
}

router.post('/api/weddings/:id/publish', async (req, res) => {
  try {
    const { Polar } = await import('@polar-sh/sdk');

    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, string> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const { accessToken, productId, server, mode } = getPolarConfig(wedding.email);
    const polar = new Polar({ accessToken, server });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${baseUrl}/dashboard/${req.params.id}?published=true&token=${wedding.secret_token}`,
      customerEmail: wedding.email,
      metadata: { polar_mode: mode, wedding_id: req.params.id },
    });

    await execute("UPDATE weddings SET polar_checkout_id = ?, polar_mode = ?, updated_at = NOW() WHERE id = ?", [checkout.id, mode, req.params.id]);

    res.json({ url: checkout.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.post('/api/weddings/:id/publish-free', async (req, res) => {
  try {
    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    await execute("UPDATE weddings SET status = 'published', updated_at = NOW() WHERE id = ?", [wedding.id]);
    wedding.status = 'published';
    regenerateIfPublished(wedding);

    res.json({ url: `/${wedding.slug}` });
  } catch (err) {
    console.error('Failed to publish wedding:', err);
    res.status(500).json({ error: 'Failed to publish wedding' });
  }
});

router.get('/api/weddings/:id/guests', optionalAuth, async (req, res) => {
  const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any> | undefined;
  if (!wedding) {
    res.status(404).json({ error: 'Wedding not found' });
    return;
  }

  if (!authorizeWedding(req, wedding)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const guests = await query('SELECT * FROM guests WHERE wedding_id = ? ORDER BY created_at DESC', [req.params.id]);
  res.json(guests);
});

router.delete('/api/weddings/:id', optionalAuth, async (req, res) => {
  try {
    const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [req.params.id]) as Record<string, any> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    if (!authorizeWedding(req, wedding)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Delete guests first (FK constraint)
    await execute('DELETE FROM guests WHERE wedding_id = ?', [req.params.id]);
    // Unlink suggestions
    await execute('UPDATE suggestions SET wedding_id = NULL WHERE wedding_id = ?', [req.params.id]);
    // Delete wedding
    await execute('DELETE FROM weddings WHERE id = ?', [req.params.id]);

    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete wedding:', err);
    res.status(500).json({ error: 'Failed to delete wedding' });
  }
});

function sendRsvpNotification(wedding: Record<string, any>, guestNames: string[], attending: string, details: { menu?: string; allergies?: string; plusOne?: string; message?: string }) {
  if (!wedding.email) return;

  const isAttending = attending !== 'no' && attending !== 'declined';
  const baseUrl = process.env.BASE_URL || 'https://wedding30s.com';
  const dashboardUrl = `${baseUrl}/dashboard/${wedding.id}`;

  const guestLabel = guestNames.join(', ');
  const subject = isAttending
    ? `New RSVP: ${guestLabel} will attend your wedding`
    : `RSVP: ${guestLabel} can't attend your wedding`;

  let body = `<h2 style="font-size: 1.3rem; color: #2C3E2D; margin-bottom: 1rem;">New RSVP Received</h2>`;
  body += `<table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">`;
  body += `<tr><td style="padding: 8px 0; color: #888; width: 120px;">Guest(s)</td><td style="padding: 8px 0;"><strong>${guestLabel}</strong></td></tr>`;
  body += `<tr><td style="padding: 8px 0; color: #888;">Attending</td><td style="padding: 8px 0;">${isAttending ? 'Yes' : 'No'}</td></tr>`;
  if (details.menu) {
    body += `<tr><td style="padding: 8px 0; color: #888;">Menu</td><td style="padding: 8px 0;">${details.menu}</td></tr>`;
  }
  if (details.allergies) {
    body += `<tr><td style="padding: 8px 0; color: #888;">Allergies</td><td style="padding: 8px 0;">${details.allergies}</td></tr>`;
  }
  if (details.plusOne) {
    body += `<tr><td style="padding: 8px 0; color: #888;">Plus one</td><td style="padding: 8px 0;">${details.plusOne}</td></tr>`;
  }
  if (details.message) {
    body += `<tr><td style="padding: 8px 0; color: #888;">Message</td><td style="padding: 8px 0;">${details.message}</td></tr>`;
  }
  body += `</table>`;
  body += `<div style="text-align: center; margin-top: 1.5rem;">`;
  body += `<a href="${dashboardUrl}" style="display: inline-block; padding: 12px 32px; background: #7A8B5E; color: #fff; text-decoration: none; border-radius: 8px; font-size: 0.95rem;">View Dashboard</a>`;
  body += `</div>`;

  sendEmail({
    to: wedding.email,
    subject,
    html: wrapEmailTemplate(body),
  });
}

router.post('/api/weddings/:slug/rsvp', async (req, res) => {
  try {
    const wedding = await queryOne('SELECT id, email, partner1_name, partner2_name FROM weddings WHERE slug = ?', [req.params.slug]) as Record<string, any> | undefined;
    if (!wedding) {
      res.status(404).json({ error: 'Wedding not found' });
      return;
    }

    const { guests: guestList, email, message, attending } = req.body;

    // Support both old single-guest format and new multi-guest format
    if (guestList && Array.isArray(guestList)) {
      // New multi-guest format
      if (guestList.length === 0 || !guestList[0].name) {
        res.status(400).json({ error: 'At least one guest name is required' });
        return;
      }

      const ids: string[] = [];
      const names: string[] = [];
      let firstMenu = '';
      let firstAllergies = '';
      for (const guest of guestList) {
        if (!guest.name) continue;
        const id = nanoid();
        await execute(
          `INSERT INTO guests (id, wedding_id, name, email, attending, menu_type, menu_choice, allergies, message)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, wedding.id, guest.name,
            email || null,
            attending || 'yes',
            guest.menu_type || 'adult',
            guest.menu_choice || null,
            guest.allergies || null,
            message || null,
          ]
        );
        ids.push(id);
        names.push(guest.name);
        if (!firstMenu && guest.menu_choice) firstMenu = guest.menu_choice;
        if (!firstAllergies && guest.allergies) firstAllergies = guest.allergies;
      }

      sendRsvpNotification(wedding, names, attending || 'yes', {
        menu: firstMenu,
        allergies: firstAllergies,
        message: message || undefined,
      });

      res.status(201).json({ ids });
    } else {
      // Legacy single-guest format
      const { name, menu_choice, allergies, plus_one, plus_one_name } = req.body;

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

      sendRsvpNotification(wedding, [name], attending || 'yes', {
        menu: menu_choice || undefined,
        allergies: allergies || undefined,
        plusOne: plus_one_name || undefined,
        message: message || undefined,
      });

      res.status(201).json({ id });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

router.get('/api/weddings/:slug/calendar', async (req, res) => {
  try {
    const wedding = await queryOne(
      'SELECT partner1_name, partner2_name, date, location, venue, slug FROM weddings WHERE slug = ?',
      [req.params.slug]
    ) as Record<string, string> | undefined;

    if (!wedding) {
      res.status(404).send('Wedding not found');
      return;
    }

    const d = new Date(wedding.date);
    const pad = (n: number) => String(n).padStart(2, '0');
    const dtStart = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T120000`;
    const dtEnd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T230000`;
    const loc = wedding.venue ? `${wedding.venue}, ${wedding.location}` : wedding.location;
    const summary = `${wedding.partner1_name} & ${wedding.partner2_name} Wedding`;
    const url = `https://wedding30s.com/${wedding.slug}`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding30s//EN',
      'BEGIN:VEVENT',
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `LOCATION:${loc}`,
      `URL:${url}`,
      `DESCRIPTION:${url}`,
      `UID:${wedding.slug}@wedding30s.com`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${wedding.slug}.ics"`);
    res.send(ics);
  } catch (err) {
    res.status(500).send('Failed to generate calendar');
  }
});

export default router;
