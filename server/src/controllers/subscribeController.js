const { getPool, sql } = require('../db/pool');

async function handleSubscribe(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const pool = await getPool();
    const request = pool.request();
    request.input('email', sql.NVarChar(255), email);

    await request.query(`
      IF NOT EXISTS (SELECT 1 FROM Subscriptions WHERE email = @email)
      BEGIN
        INSERT INTO Subscriptions (email, dateSubscribed)
        VALUES (@email, SYSDATETIMEOFFSET())
      END
    `);

    return res.status(201).json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { handleSubscribe };


