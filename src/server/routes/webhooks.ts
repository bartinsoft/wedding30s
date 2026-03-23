import { Router } from 'express';
import db from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';

const router = Router();

router.post('/api/webhooks/stripe', async (req, res) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('Stripe keys not configured, skipping webhook verification');
    res.status(200).json({ received: true, skipped: true });
    return;
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'] as string;

    let event: InstanceType<typeof Stripe>['webhooks'] extends { constructEvent: (...args: any[]) => infer R } ? R : never;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      res.status(400).send('Webhook signature verification failed');
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const wedding = db.prepare('SELECT * FROM weddings WHERE stripe_session_id = ?').get((session as any).id) as Record<string, string> | undefined;

      if (wedding) {
        db.prepare("UPDATE weddings SET status = 'published', updated_at = datetime('now') WHERE id = ?").run(wedding.id);

        try {
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
