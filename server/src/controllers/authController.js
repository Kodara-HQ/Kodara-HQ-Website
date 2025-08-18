const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getPool, sql } = require('../db/pool');
const { sendPasswordResetEmail } = require('../services/emailService');

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-secret-change-me';
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.NVarChar(255), email)
      .query('SELECT TOP 1 id, name, email, password, role FROM Users WHERE email = @email');
    const user = result.recordset?.[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, getJwtSecret(), { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { login };

async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const pool = await getPool();
    // Only allow register if no admin exists
    const admins = await pool.request().query("SELECT COUNT(1) AS n FROM Users WHERE role='admin'");
    if (admins.recordset?.[0]?.n > 0) return res.status(403).json({ error: 'Registration disabled (admin exists)' });
    const hash = await bcrypt.hash(password, 10);
    await pool.request()
      .input('name', sql.NVarChar(255), name)
      .input('email', sql.NVarChar(255), email)
      .input('password', sql.NVarChar(255), hash)
      .input('role', sql.NVarChar(50), 'admin')
      .query('INSERT INTO Users (name, email, password, role) VALUES (@name, @email, @password, @role)');
    return res.status(201).json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });
  try {
    const pool = await getPool();
    const userRes = await pool.request().input('email', sql.NVarChar(255), email)
      .query('SELECT TOP 1 id, email FROM Users WHERE email=@email');
    const user = userRes.recordset?.[0];
    if (!user) return res.json({ ok: true }); // Do not reveal
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 mins
    await pool.request()
      .input('userId', sql.Int, user.id)
      .input('token', sql.NVarChar(255), token)
      .input('expiresAt', sql.DateTime2, expiresAt)
      .query(`INSERT INTO PasswordResets (userId, token, expiresAt, used) VALUES (@userId, @token, @expiresAt, 0)`);
    const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
    const link = `${baseUrl}/admin/reset.html?token=${token}`;
    try { await sendPasswordResetEmail(user.email, link); } catch (e) { /* noop */ }
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function resetPassword(req, res) {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
  try {
    const pool = await getPool();
    const row = await pool.request().input('token', sql.NVarChar(255), token)
      .query('SELECT TOP 1 * FROM PasswordResets WHERE token=@token AND used=0 ORDER BY id DESC');
    const pr = row.recordset?.[0];
    if (!pr) return res.status(400).json({ error: 'Invalid token' });
    if (new Date(pr.expiresAt) < new Date()) return res.status(400).json({ error: 'Token expired' });
    const hash = await bcrypt.hash(password, 10);
    await pool.request().input('id', sql.Int, pr.userId).input('pwd', sql.NVarChar(255), hash)
      .query('UPDATE Users SET password=@pwd WHERE id=@id');
    await pool.request().input('rid', sql.Int, pr.id).query('UPDATE PasswordResets SET used=1 WHERE id=@rid');
    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { login, register, forgotPassword, resetPassword };


