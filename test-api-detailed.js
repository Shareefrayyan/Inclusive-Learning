// Test the verify-answer API endpoint with full error details
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
    
    const responseText = await response.text();
    
    if (response.status === 500 && responseText.includes('__NEXT_DATA__')) {
      // Extract error from Next.js error page
      const match = responseText.match(/"err":\{"name":"Error","source":"server","message":"([^"]+)"/);
      if (match) {
        console.log('❌ Server Error:', match[1]);
      }
      
      // Also try to extract stack trace
      const stackMatch = responseText.match(/"stack":"([^"]+)"/);
      if (stackMatch) {
        console.log('📍 Stack Trace:', stackMatch[1].replace(/\\n/g, '\n').substring(0, 500));
      }
    } else {
      console.log('📄 Full Response:', responseText.substring(0, 1000));
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Wait a bit for the server to start, then test
setTimeout(() => {
  testVerifyAPI();
}, 3000); 