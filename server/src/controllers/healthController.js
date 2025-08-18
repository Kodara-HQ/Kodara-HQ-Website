const { verifySmtp, sendTestEmail } = require('../services/emailService');

async function checkEmailHealth(req, res) {
  const result = await verifySmtp();
  if (result.ok) return res.json({ ok: true });
  return res.status(500).json({ ok: false, error: result.error });
}

async function sendTestEmailHandler(req, res) {
  try {
    const to = req.body?.to || process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
    if (!to) return res.status(400).json({ error: 'No recipient provided' });
    await sendTestEmail(to);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
}

module.exports = { checkEmailHealth, sendTestEmail: sendTestEmailHandler };


