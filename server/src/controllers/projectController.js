const { getPool, sql } = require('../db/pool');

async function getProjects(req, res) {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query('SELECT id, title, description, imageURL, link FROM Projects ORDER BY id DESC');
    return res.json(result.recordset || []);
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
    const result = await pool.request()
      .input('title', sql.NVarChar(255), title)
      .input('description', sql.NVarChar(sql.MAX), description || null)
      .input('imageURL', sql.NVarChar(1024), imageURL || null)
      .input('link', sql.NVarChar(1024), link || null)
      .query(`
        INSERT INTO Projects (title, description, imageURL, link)
        OUTPUT INSERTED.id, INSERTED.title, INSERTED.description, INSERTED.imageURL, INSERTED.link
        VALUES (@title, @description, @imageURL, @link)
      `);
    return res.status(201).json(result.recordset?.[0] || { ok: true });
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
    const request = pool.request()
      .input('id', sql.Int, Number(id))
      .input('title', sql.NVarChar(255), title || null)
      .input('description', sql.NVarChar(sql.MAX), description || null)
      .input('imageURL', sql.NVarChar(1024), imageURL || null)
      .input('link', sql.NVarChar(1024), link || null);
    await request.query(`
      UPDATE Projects
      SET
        title = COALESCE(@title, title),
        description = COALESCE(@description, description),
        imageURL = COALESCE(@imageURL, imageURL),
        link = COALESCE(@link, link)
      WHERE id = @id
    `);
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
    await pool.request().input('id', sql.Int, Number(id)).query('DELETE FROM Projects WHERE id = @id');
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject };


