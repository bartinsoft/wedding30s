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
  photos?: { url: string; year: string; label?: string }[] | null;
}

interface MenuSection {
  title: string;
  icon: string;
  phases?: { name: string; note?: string; items: string[]; choose?: boolean }[];
  items?: string[];
  interlude?: string;
  extras?: string;
  note?: string;
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatDateHuman(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = MONTHS_ES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day} · ${month} · ${year}`;
}

function formatDateIso(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString();
}

function generateMenuHtml(menuJson: string): string {
  let sections: MenuSection[];
  try {
    sections = JSON.parse(menuJson);
  } catch {
    return '';
  }

  if (!Array.isArray(sections) || sections.length === 0) return '';

  return sections.map((section, i) => {
    const delayClass = `reveal reveal-delay-${Math.min(i + 2, 4)}`;
    let inner = '';

    inner += `<div class="menu-card-header">`;
    inner += `<span class="menu-card-icon">${section.icon}</span>`;
    inner += `<span class="menu-card-title">${section.title}</span>`;
    inner += `</div>`;

    if (section.phases) {
      for (const phase of section.phases) {
        inner += `<p class="menu-phase">${phase.name}</p>`;
        if (phase.note) {
          inner += `<p class="menu-phase-note">${phase.note}</p>`;
        }
        if (phase.choose) {
          inner += `<p class="menu-choose-label">✦ A elegir entre:</p>`;
        }
        inner += `<ul class="menu-items">`;
        for (const item of phase.items) {
          inner += `<li>${item}</li>`;
        }
        inner += `</ul>`;
      }
    }

    if (section.items) {
      inner += `<ul class="menu-items">`;
      for (const item of section.items) {
        inner += `<li>${item}</li>`;
      }
      inner += `</ul>`;
    }

    if (section.interlude) {
      inner += `<p class="menu-interlude">${section.interlude}</p>`;
    }

    if (section.extras) {
      inner += `<p class="menu-extras">${section.extras}</p>`;
    }

    if (section.note) {
      inner += `<p class="menu-extras">${section.note}</p>`;
    }

    return `<div class="menu-card ${delayClass}">${inner}</div>`;
  }).join('\n        ');
}

function generateMenuOptions(menuJson: string): string {
  let sections: MenuSection[];
  try {
    sections = JSON.parse(menuJson);
  } catch {
    return '';
  }

  if (!Array.isArray(sections) || sections.length === 0) return '';

  const options: string[] = [];

  for (const section of sections) {
    options.push(`<option disabled>── ${section.title} ──</option>`);

    if (section.phases) {
      for (const phase of section.phases) {
        if (phase.choose) {
          for (const item of phase.items) {
            const clean = item.replace(/<[^>]*>/g, '');
            options.push(`<option value="${clean}">${clean}</option>`);
          }
        }
      }
    }

    if (section.items) {
      for (const item of section.items) {
        const clean = item.replace(/<[^>]*>/g, '');
        options.push(`<option value="${clean}">${clean}</option>`);
      }
    }
  }

  return options.join('\n                    ');
}

function generateGalleryHtml(photos: { url: string; year: string; label?: string }[]): string {
  if (!photos || photos.length === 0) return '';

  return photos.map((photo, i) => {
    let footer = `<p class="album-page-year">${photo.year}</p>`;
    if (photo.label) {
      footer += `\n                        <p class="album-page-label">${photo.label}</p>`;
    }

    return `<div class="album-page" data-index="${i}">
                <div class="album-page-inner">
                    <img src="${photo.url}" alt="Foto ${photo.year}" class="album-page-img" loading="lazy">
                    <div class="album-page-footer">
                        ${footer}
                    </div>
                </div>
            </div>`;
  }).join('\n            ');
}

function processConditionalSections(html: string, sectionName: string, content: string): string {
  const openTag = `{{#${sectionName}}}`;
  const closeTag = `{{/${sectionName}}}`;

  if (!content) {
    const regex = new RegExp(`${openTag.replace(/[{}#/]/g, '\\$&')}[\\s\\S]*?${closeTag.replace(/[{}#/]/g, '\\$&')}`, 'g');
    return html.replace(regex, '');
  }

  return html
    .replace(new RegExp(openTag.replace(/[{}#]/g, '\\$&'), 'g'), '')
    .replace(new RegExp(closeTag.replace(/[{}#/]/g, '\\$&'), 'g'), '');
}

export function generateWeddingHtml(wedding: WeddingData): string {
  const templatePath = path.resolve('templates', `${wedding.template}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${wedding.template}`);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  const colors = JSON.parse(wedding.colors);

  const menuHtml = wedding.menu ? generateMenuHtml(wedding.menu) : '';
  const menuOptions = wedding.menu ? generateMenuOptions(wedding.menu) : '';
  const galleryHtml = wedding.photos ? generateGalleryHtml(wedding.photos) : '';
  const hasMenuChoices = menuOptions.length > 0;

  html = processConditionalSections(html, 'story', wedding.story || '');
  html = processConditionalSections(html, 'gallery_html', galleryHtml);
  html = processConditionalSections(html, 'menu_html', menuHtml);
  html = processConditionalSections(html, 'has_menu_choices', hasMenuChoices ? 'yes' : '');

  html = html
    .replace(/\{\{partner1\}\}/g, wedding.partner1_name)
    .replace(/\{\{partner2\}\}/g, wedding.partner2_name)
    .replace(/\{\{date_formatted\}\}/g, formatDateHuman(wedding.date))
    .replace(/\{\{date_short\}\}/g, formatDateShort(wedding.date))
    .replace(/\{\{date_iso\}\}/g, formatDateIso(wedding.date))
    .replace(/\{\{location\}\}/g, wedding.location)
    .replace(/\{\{venue\}\}/g, wedding.venue || '')
    .replace(/\{\{photo_url\}\}/g, wedding.photo_url || '')
    .replace(/\{\{story\}\}/g, wedding.story || '')
    .replace(/\{\{menu_html\}\}/g, menuHtml)
    .replace(/\{\{menu_options\}\}/g, menuOptions)
    .replace(/\{\{gallery_html\}\}/g, galleryHtml)
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
