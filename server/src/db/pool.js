const sql = require('mssql');

let poolPromise;

function buildConfig() {
  return {
    server: process.env.MSSQL_SERVER || '127.0.0.1',
    database: process.env.MSSQL_DATABASE || 'Kodara-HQ',
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD || 'Lam123...',
    port: parseInt(process.env.MSSQL_PORT || '1433', 10),
    options: {
      encrypt: (process.env.MSSQL_ENCRYPT || 'true') === 'true',
      trustServerCertificate: (process.env.MSSQL_TRUST_SERVER_CERTIFICATE || 'true') === 'true'
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };
}

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(buildConfig())
      .connect()
      .then((pool) => {
        // eslint-disable-next-line no-console
        console.log('Connected to MSSQL');
        return pool;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getPool };


