const { getPool, sql } = require('../db/pool');
const { sendContactNotification, sendContactAutoReply } = require('../services/emailService');

async function handleContact(req, res) {
  try {
    const { name, email, message, phone, company, service, budget, timeline, enquiryType } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const pool = await getPool();
    const request = pool.request();
    request.input('name', sql.NVarChar(255), name);
    request.input('email', sql.NVarChar(255), email);
    request.input('message', sql.NVarChar(sql.MAX), message);
    request.input('phone', sql.NVarChar(100), phone || null);
    request.input('company', sql.NVarChar(255), company || null);
    const subjectVal = null; // Subject removed; keep column compatibility with NULL
    request.input('subject', sql.NVarChar(255), subjectVal);
    request.input('service', sql.NVarChar(100), service || null);
    request.input('budget', sql.NVarChar(50), budget || null);
    request.input('timeline', sql.NVarChar(50), timeline || null);

    const attachmentPath = req.file ? req.file.path : null;
    request.input('attachment', sql.NVarChar(1024), attachmentPath);
    request.input('enquiryType', sql.NVarChar(50), enquiryType || null);
    await request.query(`
      INSERT INTO ContactMessages (name, email, message, dateSubmitted, phone, company, subject, service, budget, timeline, attachment, enquiryType)
      VALUES (@name, @email, @message, SYSDATETIMEOFFSET(), @phone, @company, @subject, @service, @budget, @timeline, @attachment, @enquiryType)
    `);

    try {
      await Promise.all([
        sendContactNotification({ name, email, message, phone, company, service, budget, timeline, enquiryType, attachmentPath }),
        sendContactAutoReply({ name, toEmail: email })
      ]);
    } catch (emailErr) {
      // eslint-disable-next-line no-console
      console.error('Email handling error:', emailErr);
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { handleContact };


