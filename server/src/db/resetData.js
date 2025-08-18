const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { getPool } = require('./pool');

async function main() {
  const pool = await getPool();
  await pool.request().batch(`
    DELETE FROM dbo.Projects;
    IF EXISTS (SELECT 1 FROM sys.identity_columns WHERE OBJECT_NAME(object_id) = 'Projects')
      DBCC CHECKIDENT ('dbo.Projects', RESEED, 0);

    DELETE FROM dbo.Testimonials;
    IF EXISTS (SELECT 1 FROM sys.identity_columns WHERE OBJECT_NAME(object_id) = 'Testimonials')
      DBCC CHECKIDENT ('dbo.Testimonials', RESEED, 0);
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


