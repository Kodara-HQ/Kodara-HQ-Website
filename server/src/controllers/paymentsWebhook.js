const Stripe = require('stripe');
const { getPool, sql } = require('../db/pool');
const { sendContactNotification } = require('../services/emailService');

const stripeSecret = process.env.STRIPE_SECRET || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;

async function handleStripeWebhook(req, res) {
  if (!stripe) return res.status(500).send('Stripe not configured');
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    // req.body is a Buffer when express.raw middleware is attached
    event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const pool = await getPool();
      await pool.request()
        .input('id', sql.NVarChar(255), pi.id)
        .query("UPDATE Payments SET status = 'succeeded' WHERE stripePaymentIntentId = @id");

      const meta = pi.metadata || {};
      try {
        await sendContactNotification({
          name: meta.name || 'Client',
          email: process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER,
          message: `Payment succeeded for ${meta.projectRef || ''}. Amount: ${(pi.amount/100).toFixed(2)} ${pi.currency.toUpperCase()}`,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed sending receipt notification:', e);
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Webhook processing failed:', err);
  }

  return res.json({ received: true });
}

module.exports = { handleStripeWebhook };


