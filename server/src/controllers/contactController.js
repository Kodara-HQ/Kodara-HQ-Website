const { getPool } = require('../db/supabase-pool');
const { sendContactNotification, sendContactAutoReply } = require('../services/emailService');

async function handleContact(req, res) {
  try {
    const { name, email, message, phone, company, service, budget, timeline, enquiryType } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const supabase = getPool();
    
    const attachmentPath = req.file ? req.file.path : null;
    
    const { data: newContact, error: insertError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: name,
          email: email,
          message: message,
          phone: phone || null,
          company: company || null,
          subject: null, // Subject removed; keep column compatibility with NULL
          service: service || null,
          budget: budget || null,
          timeline: timeline || null,
          attachment: attachmentPath,
          enquiry_type: enquiryType || null,
          date_submitted: new Date().toISOString()
        }
      ])
      .select();

    if (insertError) {
      console.error('Error inserting contact message:', insertError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('New contact message created:', newContact);

    try {
      await Promise.all([
        sendContactNotification({ name, email, message, phone, company, service, budget, timeline, enquiryType, attachmentPath }),
        sendContactAutoReply({ name, toEmail: email, enquiryType, service, company })
      ]);
    } catch (emailErr) {
      console.error('Email handling error:', emailErr);
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function testAutoReply(req, res) {
  try {
    const { email, name, enquiryType, service, company } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required for testing.' });
    }
    
    console.log('🧪 Testing auto-reply system...');
    
    await sendContactAutoReply({ 
      name: name || 'Test User', 
      toEmail: email, 
      enquiryType: enquiryType || 'general', 
      service: service || 'Web Development', 
      company: company || 'Test Company' 
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Auto-reply test email sent successfully!',
      sentTo: email
    });
  } catch (err) {
    console.error('Auto-reply test error:', err);
    return res.status(500).json({ error: 'Failed to send test auto-reply' });
  }
}

module.exports = { handleContact, testAutoReply };


