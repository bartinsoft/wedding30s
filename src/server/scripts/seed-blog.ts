/**
 * Seed initial blog posts for wedding30s.
 * Idempotent: re-running upserts by (slug, locale).
 *
 * Usage:
 *   npx tsx src/server/scripts/seed-blog.ts
 */
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { query, execute } from '../db/index.js';

interface SeedPost {
  slug: string;
  locale: 'es' | 'en';
  title: string;
  description: string;
  content_html: string;
  hero_image?: string | null;
  translated_slug?: string | null;
  published_at: string;
}

const POSTS: SeedPost[] = [
  {
    slug: 'how-to-make-30-second-wedding-invitation-video',
    locale: 'en',
    title: 'How to Make a 30-Second Wedding Invitation Video (No Editing Skills Required)',
    description: 'A practical guide to creating a beautiful video wedding invitation in 30 seconds — without iMovie, Premiere or any video editing experience.',
    published_at: '2026-04-14T09:00:00Z',
    content_html: `
<p>Paper invitations are gorgeous. They're also expensive, slow to send, hard to update, and almost impossible to share with the cousin who lives abroad. The wedding invitation has been quietly migrating online for a decade — and the most engaging format on the modern web isn't a PDF, it's video.</p>

<p>This guide walks through how to create a <strong>30-second wedding invitation video</strong> that you can share on WhatsApp, Instagram or as a direct link. No editing software, no design background, and no late nights.</p>

<h2>Why 30 seconds is the sweet spot</h2>

<p>Thirty seconds is enough to share the names, the date, the venue and a feeling. It is short enough to watch in full on a phone, short enough to forward without thinking, and short enough that everyone — including older relatives — actually finishes it.</p>

<p>Anything longer than 60 seconds gets scrolled past. Anything shorter than 15 feels rushed. The 30-second format hits the engagement window of every major social platform and reads as "considered" rather than "casual."</p>

<h2>What goes inside the 30 seconds</h2>

<p>The structure that works for almost every couple:</p>

<ul>
  <li><strong>Seconds 0-3:</strong> a single still photo or a 3-second clip of the two of you, with your names appearing on screen.</li>
  <li><strong>Seconds 3-12:</strong> the date in a beautiful typeface, the city, the venue. Plain, calm, readable.</li>
  <li><strong>Seconds 12-22:</strong> 2-3 quick shots of the venue or the location (you can pull these from the venue's website or use stock photos).</li>
  <li><strong>Seconds 22-30:</strong> a clear call to action — "RSVP at our website" with the URL, or just "Save the date".</li>
</ul>

<p>The trick is restraint. Most wedding videos try to do too much. Yours doesn't have to.</p>

<h2>The fastest way to make one (no editing app)</h2>

<p>You can absolutely make this in iMovie, CapCut or Canva. But there is a faster path: use a wedding website builder that generates the video for you from your details.</p>

<p>You fill in the names, the date, the location, pick a template and a colour palette, upload one or two photos, and the platform produces the 30-second video automatically — synchronised to soft background music, with smooth transitions and the right typography for each scene.</p>

<p>Wedding30s does this. You can <a href="/create">create a wedding website in 5 minutes</a> and the video lives at the top of your invitation page. Anyone you share the link with sees the video first, then the full programme, the RSVP form, the directions and the menu choices below it.</p>

<h2>Three details that make a video invitation feel premium</h2>

<h3>1. Use one accent colour, not five</h3>

<p>A consistent colour palette is what separates a "homemade" invitation from a designer one. Pick one accent colour — sage, blush, terracotta, navy — and let everything else stay neutral. Wedding website builders default to coordinated palettes precisely for this reason.</p>

<h3>2. Slow the typography</h3>

<p>Names and dates should appear and stay on screen for at least 2.5 seconds. Anything that flashes in and out under 2 seconds feels like an ad. Slow typography reads as "expensive."</p>

<h3>3. End on a clear next step</h3>

<p>Don't fade out on a generic "see you there." End with the URL of your wedding website or a clear "RSVP at..." line. Every guest should know exactly what to do after watching.</p>

<h2>Sharing strategy: where the video actually goes</h2>

<p>The video itself is the asset. The strategy is how you distribute it.</p>

<ul>
  <li><strong>WhatsApp groups</strong> — primary channel for most weddings today. Send it once with a short message: "We're getting married. The whole invitation is here ↓".</li>
  <li><strong>Instagram Stories</strong> — share as a 3-frame story with the link sticker pointing at your wedding website.</li>
  <li><strong>Email to older relatives</strong> — embed it inside an email with the link as a fallback.</li>
  <li><strong>Direct links for those who don't use social</strong> — your wedding website URL works as a universal fallback. No app, no account, no friction.</li>
</ul>

<h2>Common mistakes to avoid</h2>

<p><strong>Background music too loud.</strong> Music should sit at 30-40% of the volume. Anyone who watches with the sound on should hear the music; anyone with the sound off shouldn't notice it's missing.</p>

<p><strong>Too many photos.</strong> Three is enough. Five is too many. The video is an invitation, not a slideshow.</p>

<p><strong>Forgetting the RSVP step.</strong> A beautiful invitation that doesn't tell guests how to confirm is a problem. The video should always end pointing at the URL where guests can respond.</p>

<p><strong>Ignoring the URL itself.</strong> Make the URL short, memorable, and tied to your names. <code>wedding30s.com/sara-and-mike</code> is shareable. <code>wedding30s.com/wedding-2026-08-15-fd83</code> is not.</p>

<h2>Try it in five minutes</h2>

<p>If you want to skip the design work entirely, our wedding website builder handles all of this for you: the 30-second video, the colour palette, the typography, the RSVP form, the venue directions and the guest list management. You fill in your details, you pick a template, you publish.</p>
`,
    translated_slug: null,
  },
  {
    slug: 'digital-wedding-invitation-ideas',
    locale: 'en',
    title: 'Digital Wedding Invitation Ideas: 12 Modern Formats Couples Are Using in 2026',
    description: 'From animated invites to interactive RSVP pages, here are the digital wedding invitation formats actually working in 2026 — with examples and pros & cons.',
    published_at: '2026-04-14T10:00:00Z',
    content_html: `
<p>The "Save the Date" magnet is dying. So is the embossed paper invitation that costs €3 per guest and shows up two weeks late. In its place, a generation of couples is sending invitations that are interactive, mobile-first, and built for the way their guests actually communicate.</p>

<p>Here are the <strong>12 digital wedding invitation formats</strong> that are working in 2026 — what they look like, who they're for, and the trade-offs you should know about before picking one.</p>

<h2>1. The 30-second video invitation</h2>

<p>A short, vertical or square video that fits perfectly in WhatsApp and Instagram Stories. Names, date, venue, and a call to action — all in 30 seconds. Most engagement, easiest to share, almost zero learning curve for guests.</p>

<p><strong>Best for:</strong> couples whose guests live in different cities or countries.<br><strong>Watch out for:</strong> background music that's too loud or videos longer than 45 seconds.</p>

<h2>2. The single-page wedding website</h2>

<p>A clean URL like <code>wedding30s.com/your-names</code> with the whole story on one scrollable page: hero photo, date, location, programme, RSVP form, directions and menu. No login required for guests.</p>

<p><strong>Best for:</strong> the default modern wedding. Works for everything from intimate elopements to 200-guest celebrations.<br><strong>Watch out for:</strong> overloading the page with five sections nobody reads. Less is more.</p>

<h2>3. The QR code invitation</h2>

<p>A physical card (or fridge magnet) with a single QR code that opens your wedding website. Combines the keepsake feel of paper with all the convenience of digital.</p>

<p><strong>Best for:</strong> couples who want a physical memento but can't justify the cost or logistics of full paper invitations.<br><strong>Watch out for:</strong> printing the QR too small. Test it from a phone before ordering.</p>

<h2>4. The animated GIF invitation</h2>

<p>Smaller and lighter than video, but more eye-catching than a static image. Perfect for the WhatsApp-first generation.</p>

<p><strong>Best for:</strong> couples who want something fun and shareable without a full video production.<br><strong>Watch out for:</strong> file size — keep it under 5MB or it won't autoplay on slow connections.</p>

<h2>5. The interactive RSVP page</h2>

<p>Guests confirm their attendance, choose their menu (with allergies), say if they're bringing a plus one, and even leave a message — all in one form. You see the responses in real time on a private dashboard.</p>

<p><strong>Best for:</strong> any wedding where you need to track menu choices or a guest list above 30 people.<br><strong>Watch out for:</strong> sending an automatic confirmation email so guests know their RSVP went through.</p>

<h2>6. The Spotify playlist invitation</h2>

<p>You share a Spotify playlist link as the invitation, with the cover art set to the wedding details. Guests can add their own song requests. Pure modern romance.</p>

<p><strong>Best for:</strong> music-loving couples and intimate weddings.<br><strong>Watch out for:</strong> it's not actually an invitation — it's a teaser. You still need a real RSVP page.</p>

<h2>7. The Instagram story invitation</h2>

<p>A 3-frame story shared on your private profile, with the link sticker pointing at your wedding website. Guests tap the link, see the website, RSVP.</p>

<p><strong>Best for:</strong> couples whose guests are mostly on Instagram.<br><strong>Watch out for:</strong> it disappears in 24h, so most couples send a follow-up via WhatsApp anyway.</p>

<h2>8. The personalised video for VIPs</h2>

<p>A general 30-second invitation for everyone, plus 5-6 personalised videos for parents, witnesses and very close friends. Each one with a private message at the start.</p>

<p><strong>Best for:</strong> couples who want VIP guests to feel special.<br><strong>Watch out for:</strong> over-engineering. A heartfelt one-minute personal voice note can have the same effect.</p>

<h2>9. The wedding hashtag landing page</h2>

<p>A wedding-specific hashtag (<code>#SaraAndMike2026</code>) plus a landing page that aggregates photos guests post during the day.</p>

<p><strong>Best for:</strong> Instagram-first couples who want a post-wedding photo collage.<br><strong>Watch out for:</strong> not all guests post publicly. Don't rely on this as your only photo source.</p>

<h2>10. The countdown invitation</h2>

<p>The wedding website includes a live countdown to the wedding day. Some couples reveal new content as the date gets closer — the menu in week -8, the programme in week -4, the venue parking details in week -1.</p>

<p><strong>Best for:</strong> couples planning long-distance or destination weddings.<br><strong>Watch out for:</strong> overload. Schedule the reveals; don't dump everything at once.</p>

<h2>11. The illustrated invitation</h2>

<p>A custom illustration of the venue or the couple, used as the hero image of the wedding website. Feels personal and timeless.</p>

<p><strong>Best for:</strong> couples who want something unique and don't mind paying an illustrator (€80-300 typical).<br><strong>Watch out for:</strong> turnaround time — book the illustrator at least 6 weeks before sending invitations.</p>

<h2>12. The bilingual wedding website</h2>

<p>A single wedding website with versions in two languages — perfect for international couples or weddings with guests from multiple countries. Guests pick their language at the top.</p>

<p><strong>Best for:</strong> international couples and destination weddings.<br><strong>Watch out for:</strong> consistency. The two language versions should always have the same content, updated in sync.</p>

<h2>Which format should you choose?</h2>

<p>If you have to pick one and only one: a single-page wedding website with a 30-second hero video at the top. It covers 90% of what guests need, works on every device, and scales from 20 guests to 200 without changing anything.</p>

<p>Wedding30s gives you exactly that — the video, the wedding page, the RSVP form, the menu management, the gallery and the directions, all from a single 5-minute setup. <a href="/create">Try it free</a> and only pay (€49, one time) when you're ready to publish.</p>
`,
    translated_slug: null,
  },
];

async function seed() {
  for (const post of POSTS) {
    const existing = (await query(
      'SELECT id FROM blog_posts WHERE slug = ? AND locale = ? LIMIT 1',
      [post.slug, post.locale],
    )) as { id: string }[];

    if (existing.length > 0) {
      await execute(
        `UPDATE blog_posts
         SET title = ?, description = ?, content_html = ?, hero_image = ?, translated_slug = ?, published_at = ?
         WHERE id = ?`,
        [
          post.title,
          post.description,
          post.content_html,
          post.hero_image ?? null,
          post.translated_slug ?? null,
          new Date(post.published_at),
          existing[0].id,
        ],
      );
      console.log(`updated: ${post.locale}/${post.slug}`);
    } else {
      const id = randomUUID();
      await execute(
        `INSERT INTO blog_posts (id, slug, locale, title, description, content_html, hero_image, translated_slug, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          post.slug,
          post.locale,
          post.title,
          post.description,
          post.content_html,
          post.hero_image ?? null,
          post.translated_slug ?? null,
          new Date(post.published_at),
        ],
      );
      console.log(`created: ${post.locale}/${post.slug}`);
    }
  }
  console.log(`Seed complete: ${POSTS.length} posts`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
