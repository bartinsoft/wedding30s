import 'dotenv/config';
import { nanoid } from 'nanoid';
import { execute, queryOne } from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';

const DEMO_SLUG = '20260615-emma-james';

async function seedDemo() {
  const existing = await queryOne('SELECT id FROM weddings WHERE slug = ?', [DEMO_SLUG]);
  if (existing) {
    console.log('Demo wedding already exists, regenerating HTML...');
    const wedding = await queryOne('SELECT * FROM weddings WHERE slug = ?', [DEMO_SLUG]) as Record<string, any>;
    wedding.status = 'published';
    await execute("UPDATE weddings SET status = 'published' WHERE slug = ?", [DEMO_SLUG]);
    const outPath = await generateWeddingHtml({
      slug: wedding.slug,
      partner1_name: wedding.partner1_name,
      partner2_name: wedding.partner2_name,
      date: wedding.date,
      location: wedding.location,
      venue: wedding.venue,
      template: wedding.template,
      colors: typeof wedding.colors === 'string' ? wedding.colors : JSON.stringify(wedding.colors),
      photo_url: wedding.photo_url,
      story: wedding.story,
      menu: typeof wedding.menu === 'string' ? wedding.menu : JSON.stringify(wedding.menu),
      program: typeof wedding.program === 'string' ? wedding.program : JSON.stringify(wedding.program),
      photos: wedding.photos ? (typeof wedding.photos === 'string' ? JSON.parse(wedding.photos) : wedding.photos) : null,
      language: wedding.language || 'en',
      maps_url: wedding.maps_url || null,
    });
    const fs = await import('fs');
    const { uploadWeddingHtml } = await import('../storage/s3.js');
    const html = fs.readFileSync(outPath, 'utf-8');
    await uploadWeddingHtml(DEMO_SLUG, html);
    console.log('Regenerated and uploaded to S3.');
    process.exit(0);
    return;
  }

  const id = nanoid();
  const colors = JSON.stringify({ primary: '#7A8B5E', secondary: '#C4A35A', bg: '#FDFBF7', text: '#2C3E2D' });

  const story = 'We met at a small coffee shop in Florence during the summer of 2020. What started as a chance encounter over two cappuccinos turned into endless conversations, spontaneous trips, and a love that feels like home. Five years later, we can\'t imagine life without each other.';

  const program = JSON.stringify([
    { time: '16:00', text: 'Guest arrival & welcome drinks' },
    { time: '16:30', text: 'Ceremony in the garden' },
    { time: '17:30', text: 'Cocktail hour' },
    { time: '19:00', text: 'Dinner' },
    { time: '21:00', text: 'First dance & party' },
    { time: '00:00', text: 'Farewell' },
  ]);

  const menu = JSON.stringify([
    {
      name: 'Tuscan Menu',
      sections: [
        { name: 'Antipasto', items: [{ name: 'Burrata with heirloom tomatoes & basil' }, { name: 'Tuscan bread with olive oil' }], choose: false },
        { name: 'Primo', items: [{ name: 'Pappardelle al ragù di cinghiale' }, { name: 'Risotto ai funghi porcini' }], choose: true },
        { name: 'Secondo', items: [{ name: 'Bistecca alla Fiorentina' }, { name: 'Branzino al forno' }], choose: true },
        { name: 'Dolce', items: [{ name: 'Tiramisù' }, { name: 'Panna cotta' }], choose: false },
      ],
    },
    {
      name: 'Vegan Menu',
      sections: [
        { name: 'Antipasto', items: [{ name: 'Grilled vegetables with balsamic reduction' }, { name: 'Bruschetta with cherry tomatoes' }], choose: false },
        { name: 'Primo', items: [{ name: 'Penne arrabbiata' }, { name: 'Risotto with asparagus & lemon' }], choose: true },
        { name: 'Secondo', items: [{ name: 'Stuffed bell peppers' }, { name: 'Eggplant parmigiana' }], choose: true },
        { name: 'Dolce', items: [{ name: 'Sorbetto al limone' }, { name: 'Fresh fruit tartlet' }], choose: false },
      ],
    },
  ]);

  await execute(
    `INSERT INTO weddings (id, slug, partner1_name, partner2_name, date, location, venue, template, colors, palette, email, story, menu, program, secret_token, status, language)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, DEMO_SLUG, 'Emma', 'James',
      '2026-06-15', 'Tuscany, Italy', 'Villa Cora',
      'classic-garden', colors, 'sage-cream',
      'demo@wedding30s.com',
      story, menu, program,
      nanoid(32),
      'published',
      'en',
    ]
  );

  const outPath = await generateWeddingHtml({
    slug: DEMO_SLUG,
    partner1_name: 'Emma',
    partner2_name: 'James',
    date: '2026-06-15',
    location: 'Tuscany, Italy',
    venue: 'Villa Cora',
    template: 'classic-garden',
    colors,
    photo_url: null,
    story,
    menu,
    program,
    language: 'en',
  });

  // Wait for S3 upload (generateWeddingHtml fires it in background)
  const fs = await import('fs');
  const { uploadWeddingHtml } = await import('../storage/s3.js');
  const html = fs.readFileSync(outPath, 'utf-8');
  await uploadWeddingHtml(DEMO_SLUG, html);
  console.log(`Demo wedding created and uploaded to S3: /${DEMO_SLUG}`);
  process.exit(0);
}

seedDemo().catch(err => {
  console.error(err);
  process.exit(1);
});
