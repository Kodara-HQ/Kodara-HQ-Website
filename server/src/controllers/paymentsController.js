const Stripe = require('stripe');

const stripeSecret = process.env.STRIPE_SECRET || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;

const { getPool, sql } = require('../db/pool');
const { sendContactNotification } = require('../services/emailService');

async function createPaymentIntent(req, res) {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
    const { amount, currency, metadata } = req.body || {};
    if (!amount || !currency) {
      return res.status(400).json({ error: 'amount and currency are required' });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)),
      currency: String(currency || 'usd'),
      automatic_payment_methods: { enabled: true },
      metadata: metadata || {}
    });
    try {
      const pool = await getPool();
      const request = pool.request();
      const meta = metadata || {};
      const agreed = meta.agreed ? parseFloat(meta.agreed) : null;
      const deposit = amount ? (Number(amount) / 100.0) : null;
      request.input('stripePaymentIntentId', sql.NVarChar(255), intent.id);
      request.input('name', sql.NVarChar(255), meta.name || null);
      request.input('email', sql.NVarChar(255), meta.email || null);
      request.input('projectRef', sql.NVarChar(255), meta.projectRef || null);
      request.input('agreed', sql.Decimal(18,2), agreed);
      request.input('depositAmount', sql.Decimal(18,2), deposit);
      request.input('currency', sql.NVarChar(10), currency);
      request.input('status', sql.NVarChar(50), 'initialized');
      await request.query(`
        INSERT INTO Payments (stripePaymentIntentId, name, email, projectRef, agreed, depositAmount, currency, status)
        VALUES (@stripePaymentIntentId, @name, @email, @projectRef, @agreed, @depositAmount, @currency, @status)
      `);
    } catch (dbErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to persist payment:', dbErr);
    }
    return res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}

function getPublicConfig(req, res) {
  return res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE || '' });
}

module.exports = { createPaymentIntent, getPublicConfig };


