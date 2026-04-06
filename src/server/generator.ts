import fs from 'node:fs';
import path from 'node:path';
import { uploadWeddingHtml, getFromS3 } from './storage/s3.js';
import type { Readable } from 'node:stream';

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
  language?: string;
  maps_url?: string | null;
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

interface NewMenuItem {
  name: string;
}

interface NewMenuSection {
  name: string;
  items: NewMenuItem[];
  choose: boolean;
}

interface NewMenu {
  name: string;
  sections: NewMenuSection[];
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TEMPLATE_STRINGS: Record<string, Record<string, string>> = {
  es: {
    countdown_days: 'Días',
    countdown_hours: 'Horas',
    countdown_min: 'Min',
    countdown_sec: 'Seg',
    scroll: 'Desliza',
    rsvp_title: 'Confirma tu asistencia',
    rsvp_subtitle: 'Rellena el formulario y nos lo harás saber',
    rsvp_name_label: 'Nombre *',
    rsvp_name_placeholder: 'Tu nombre completo',
    rsvp_email_label: 'Email',
    rsvp_email_placeholder: 'tu@email.com (opcional)',
    rsvp_menu_label: 'Elección de menú',
    rsvp_menu_placeholder: 'Selecciona tu plato...',
    rsvp_allergies_label: 'Alergias o intolerancias',
    rsvp_allergies_placeholder: 'Opcional',
    rsvp_plus_one: 'Vengo con acompañante',
    rsvp_plus_one_name: 'Nombre del acompañante',
    rsvp_plus_one_placeholder: 'Nombre completo',
    rsvp_message_label: 'Mensaje para los novios',
    rsvp_message_placeholder: 'Opcional',
    rsvp_submit: 'Confirmar asistencia',
    rsvp_guest: 'Comensal',
    rsvp_add_guest: 'Añadir otro comensal',
    rsvp_menu_type: 'Tipo de menú',
    rsvp_decline: 'No puedo asistir',
    rsvp_decline_title: 'Recibido',
    rsvp_decline_text: 'Lamentamos que no puedas asistir. ¡Os deseamos lo mejor!',
    rsvp_success_title: '¡Confirmación recibida!',
    rsvp_success_text: 'Muchas gracias. ¡Nos vemos pronto!',
    story_prefix: 'El próximo',
    story_headline: '¡¡Nos casamos!!',
    story_cta: '¡¡No faltéis!!',
    gallery_title: 'Nuestra historia',
    gallery_subtitle: 'Pasa las páginas de nuestro álbum',
    footer_text: 'Con todo nuestro amor',
    powered_by: 'Created with Wedding30s',
    page_title: '¡Nos Casamos!',
    add_to_calendar: 'Añadir al calendario',
    open_in_maps: 'Abrir en Maps',
    menu_choose: '✦ A elegir entre:',
  },
  en: {
    countdown_days: 'Days',
    countdown_hours: 'Hours',
    countdown_min: 'Min',
    countdown_sec: 'Sec',
    scroll: 'Scroll',
    rsvp_title: 'Confirm your attendance',
    rsvp_subtitle: 'Fill in the form and let us know',
    rsvp_name_label: 'Name *',
    rsvp_name_placeholder: 'Your full name',
    rsvp_email_label: 'Email',
    rsvp_email_placeholder: 'your@email.com (optional)',
    rsvp_menu_label: 'Menu choice',
    rsvp_menu_placeholder: 'Select your dish...',
    rsvp_allergies_label: 'Allergies or intolerances',
    rsvp_allergies_placeholder: 'Optional',
    rsvp_plus_one: 'I\'m bringing a plus one',
    rsvp_plus_one_name: 'Plus one\'s name',
    rsvp_plus_one_placeholder: 'Full name',
    rsvp_message_label: 'Message for the couple',
    rsvp_message_placeholder: 'Optional',
    rsvp_submit: 'Confirm attendance',
    rsvp_guest: 'Guest',
    rsvp_add_guest: 'Add another guest',
    rsvp_menu_type: 'Menu type',
    rsvp_decline: 'I can\'t attend',
    rsvp_decline_title: 'Received',
    rsvp_decline_text: 'We\'re sorry you can\'t make it. Wishing you all the best!',
    rsvp_success_title: 'Confirmation received!',
    rsvp_success_text: 'Thank you so much. See you soon!',
    story_prefix: 'On',
    story_headline: 'We\'re getting married!!',
    story_cta: 'Don\'t miss it!!',
    gallery_title: 'Our story',
    gallery_subtitle: 'Turn the pages of our album',
    footer_text: 'With all our love',
    powered_by: 'Created with Wedding30s',
    page_title: 'We\'re Getting Married!',
    add_to_calendar: 'Add to Calendar',
    open_in_maps: 'Open in Maps',
    menu_choose: '✦ Choose from:',
  },
};

function formatDateHuman(dateStr: string, language: string = 'es'): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const year = d.getFullYear();
  if (language === 'en') {
    const month = MONTHS_EN[d.getMonth()];
    return `${month} ${day}, ${year}`;
  }
  const month = MONTHS_ES[d.getMonth()];
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

function isNewMenuFormat(data: unknown[]): data is NewMenu[] {
  return data.length > 0 && 'sections' in (data[0] as Record<string, unknown>);
}

function generateMenuHtml(menuJson: string): string {
  let parsed: unknown[];
  try {
    parsed = JSON.parse(menuJson);
  } catch {
    return '';
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return '';

  if (isNewMenuFormat(parsed)) {
    return (parsed as NewMenu[]).map((menu, i) => {
      const delayClass = `reveal reveal-delay-${Math.min(i + 2, 4)}`;
      let inner = '';

      inner += `<div class="menu-card-header">`;
      inner += `<span class="menu-card-icon">🍽️</span>`;
      inner += `<span class="menu-card-title">${menu.name}</span>`;
      inner += `</div>`;

      for (const section of menu.sections) {
        if (section.name) {
          inner += `<p class="menu-phase">${section.name}</p>`;
        }
        if (section.choose) {
          inner += `<p class="menu-choose-label">{{t_menu_choose}}</p>`;
        }
        const filledItems = section.items.filter(item => item.name);
        if (filledItems.length > 0) {
          inner += `<ul class="menu-items">`;
          for (const item of filledItems) {
            inner += `<li>${item.name}</li>`;
          }
          inner += `</ul>`;
        }
      }

      return `<div class="menu-card ${delayClass}">${inner}</div>`;
    }).join('\n        ');
  }

  const sections = parsed as MenuSection[];
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
          inner += `<p class="menu-choose-label">{{t_menu_choose}}</p>`;
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
  let parsed: unknown[];
  try {
    parsed = JSON.parse(menuJson);
  } catch {
    return '';
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return '';

  const options: string[] = [];

  if (isNewMenuFormat(parsed)) {
    for (const menu of parsed as NewMenu[]) {
      if ((parsed as NewMenu[]).length > 1) {
        options.push(`<option disabled>── ${menu.name} ──</option>`);
      }
      for (const section of menu.sections) {
        if (section.choose) {
          if (section.name) {
            options.push(`<option disabled>── ${section.name} ──</option>`);
          }
          for (const item of section.items) {
            if (item.name) {
              options.push(`<option value="${item.name}">${item.name}</option>`);
            }
          }
        }
      }
    }
  } else {
    for (const section of parsed as MenuSection[]) {
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
  }

  return options.join('\n                    ');
}

function generateDishData(menuJson: string): string {
  let parsed: unknown[];
  try {
    parsed = JSON.parse(menuJson);
  } catch {
    return '{"menus":[],"hasMultipleMenus":false}';
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return '{"menus":[],"hasMultipleMenus":false}';

  interface MenuDishData {
    name: string;
    sections: { section: string; items: string[] }[];
  }

  const menus: MenuDishData[] = [];

  if (isNewMenuFormat(parsed)) {
    for (const menu of parsed as NewMenu[]) {
      const sections: { section: string; items: string[] }[] = [];
      for (const section of menu.sections) {
        if (section.choose) {
          const items = section.items.filter(i => i.name).map(i => i.name);
          if (items.length > 0) {
            sections.push({ section: section.name || '', items });
          }
        }
      }
      // Include menu even without chooseable sections (user just picks this menu type)
      menus.push({ name: menu.name, sections });
    }
  } else {
    const sections: { section: string; items: string[] }[] = [];
    for (const section of parsed as MenuSection[]) {
      if (section.phases) {
        for (const phase of section.phases) {
          if (phase.choose) {
            const items = phase.items.map(i => i.replace(/<[^>]*>/g, ''));
            sections.push({ section: phase.name || section.title, items });
          }
        }
      }
    }
    if (sections.length > 0) {
      menus.push({ name: 'Menu', sections });
    }
  }

  return JSON.stringify({ menus, hasMultipleMenus: menus.length > 1 });
}

async function urlToBase64(url: string): Promise<string> {
  // url is like /media/photos/xxx/gallery-0.webp — strip /media/ to get S3 key
  const key = url.replace(/^\/media\//, '');
  try {
    const result = await getFromS3(key);
    if (!result) return url;
    const chunks: Buffer[] = [];
    for await (const chunk of result.stream as Readable) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const base64 = Buffer.concat(chunks).toString('base64');
    const mime = result.contentType || 'image/webp';
    return `data:${mime};base64,${base64}`;
  } catch {
    return url; // fallback to original URL
  }
}

async function resolvePhotosToBase64(photos: { url: string; year: string; label?: string }[]): Promise<{ url: string; year: string; label?: string }[]> {
  return Promise.all(photos.map(async (photo) => ({
    ...photo,
    url: photo.url.startsWith('/media/') ? await urlToBase64(photo.url) : photo.url,
  })));
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
                    <img src="${photo.url}" alt="" class="album-page-img">
                    <div class="album-page-footer">
                        ${footer}
                    </div>
                </div>
            </div>`;
  }).join('\n            ');
}

function toEmbedUrl(mapsUrl: string): string {
  // If it's already an embed URL, use it
  if (mapsUrl.includes('/embed')) return mapsUrl;
  // Extract the query/place from various Google Maps URL formats
  // https://www.google.com/maps/place/... -> embed
  // https://maps.google.com/?q=... -> embed
  // https://goo.gl/maps/... -> use as-is with embed
  const placeMatch = mapsUrl.match(/\/maps\/place\/([^/@?]+)/);
  const qMatch = mapsUrl.match(/[?&]q=([^&]+)/);
  const query = placeMatch ? decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')) : qMatch ? decodeURIComponent(qMatch[1]) : null;
  if (query) {
    return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(query)}`;
  }
  // Fallback: use iframe with the original URL
  return mapsUrl.replace('/maps/', '/maps/embed/v1/place?q=');
}

function generateMapsHtml(mapsUrl: string, location: string): string {
  // Generate an iframe embed for the maps URL
  // Use a simple embed approach that works without API key
  const embedSrc = mapsUrl.includes('google.com/maps')
    ? mapsUrl.replace('/maps/', '/maps/embed?') + '&output=embed'
    : mapsUrl;

  return `<div class="maps-embed-wrap">
            <iframe src="${embedSrc}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="maps-embed-overlay" onclick="this.classList.add('active')"></div>
        </div>`;
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

export async function generateWeddingHtml(wedding: WeddingData): Promise<string> {
  const templatePath = path.resolve('templates', `${wedding.template}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${wedding.template}`);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  const colors = JSON.parse(wedding.colors);
  const lang = wedding.language || 'es';
  const t = TEMPLATE_STRINGS[lang] || TEMPLATE_STRINGS['es'];

  const menuHtml = wedding.menu ? generateMenuHtml(wedding.menu) : '';
  const menuOptions = wedding.menu ? generateMenuOptions(wedding.menu) : '';
  const dishData = wedding.menu ? generateDishData(wedding.menu) : '[]';

  // Convert photos to base64
  const resolvedPhotos = wedding.photos ? await resolvePhotosToBase64(wedding.photos) : null;
  const galleryHtml = resolvedPhotos ? generateGalleryHtml(resolvedPhotos) : '';

  // Convert hero photo to base64
  const heroPhotoUrl = wedding.photo_url?.startsWith('/media/')
    ? await urlToBase64(wedding.photo_url)
    : (wedding.photo_url || '');

  const hasMenuChoices = menuOptions.length > 0;

  const mapsHtml = wedding.maps_url ? generateMapsHtml(wedding.maps_url, wedding.location) : '';

  html = processConditionalSections(html, 'story', wedding.story || '');
  html = processConditionalSections(html, 'gallery_html', galleryHtml);
  html = processConditionalSections(html, 'menu_html', menuHtml);
  html = processConditionalSections(html, 'has_menu_choices', hasMenuChoices ? 'yes' : '');
  html = processConditionalSections(html, 'maps_html', mapsHtml);

  // OG image: use hero photo URL if available, fallback to default
  const ogImage = wedding.photo_url
    ? (wedding.photo_url.startsWith('/media/')
      ? `https://wedding30s.com${wedding.photo_url}`
      : wedding.photo_url)
    : 'https://wedding30s.com/og-image.png';

  html = html
    .replace(/\{\{partner1\}\}/g, wedding.partner1_name)
    .replace(/\{\{partner2\}\}/g, wedding.partner2_name)
    .replace(/\{\{date_formatted\}\}/g, formatDateHuman(wedding.date, lang))
    .replace(/\{\{date_short\}\}/g, formatDateShort(wedding.date))
    .replace(/\{\{date_iso\}\}/g, formatDateIso(wedding.date))
    .replace(/\{\{location\}\}/g, wedding.location)
    .replace(/\{\{venue\}\}/g, wedding.venue || '')
    .replace(/\{\{photo_url\}\}/g, heroPhotoUrl)
    .replace(/\{\{og_image\}\}/g, ogImage)
    .replace(/\{\{lang\}\}/g, lang)
    .replace(/\{\{story\}\}/g, wedding.story || '')
    .replace(/\{\{menu_html\}\}/g, menuHtml)
    .replace(/\{\{menu_options\}\}/g, menuOptions)
    .replace(/\{\{dish_data\}\}/g, dishData)
    .replace(/\{\{gallery_html\}\}/g, galleryHtml)
    .replace(/\{\{program\}\}/g, wedding.program || '')
    .replace(/\{\{maps_html\}\}/g, mapsHtml)
    .replace(/\{\{slug\}\}/g, wedding.slug)
    .replace(/\{\{color_primary\}\}/g, colors.primary)
    .replace(/\{\{color_secondary\}\}/g, colors.secondary)
    .replace(/\{\{color_bg\}\}/g, colors.bg)
    .replace(/\{\{color_text\}\}/g, colors.text);

  for (const [key, value] of Object.entries(t)) {
    html = html.replace(new RegExp(`\\{\\{t_${key}\\}\\}`, 'g'), value);
  }

  const outDir = path.resolve('weddings', wedding.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, html, 'utf-8');

  // Upload to S3 (fire and forget)
  uploadWeddingHtml(wedding.slug, html).catch(err => {
    console.error('Failed to upload wedding HTML to S3:', err);
  });

  return outPath;
}
