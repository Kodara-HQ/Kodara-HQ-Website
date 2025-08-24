const { createClient } = require('@supabase/supabase-js');

async function testSubscriptionEndpoint() {
  console.log('🧪 Testing subscription endpoint...');
  
  try {
    // Test the subscription endpoint directly
    const response = await fetch('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Subscription endpoint working!');
      console.log('📧 Response:', result);
    } else {
      console.log('❌ Subscription endpoint failed');
      console.log('📧 Error:', result);
    }
    
  } catch (error) {
    console.error('💥 Error testing endpoint:', error.message);
    console.log('💡 Make sure your application is running on port 3000');
  }
}

// Wait a bit for the server to start
setTimeout(testSubscriptionEndpoint, 3000);
