const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getPool } = require('./src/db/pool');

async function testConnection() {
	try {
		console.log('Testing database connection...');
		console.log('Connection string:', process.env.MSSQL_CONNECTION_STRING ? 'Set' : 'Not set');
		
		// Debug: Log the connection string
		console.log('Full connection string:', process.env.MSSQL_CONNECTION_STRING);
		
		const pool = await getPool();
		console.log('✅ Database connection successful!');
		
		// Test a simple query with a safe alias
		const result = await pool.request().query('SELECT SYSDATETIME() AS [current_time]');
		console.log('✅ Query test successful:', result.recordset[0]);
		
		await pool.close();
		console.log('✅ Connection closed successfully');
		
	} catch (error) {
		console.error('❌ Database connection failed:', error.message);
		console.error('Full error:', error);
	}
}

testConnection();
