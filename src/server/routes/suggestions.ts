import { Router } from 'express';
import { nanoid } from 'nanoid';
import { execute, queryOne } from '../db/index.js';

const router = Router();

const GOOGLE_CHAT_WEBHOOK = process.env.GOOGLE_CHAT_WEBHOOK || '';
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || '';
import { sendEmail, wrapEmailTemplate } from '../email.js';

const BCC_EMAIL = process.env.SUGGESTIONS_BCC || '';

async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET || !token) return process.env.NODE_ENV !== 'production';

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

async function notifyGoogleChat(suggestion: { email: string; description: string; links: string }) {
  if (!GOOGLE_CHAT_WEBHOOK) return;

  const text = [
    `💡 *Nueva sugerencia de funcionalidad*`,
    ``,
    `📧 *Email:* ${suggestion.email}`,
    ``,
    `📝 *Descripción:*`,
    suggestion.description,
    suggestion.links ? `\n🔗 *Enlaces:*\n${suggestion.links}` : '',
  ].join('\n');

  try {
    await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error('Failed to notify Google Chat:', err);
  }
}

async function sendConfirmationEmail(to: string, description: string, links: string) {
  await sendEmail({
    to,
    bcc: BCC_EMAIL || undefined,
    subject: 'We received your suggestion — Wedding30s',
    html: wrapEmailTemplate(`
      <p>Thank you for your suggestion! We really appreciate you taking the time to share your ideas with us.</p>
      <p>Here's what you sent us:</p>
      <blockquote style="border-left: 3px solid #C4A35A; padding-left: 1rem; margin: 1rem 0; color: #555;">
        ${description.replace(/\n/g, '<br>')}
      </blockquote>
      ${links ? `<p><strong>Links:</strong><br>${links.replace(/\n/g, '<br>')}</p>` : ''}
      <p>Our team will review your suggestion shortly. If it's something we can implement, we'll get back to you with an estimated timeline.</p>
      <p style="margin-top: 2rem; color: #888; font-size: 0.9rem;">
        With love,<br>
        The Wedding30s Team
      </p>
    `),
  });
}

router.post('/api/suggestions', async (req, res) => {
  try {
    const { email, description, links, turnstileToken, weddingId } = req.body;

    if (!email || !description) {
      res.status(400).json({ error: 'Email and description are required' });
      return;
    }

    const turnstileValid = await verifyTurnstile(turnstileToken || '');
    if (!turnstileValid) {
      res.status(403).json({ error: 'Bot verification failed' });
      return;
    }

    let weddingSnapshot = null;
    if (weddingId) {
      const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [weddingId]);
      if (wedding) {
        weddingSnapshot = JSON.stringify(wedding);
      }
    }

    const id = nanoid();
    await execute(
      'INSERT INTO suggestions (id, email, description, links, wedding_id, wedding_snapshot) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, description, links || null, weddingId || null, weddingSnapshot]
    );

    // Fire and forget: notifications
    notifyGoogleChat({ email, description, links: links || '' });
    sendConfirmationEmail(email, description, links || '');

    res.status(201).json({ id });
  } catch (err) {
    console.error('Failed to create suggestion:', err);
    res.status(500).json({ error: 'Failed to submit suggestion' });
  }
});

export default router;
