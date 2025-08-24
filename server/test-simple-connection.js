const https = require('https');
const { URL } = require('url');

async function testBasicConnectivity() {
  const supabaseUrl = 'https://yrfywmdaraafqzcwtvqj.supabase.co';
  
  console.log('🧪 Testing basic connectivity to Supabase...');
  console.log('🔗 URL:', supabaseUrl);
  
  try {
    // Test basic HTTPS connectivity
    const url = new URL(supabaseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/',
      method: 'GET',
      timeout: 10000
    };
    
    const request = https.request(options, (response) => {
      console.log('✅ HTTPS connection successful!');
      console.log('📊 Status:', response.statusCode);
      console.log('🔒 Headers:', response.headers);
    });
    
    request.on('error', (error) => {
      console.error('❌ HTTPS connection failed:', error.message);
    });
    
    request.on('timeout', () => {
      console.error('⏰ Connection timed out');
      request.destroy();
    });
    
    request.end();
    
  } catch (error) {
    console.error('💥 Error testing connectivity:', error.message);
  }
}

async function testSupabaseClient() {
  console.log('\n🧪 Testing Supabase client creation...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = 'https://yrfywmdaraafqzcwtvqj.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZnl3bWRhcmFhZnF6Y3d0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzIwNjcsImV4cCI6MjA3MTYwODA2N30.NQcfmgeJJPXYTzd9i2nj9_l_pQLmEO4vtMYTjtzZ_1c';
    
    console.log('🔑 Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('✅ Supabase client created successfully');
    console.log('🔗 Client URL:', supabase.supabaseUrl);
    
    // Try a simple query
    console.log('🔍 Testing simple query...');
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('✅ Connection successful! Table "projects" does not exist yet (this is expected)');
      } else {
        console.log('⚠️  Query error (but connection works):', error.message);
      }
    } else {
      console.log('✅ Query successful! Data:', data);
    }
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error.message);
    
    if (error.message.includes('fetch failed')) {
      console.log('\n🔍 Debug Info:');
      console.log('- This appears to be a network connectivity issue');
      console.log('- Possible causes:');
      console.log('  • Firewall blocking the connection');
      console.log('  • Network proxy settings');
      console.log('  • Supabase project might be paused or deleted');
      console.log('  • DNS resolution issues');
    }
  }
}

// Run tests
async function runTests() {
  await testBasicConnectivity();
  
  // Wait a bit for the HTTPS test to complete
  setTimeout(async () => {
    await testSupabaseClient();
  }, 2000);
}

runTests();
