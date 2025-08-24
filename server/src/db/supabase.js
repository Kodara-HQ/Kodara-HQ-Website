const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://yrfywmdaraafqzcwtvqj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZnl3bWRhcmFhZnF6Y3d0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzIwNjcsImV4cCI6MjA3MTYwODA2N30.NQcfmgeJJPXYTzd9i2nj9_l_pQLmEO4vtMYTjtzZ_1c';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection function
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('test_connection')
      .select('*')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is fine for testing
      throw error;
    }
    
    console.log('✅ Connected to Supabase successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

// Get Supabase client
function getSupabase() {
  return supabase;
}

module.exports = { supabase, getSupabase, testConnection };
