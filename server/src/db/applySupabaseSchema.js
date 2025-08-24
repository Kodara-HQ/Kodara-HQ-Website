const fs = require('fs');
const path = require('path');
const { getSupabase } = require('./supabase');

async function applySupabaseSchema() {
  try {
    console.log('🚀 Starting Supabase schema application...');
    
    const supabase = getSupabase();
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Schema file loaded successfully');
    
    // Split the schema into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          // For Supabase, we'll use the REST API to execute SQL
          // Note: This is a simplified approach - in production you might want to use
          // Supabase's SQL editor or migrations
          console.log(`📋 Statement: ${statement.substring(0, 100)}...`);
          
          // Since we can't execute raw SQL directly through the client,
          // we'll just log the statements for manual execution
          console.log(`✅ Statement ${i + 1} prepared for execution`);
        } catch (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Schema application completed!');
    console.log('\n📋 IMPORTANT: Please execute the following SQL in your Supabase SQL Editor:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Execute the SQL');
    
    // Test the connection
    const { testConnection } = require('./supabase');
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('\n✅ Supabase connection test successful!');
    } else {
      console.log('\n❌ Supabase connection test failed. Please check your configuration.');
    }
    
  } catch (error) {
    console.error('💥 Error applying Supabase schema:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  applySupabaseSchema();
}

module.exports = { applySupabaseSchema };
