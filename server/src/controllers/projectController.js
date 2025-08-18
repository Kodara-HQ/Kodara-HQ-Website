const { getPool } = require('../db/pool');

async function getProjects(req, res) {
  try {
    const pool = await getPool();
    const result = await pool.query('SELECT id, title, description, imageURL, link FROM Projects ORDER BY id DESC');
    return res.json(result.rows || []);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createProject(req, res) {
  const { title, description, imageURL, link } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const pool = await getPool();
    const result = await pool.query(`
      INSERT INTO Projects (title, description, imageURL, link)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, imageURL, link
    `, [title, description || null, imageURL || null, link || null]);
    return res.status(201).json(result.rows?.[0] || { ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateProject(req, res) {
  const { id } = req.params;
  const { title, description, imageURL, link } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing id' });
  try {
    const pool = await getPool();
    await pool.query(`
      UPDATE Projects
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        imageURL = COALESCE($3, imageURL),
        link = COALESCE($4, link)
      WHERE id = $5
    `, [title || null, description || null, imageURL || null, link || null, Number(id)]);
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteProject(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM Projects WHERE id = $1', [Number(id)]);
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };


