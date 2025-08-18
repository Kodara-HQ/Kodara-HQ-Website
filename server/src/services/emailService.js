const nodemailer = require('nodemailer');

function createTransport() {
  if (process.env.NODE_ENV === 'test') {
    return nodemailer.createTransport({ jsonTransport: true });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: (process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendContactNotification({ name, email, message, phone, company, service, budget, timeline, enquiryType, attachmentPath }) {
  const transporter = createTransport();
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;

  const mail = {
    from,
    to,
    subject: `New ${enquiryType || 'contact'} from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nCompany: ${company || ''}\nService: ${service || ''}\nBudget: ${budget || ''}\nTimeline: ${timeline || ''}\n\nMessage:\n${message}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${enquiryType ? `<p><strong>Enquiry Type:</strong> ${enquiryType}</p>` : ''}
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
      ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
      ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `,
    attachments: attachmentPath ? [{ path: attachmentPath }] : []
  };
  await transporter.sendMail(mail);
}

async function sendContactAutoReply({ name, toEmail }) {
  const enabled = (process.env.CONTACT_AUTOREPLY_ENABLED || 'true') === 'true';
  if (!enabled) return;
  const transporter = createTransport();
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  const subject = process.env.CONTACT_AUTOREPLY_SUBJECT || 'Thanks for contacting Kodara-HQ';
  const html = `
    <p>Hi ${name || 'there'},</p>
    <p>Thanks for reaching out to Kodara-HQ. Your message has been received and our team will get back to you shortly.</p>
    <p>If this is urgent, reply to this email and we will prioritize it.</p>
    <p>— Kodara-HQ Team</p>
  `;
  await transporter.sendMail({ from, to: toEmail, subject, html, text: html.replace(/<[^>]+>/g, '') });
}

async function sendPasswordResetEmail(toEmail, link) {
  const transporter = await getTransporter();
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${link}`,
    html: `<p>Click the link to reset your password:</p><p><a href="${link}">${link}</a></p>`
  };
  await transporter.sendMail(mailOptions);
}

async function verifySmtp() {
  try {
    const transporter = createTransport();
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}

async function sendTestEmail(to) {
  const transporter = createTransport();
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
  const subject = 'Kodara-HQ test email';
  const text = 'This is a test email from Kodara-HQ SMTP health check.';
  await transporter.sendMail({ from, to, subject, text });
}

module.exports = { sendContactNotification, sendContactAutoReply, verifySmtp, sendTestEmail, sendPasswordResetEmail };


