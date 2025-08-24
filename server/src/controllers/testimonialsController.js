const { getPool } = require('../db/supabase-pool');

async function getTestimonials(req, res) {
  try {
    const supabase = getPool();
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('id, client_name, feedback, rating')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.json(testimonials || []);
  } catch (err) {
    console.error('Testimonials error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getTestimonials };


