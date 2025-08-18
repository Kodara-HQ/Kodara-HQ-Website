const { Pool } = require('pg');

let pool;

function buildConfig() {
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'kodara_hq',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
}

function getPool() {
  if (!pool) {
    pool = new Pool(buildConfig());
    
    pool.on('connect', () => {
      console.log('Connected to PostgreSQL');
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
}

module.exports = { getPool };


