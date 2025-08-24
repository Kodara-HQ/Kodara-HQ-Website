const { getSupabase, testConnection } = require('./supabase');

let supabaseClient;

function getPool() {
  if (!supabaseClient) {
    supabaseClient = getSupabase();
  }
  return supabaseClient;
}

// Test connection function
async function testDatabaseConnection() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      console.log('✅ Supabase connection pool ready');
      return true;
    } else {
      console.error('❌ Supabase connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Supabase connection:', error);
    return false;
  }
}

// Initialize database connection
async function initializeDatabase() {
  try {
    const isConnected = await testDatabaseConnection();
    if (isConnected) {
      console.log('🚀 Supabase database initialized successfully');
      return true;
    } else {
      console.error('💥 Failed to initialize Supabase database');
      return false;
    }
  } catch (error) {
    console.error('💥 Error initializing database:', error);
    return false;
  }
}

module.exports = { 
  getPool, 
  testDatabaseConnection, 
  initializeDatabase,
  // For backward compatibility, export sql as null since we're not using MSSQL
  sql: null 
};
