// Load environment variables from the config file
const path = require('path');
const fs = require('fs');

// Read the config file manually since .env is blocked
const configPath = path.join(__dirname, 'config.supabase.env.example');
const configContent = fs.readFileSync(configPath, 'utf8');

// Parse the config file
const envVars = {};
configContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    const value = valueParts.join('=').trim();
    if (value && !key.startsWith('#')) {
      envVars[key.trim()] = value;
    }
  }
});

// Set environment variables
Object.keys(envVars).forEach(key => {
  process.env[key] = envVars[key];
});

// Ensure fetch is available (Node.js 18+ has it built-in)
if (!global.fetch) {
  console.log('⚠️  Fetch not available globally, this might cause issues with Supabase client');
}

const { testConnection } = require('./src/db/supabase');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  console.log('🔗 URL:', process.env.SUPABASE_URL || 'https://yrfywmdaraafqzcwtvqj.supabase.co');
  console.log('🔑 Key:', process.env.SUPABASE_ANON_KEY ? '***' + process.env.SUPABASE_ANON_KEY.slice(-4) : 'Not set');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('\n✅ SUCCESS: Supabase connection working!');
      console.log('🚀 You can now use Supabase instead of MSSQL');
    } else {
      console.log('\n❌ FAILED: Supabase connection failed');
      console.log('💡 Please check your configuration and try again');
    }
  } catch (error) {
    console.error('\n💥 ERROR:', error.message);
    console.log('💡 Make sure you have the correct Supabase URL and API key');
    
    // Additional debugging info
    if (error.message.includes('fetch failed')) {
      console.log('\n🔍 Debug Info:');
      console.log('- This might be a network connectivity issue');
      console.log('- Check if you can access the Supabase URL in your browser');
      console.log('- Verify your firewall/network settings');
    }
  }
}

testSupabaseConnection();
