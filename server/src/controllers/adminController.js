const { getPool } = require('../db/supabase-pool');

async function listContacts(req, res) {
  try {
    const supabase = getPool();
    const { data: contacts, error } = await supabase
      .from('contact_messages')
      .select('id, name, email, phone, company, service, budget, timeline, enquiry_type, date_submitted')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(contacts || []);
  } catch (err) {
    console.error('Contacts error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function listSubscriptions(req, res) {
  try {
    const supabase = getPool();
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('id, email, date_subscribed')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(subscriptions || []);
  } catch (err) {
    console.error('Subscriptions error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function listPayments(req, res) {
  try {
    const supabase = getPool();
    const { data: payments, error } = await supabase
      .from('payments')
      .select('id, stripe_payment_intent_id, name, email, project_ref, agreed, deposit_amount, currency, status, date_created')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(payments || []);
  } catch (err) {
    console.error('Payments error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { listContacts, listSubscriptions, listPayments };


