// Test the verify-answer API endpoint directly
const fetch = require('node-fetch');

async function testVerifyAPI() {
  try {
    console.log('🔍 Testing verify-answer API endpoint...');
    
    const testData = {
      studentUid: 'test-student-123',
      topicId: 'test-topic',
      questionId: 'test-question',
      question: 'What is a food web?',
      studentAnswer: 'food web is what animals eat',
      correctAnswer: 'A food web is a complex network of interconnected food chains showing how energy and nutrients flow through an ecosystem.',
      subject: 'Biology',
      topic: 'Ecosystems',
      isRetry: false
    };
    
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 Response:', responseText);

    if (!response.ok) {
      console.error('❌ API Error - Response is not JSON, likely HTML error page');
      return;
    }

    try {
      const data = JSON.parse(responseText);
      console.log('✅ Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('Raw response was:', responseText.substring(0, 500));
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Wait a bit for the server to start, then test
setTimeout(() => {
  testVerifyAPI();
}, 5000); 