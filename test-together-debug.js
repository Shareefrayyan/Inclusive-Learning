// Quick test to debug Together.ai API
const fetch = require('node-fetch');

async function testTogetherAI() {
  const apiKey = '59e0b1e3dd88a706ffd4255b8dab9dd20026e6017b7a317382f79645a701c3ba';
  
  try {
    console.log('🔍 Testing Together.ai API...');
    
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
            content: 'What is 2+2? Respond in JSON format: {"answer": "your answer"}'
          }
        ],
        max_tokens: 100,
        temperature: 0.1,
        stream: false
      })
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Response:', responseText);

    if (!response.ok) {
      console.error('❌ API Error');
      return;
    }

    const data = JSON.parse(responseText);
    console.log('✅ Parsed JSON:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

testTogetherAI(); 