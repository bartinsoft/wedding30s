import { Router } from 'express';
import { queryOne, execute } from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';

const router = Router();

function tryVerifyWebhook(Stripe: any, body: any, sig: string) {
  const configs = [
    { key: process.env.STRIPE_SECRET_KEY_TEST, secret: process.env.STRIPE_WEBHOOK_SECRET_TEST, mode: 'test' },
    { key: process.env.STRIPE_SECRET_KEY, secret: process.env.STRIPE_WEBHOOK_SECRET, mode: 'live' },
  ].filter(c => c.key && c.secret);

  for (const config of configs) {
    try {
      const stripe = new Stripe(config.key);
      const event = stripe.webhooks.constructEvent(body, sig, config.secret);
      return { event, mode: config.mode };
    } catch {
      continue;
    }
  }
  return null;
}

router.post('/api/webhooks/stripe', async (req, res) => {
  const hasAnyKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY_TEST;
  const hasAnySecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET_TEST;

  if (!hasAnyKey || !hasAnySecret) {
    console.warn('Stripe keys not configured, skipping webhook verification');
    res.status(200).json({ received: true, skipped: true });
    return;
  }

  try {
    const Stripe = (await import('stripe')).default;
    const sig = req.headers['stripe-signature'] as string;

    const result = tryVerifyWebhook(Stripe, req.body, sig);
    if (!result) {
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    const { event } = result;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const wedding = await queryOne('SELECT * FROM weddings WHERE stripe_session_id = ?', [(session as any).id]) as Record<string, string> | undefined;

      if (wedding) {
        await execute("UPDATE weddings SET status = 'published', updated_at = NOW() WHERE id = ?", [wedding.id]);

        try {
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
        } catch (err) {
          console.error('Failed to generate wedding HTML:', err);
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
