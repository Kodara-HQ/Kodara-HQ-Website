const { getPool } = require('../db/pool');

async function listContacts(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(`
        SELECT id, name, email, phone, company, service, budget, timeline, enquiryType, dateSubmitted
        FROM ContactMessages ORDER BY id DESC
      `);
    return res.json(result.recordset || []);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function listSubscriptions(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query('SELECT id, email, dateSubscribed FROM Subscriptions ORDER BY id DESC');
    return res.json(result.recordset || []);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function listPayments(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query(`
        SELECT id, stripePaymentIntentId, name, email, projectRef, agreed, depositAmount, currency, status, dateCreated
        FROM Payments ORDER BY id DESC
      `);
    return res.json(result.recordset || []);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { listContacts, listSubscriptions, listPayments };


