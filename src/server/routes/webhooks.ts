import { Router } from 'express';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { queryOne, execute } from '../db/index.js';
import { regenerateIfPublished } from './weddings.js';

const router = Router();

function tryVerifyWebhook(body: string, headers: Record<string, string>) {
  const configs = [
    { secret: process.env.POLAR_WEBHOOK_SECRET_TEST, mode: 'test' },
    { secret: process.env.POLAR_WEBHOOK_SECRET, mode: 'live' },
  ].filter(c => c.secret);

  for (const config of configs) {
    try {
      const event = validateEvent(body, headers, config.secret!);
      return { event, mode: config.mode };
    } catch (err) {
      if (err instanceof WebhookVerificationError) continue;
      throw err;
    }
  }
  return null;
}

router.post('/api/webhooks/polar', async (req, res) => {
  const hasAnySecret = process.env.POLAR_WEBHOOK_SECRET || process.env.POLAR_WEBHOOK_SECRET_TEST;

  if (!hasAnySecret) {
    console.warn('Polar webhook secrets not configured, skipping verification');
    res.status(200).json({ received: true, skipped: true });
    return;
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : req.body.toString('utf8');
    const result = tryVerifyWebhook(rawBody, req.headers as Record<string, string>);
    if (!result) {
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    const { event } = result;

    if (event.type === 'order.paid') {
      const order = event.data;
      const weddingId = order.metadata?.wedding_id;

      if (!weddingId) {
        console.warn('order.paid without wedding_id in metadata');
        res.json({ received: true });
        return;
      }

      const wedding = await queryOne('SELECT * FROM weddings WHERE id = ?', [weddingId]) as Record<string, any> | undefined;

      if (wedding) {
        await execute("UPDATE weddings SET status = 'published', updated_at = NOW() WHERE id = ?", [wedding.id]);
        wedding.status = 'published';
        regenerateIfPublished(wedding);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
