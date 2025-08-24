const { getPool } = require('../db/supabase-pool');

async function handleSubscribe(req, res) {
  try {
    const { email } = req.body || {};
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
    } else {
      console.log('Email already subscribed:', email);
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { handleSubscribe };


