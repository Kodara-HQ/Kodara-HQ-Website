const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { getPool } = require('./pool');

async function main() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const sqlText = fs.readFileSync(schemaPath, 'utf8');
  const pool = await getPool();
  await pool.request().batch(sqlText);
  // eslint-disable-next-line no-console
  console.log('Database schema applied.');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to apply schema:', err);
  process.exit(1);
});


