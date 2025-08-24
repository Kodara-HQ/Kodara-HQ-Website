const http = require('http');

async function testSubscriptionEndpoint() {
  console.log('🧪 Testing subscription endpoint with Node.js http module...');
  
  const postData = JSON.stringify({
    email: 'test@example.com'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/subscribe',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Subscription endpoint working!');
          console.log('📊 Status Code:', res.statusCode);
          console.log('📧 Response:', result);
          resolve(result);
        } catch (error) {
          console.log('⚠️  Response parsing error:', error.message);
          console.log('📧 Raw response:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test the endpoint
testSubscriptionEndpoint()
  .then(() => {
    console.log('\n🎯 Test completed!');
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error.message);
  });
