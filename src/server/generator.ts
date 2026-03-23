import fs from 'node:fs';
import path from 'node:path';

interface WeddingData {
  slug: string;
  partner1_name: string;
  partner2_name: string;
  date: string;
  location: string;
  venue: string | null;
  template: string;
  colors: string;
  photo_url: string | null;
  story: string | null;
  menu: string | null;
  program: string | null;
}

export function generateWeddingHtml(wedding: WeddingData): string {
  const templatePath = path.resolve('templates', `${wedding.template}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${wedding.template}`);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  const colors = JSON.parse(wedding.colors);

  html = html
    .replace(/\{\{partner1\}\}/g, wedding.partner1_name)
    .replace(/\{\{partner2\}\}/g, wedding.partner2_name)
    .replace(/\{\{date\}\}/g, wedding.date)
    .replace(/\{\{location\}\}/g, wedding.location)
    .replace(/\{\{venue\}\}/g, wedding.venue || '')
    .replace(/\{\{photo_url\}\}/g, wedding.photo_url || '')
    .replace(/\{\{story\}\}/g, wedding.story || '')
    .replace(/\{\{menu\}\}/g, wedding.menu || '')
    .replace(/\{\{program\}\}/g, wedding.program || '')
    .replace(/\{\{slug\}\}/g, wedding.slug)
    .replace(/\{\{color_primary\}\}/g, colors.primary)
    .replace(/\{\{color_secondary\}\}/g, colors.secondary)
    .replace(/\{\{color_bg\}\}/g, colors.bg)
    .replace(/\{\{color_text\}\}/g, colors.text);

  const outDir = path.resolve('weddings', wedding.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  return outPath;
}
