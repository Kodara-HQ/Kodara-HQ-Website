const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { getPool } = require('./pool');

async function main() {
  const pool = await getPool();
  
  // Clear data and reset sequences in PostgreSQL
  await pool.query(`
    TRUNCATE TABLE Projects, Testimonials RESTART IDENTITY CASCADE;
  `);
  
  // eslint-disable-next-line no-console
  console.log('Projects and Testimonials cleared.');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to reset data:', err);
  process.exit(1);
});


