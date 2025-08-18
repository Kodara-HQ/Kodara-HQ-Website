const sql = require('mssql');

let poolPromise;

function parseConnectionString(connectionString) {
  const config = {};
  const pairs = connectionString.split(';');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      const cleanKey = key.trim();
      const cleanValue = value.trim();
      
      switch (cleanKey.toLowerCase()) {
        case 'server':
          // Handle both tcp:server,port and server,port formats
          const serverPart = cleanValue.replace('tcp:', '');
          const [serverName, port] = serverPart.split(',');
          config.server = serverName;
          if (port) {
            config.port = parseInt(port, 10);
          }
          break;
        case 'initial catalog':
        case 'database':
          config.database = cleanValue;
          break;
        case 'user id':
          config.user = cleanValue;
          break;
        case 'password':
          config.password = cleanValue;
          break;
        case 'authentication':
          config.authentication = cleanValue.replace(/"/g, '');
          break;
        case 'encrypt':
          config.options = config.options || {};
          config.options.encrypt = cleanValue.toLowerCase() === 'true';
          break;
        case 'trustservercertificate':
          config.options = config.options || {};
          config.options.trustServerCertificate = cleanValue.toLowerCase() === 'true';
          break;
        case 'connection timeout':
          config.options = config.options || {};
          config.options.connectionTimeout = parseInt(cleanValue) * 1000;
          break;
        case 'multipleactiveresultsets':
          config.options = config.options || {};
          config.options.multipleActiveResultSets = cleanValue.toLowerCase() === 'true';
          break;
      }
    }
  });
  
  return config;
}

function buildConfig() {
  // Check if we have a full connection string
  if (process.env.MSSQL_CONNECTION_STRING) {
    const parsedConfig = parseConnectionString(process.env.MSSQL_CONNECTION_STRING);
    
    console.log('Parsed connection config:', JSON.stringify(parsedConfig, null, 2));
    
    const finalConfig = {
      ...parsedConfig,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000,
        multipleActiveResultSets: false,
        ...parsedConfig.options
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
      }
    };
    
    // Handle Azure AD authentication
    if (parsedConfig.authentication && parsedConfig.authentication.toLowerCase().includes('active directory')) {
      // For Azure AD authentication, we don't need user/password
      delete finalConfig.user;
      delete finalConfig.password;
      
      // Set Azure AD specific options
      finalConfig.options.azure = {
        domain: 'microsoft.com' // This will be overridden by the authentication method
      };
      
      // Use the authentication method from the connection string
      if (parsedConfig.authentication.toLowerCase().includes('default')) {
        finalConfig.options.azure.authentication = 'Default';
      }
    }
    
    console.log('Final connection config:', JSON.stringify(finalConfig, null, 2));
    
    return finalConfig;
  }

  // Fallback to individual environment variables
  return {
    server: process.env.MSSQL_SERVER || '127.0.0.1',
    database: process.env.MSSQL_DATABASE || 'Kodara-HQ',
    user: process.env.MSSQL_USER || 'sa',
    password: process.env.MSSQL_PASSWORD || 'Lam123...',
    port: parseInt(process.env.MSSQL_PORT || '1433', 10),
    options: {
      encrypt: (process.env.MSSQL_ENCRYPT || 'true') === 'true',
      trustServerCertificate: (process.env.MSSQL_TRUST_SERVER_CERTIFICATE || 'true') === 'true',
      multipleActiveResultSets: (process.env.MSSQL_MULTIPLE_ACTIVE_RESULT_SETS || 'false') === 'true'
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


