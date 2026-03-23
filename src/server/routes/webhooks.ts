import { Router, raw } from 'express';
import Stripe from 'stripe';
import db from '../db/index.js';
import { generateWeddingHtml } from '../generator.js';

const router = Router();

router.post('/api/webhooks/stripe', raw({ type: 'application/json' }), (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    res.status(400).send('Webhook signature verification failed');
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const wedding = db.prepare('SELECT * FROM weddings WHERE stripe_session_id = ?').get(session.id) as Record<string, string> | undefined;

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
});

export default router;
