// Test practiced notes integration
const fetch = require('node-fetch');

async function testPracticedNotesIntegration() {
  try {
    console.log('🧪 Testing practiced notes integration...');
    
    const testData = {
      studentUid: 'test-student-123',
      topicId: 'biology-ecosystems',
      questionId: 'ecosystems-q1',
      question: 'What is a food web?',
      studentAnswer: 'A food web is a network of interconnected food chains',
      correctAnswer: 'A food web is a complex network of interconnected food chains showing how energy and nutrients flow through an ecosystem.',
      subject: 'Biology',
      chapter: 'Chapter 3: Ecology',
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Response:', JSON.stringify(data, null, 2));
      
      if (data.notebookDocumentId) {
        console.log('🎉 Practiced note saved to notebook with ID:', data.notebookDocumentId);
      } else {
        console.log('⚠️  No notebook document ID returned');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Wait for server to be ready
setTimeout(() => {
  testPracticedNotesIntegration();
}, 3000); 