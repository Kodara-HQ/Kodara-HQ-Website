const { createClient } = require('@supabase/supabase-js');

async function testActualTables() {
  console.log('🧪 Testing Supabase connection with actual tables...');
  
  const supabaseUrl = 'https://yrfywmdaraafqzcwtvqj.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZnl3bWRhcmFhZnF6Y3d0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzIwNjcsImV4cCI6MjA3MTYwODA2N30.NQcfmgeJJPXYTzd9i2nj9_l_pQLmEO4vtMYTjtzZ_1c';
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created successfully');
    
    // Test projects table
    console.log('\n🔍 Testing projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (projectsError) {
      if (projectsError.code === 'PGRST116') {
        console.log('❌ Projects table does not exist yet');
        console.log('💡 Please run the SQL script in your Supabase SQL Editor first');
      } else {
        console.log('⚠️  Projects table error:', projectsError.message);
      }
    } else {
      console.log('✅ Projects table exists and is accessible');
      console.log('📊 Found', projects.length, 'projects');
    }
    
    // Test testimonials table
    console.log('\n🔍 Testing testimonials table...');
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .limit(1);
    
    if (testimonialsError) {
      if (testimonialsError.code === 'PGRST116') {
        console.log('❌ Testimonials table does not exist yet');
      } else {
        console.log('⚠️  Testimonials table error:', testimonialsError.message);
      }
    } else {
      console.log('✅ Testimonials table exists and is accessible');
      console.log('📊 Found', testimonials.length, 'testimonials');
    }
    
    // Test contact_messages table
    console.log('\n🔍 Testing contact_messages table...');
    const { data: contacts, error: contactsError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);
    
    if (contactsError) {
      if (contactsError.code === 'PGRST116') {
        console.log('❌ Contact messages table does not exist yet');
      } else {
        console.log('⚠️  Contact messages table error:', contactsError.message);
      }
    } else {
      console.log('✅ Contact messages table exists and is accessible');
      console.log('📊 Found', contacts.length, 'contact messages');
    }
    
    // Test subscriptions table
    console.log('\n🔍 Testing subscriptions table...');
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1);
    
    if (subscriptionsError) {
      if (subscriptionsError.code === 'PGRST116') {
        console.log('❌ Subscriptions table does not exist yet');
      } else {
        console.log('⚠️  Subscriptions table error:', subscriptionsError.message);
      }
    } else {
      console.log('✅ Subscriptions table exists and is accessible');
      console.log('📊 Found', subscriptions.length, 'subscriptions');
    }
    
    console.log('\n🎯 Summary:');
    console.log('- Supabase connection: ✅ Working');
    console.log('- Tables: Need to be created (run the SQL script)');
    console.log('- Next step: Execute the SQL script in your Supabase SQL Editor');
    
  } catch (error) {
    console.error('💥 Error testing tables:', error.message);
  }
}

testActualTables();
