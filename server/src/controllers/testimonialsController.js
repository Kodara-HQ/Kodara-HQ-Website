const { getPool } = require('../db/pool');

async function getTestimonials(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query('SELECT id, clientName, feedback, rating FROM Testimonials ORDER BY id DESC');
    return res.json(result.recordset || []);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getTestimonials };


