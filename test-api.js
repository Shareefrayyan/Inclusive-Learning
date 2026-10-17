// Simple test for Together.ai API
// Run with: node test-api.js

const fetch = require('node-fetch'); // You might need: npm install node-fetch

async function testTogetherAI() {
  const apiKey = '59e0b1e3dd88a706ffd4255b8dab9dd20026e6017b7a317382f79645a701c3ba';
  
  console.log('🧪 Testing Together.ai API...\n');
  console.log('🔑 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
  
  try {
    console.log('📡 Making request to Together.ai...');
    
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello! Can you respond with just "API is working!"?'
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
        stream: false
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Raw Response (first 500 chars):', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('❌ API returned error status');
      
      // Try to understand the error
      if (responseText.includes('<!DOCTYPE')) {
        console.log('🔍 API returned HTML page instead of JSON - this usually means:');
        console.log('   • Invalid API endpoint');
        console.log('   • API key is incorrect/expired');
        console.log('   • Account has no credits');
        console.log('   • Service is down');
      }
      
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    try {
      const data = JSON.parse(responseText);
      const aiResponse = data.choices[0].message.content;
      
      console.log('✅ API Response:', aiResponse);
      console.log('🎉 Together.ai API is working correctly!');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      console.log('📄 Response was:', responseText);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    console.log('\n🔍 Troubleshooting Steps:');
    console.log('1. ✓ Check your .env.local file has TOGETHER_API_KEY (not ETHER_API_KEY!)');
    console.log('2. ✓ Verify API key is exactly: 59e0b1e3dd88a706ffd4255b8dab9dd20026e6017b7a317382f79645a701c3ba');
    console.log('3. ✓ Check internet connection');
    console.log('4. ✓ Visit https://api.together.xyz/ to verify service status');
    console.log('5. ✓ Check Together.ai account has credits at https://api.together.xyz/settings/api-keys');
    
    // Test if we can reach the API at all
    console.log('\n🌐 Testing basic connectivity...');
    try {
      const pingResponse = await fetch('https://api.together.xyz/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      console.log('🌍 Basic connectivity status:', pingResponse.status);
    } catch (connectError) {
      console.log('🌍 Basic connectivity failed:', connectError.message);
    }
  }
}

testTogetherAI(); 