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

async function sendContactAutoReply({ name, toEmail, enquiryType, service, company }) {
  const enabled = (process.env.CONTACT_AUTOREPLY_ENABLED || 'true') === 'true';
  if (!enabled) return;
  
  try {
    const transporter = createTransport();
    const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;
    const subject = process.env.CONTACT_AUTOREPLY_SUBJECT || 'Thank you for contacting Kodara-HQ';
    
    // Customize message based on enquiry type
    let personalizedMessage = process.env.AUTOREPLY_WELCOME_MESSAGE || 
      'Thank you for reaching out to Kodara-HQ. Your message has been received and our team will get back to you within 24 hours.';
    
    if (enquiryType === 'urgent') {
      personalizedMessage = 'Thank you for your urgent enquiry. We have prioritized your request and will respond as soon as possible.';
    } else if (service) {
      personalizedMessage = `Thank you for your interest in our ${service} services. Our team will review your requirements and get back to you within 24 hours.`;
    }
    
    const urgentNote = process.env.AUTOREPLY_URGENT_NOTE || 
      'If this is urgent, please reply to this email and we will prioritize your request.';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Kodara-HQ</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Innovating the Future with Code</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <h2 style="color: #333; margin-top: 0;">Hi ${name || 'there'},</h2>
          
          <p style="color: #555; line-height: 1.6;">${personalizedMessage}</p>
          
          ${company ? `<p style="color: #555; line-height: 1.6;"><strong>Company:</strong> ${company}</p>` : ''}
          ${enquiryType ? `<p style="color: #555; line-height: 1.6;"><strong>Enquiry Type:</strong> ${enquiryType}</p>` : ''}
          ${service ? `<p style="color: #555; line-height: 1.6;"><strong>Service Interest:</strong> ${service}</p>` : ''}
          
          <p style="color: #555; line-height: 1.6;">${urgentNote}</p>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1976d2; font-weight: 500;">
              <strong>What happens next?</strong><br>
              • We'll review your requirements within 24 hours<br>
              • Our team will contact you with a detailed proposal<br>
              • We'll schedule a consultation to discuss your project
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            Best regards,<br>
            <strong>The Kodara-HQ Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; background: #f1f3f4; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This is an automated response. Please do not reply to this email.<br>
            For urgent matters, contact us directly at admin@kodara-hq.org
          </p>
        </div>
      </div>
    `;
    
    const text = `
Hi ${name || 'there'},

${personalizedMessage}

${company ? `Company: ${company}` : ''}
${enquiryType ? `Enquiry Type: ${enquiryType}` : ''}
${service ? `Service Interest: ${service}` : ''}

${urgentNote}

What happens next?
• We'll review your requirements within 24 hours
• Our team will contact you with a detailed proposal
• We'll schedule a consultation to discuss your project

Best regards,
The Kodara-HQ Team

---
This is an automated response. For urgent matters, contact us at admin@kodara-hq.org
    `;
    
    await transporter.sendMail({ 
      from, 
      to: toEmail, 
      subject, 
      html, 
      text: text.trim() 
    });
    
    console.log(`✅ Auto-reply sent to ${toEmail} for ${name}`);
  } catch (error) {
    console.error(`❌ Failed to send auto-reply to ${toEmail}:`, error);
    // Don't throw error - auto-reply failure shouldn't break the main contact submission
  }
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


