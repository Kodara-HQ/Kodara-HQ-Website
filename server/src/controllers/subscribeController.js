const { getPool } = require('../db/supabase-pool');
const { sendNewsletterWelcomeEmail } = require('../services/emailService');

async function handleSubscribe(req, res) {
  try {
    const { email, name } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const supabase = getPool();
    
    // Check if email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscription:', checkError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // If email doesn't exist, insert new subscription
    if (!existingSubscription) {
      const { data: newSubscription, error: insertError } = await supabase
        .from('subscriptions')
        .insert([
          { 
            email: email,
            date_subscribed: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) {
        console.error('Error inserting subscription:', insertError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('New subscription created:', newSubscription);
      
      // Send welcome email
      try {
        await sendNewsletterWelcomeEmail({ email, name: name || 'Subscriber' });
      } catch (emailErr) {
        console.error('Newsletter welcome email error:', emailErr);
        // Don't fail the subscription if email fails
      }
    } else {
      console.log('Email already subscribed:', email);
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function testNewsletterAutoReply(req, res) {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required for testing.' });
    }
    
    console.log('🧪 Testing newsletter auto-reply system...');
    
    await sendNewsletterWelcomeEmail({ 
      email: email, 
      name: name || 'Test Subscriber'
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Newsletter welcome email sent successfully!',
      sentTo: email
    });
  } catch (err) {
    console.error('Newsletter auto-reply test error:', err);
    return res.status(500).json({ error: 'Failed to send test newsletter welcome email' });
  }
}

module.exports = { handleSubscribe, testNewsletterAutoReply };


