// Test if practiced notes are accessible from frontend after rules update
const fetch = require('node-fetch');

async function testNotebookAccess() {
  console.log('🔍 Testing practiced notes access...');
  
  try {
    // First, add a practiced note
    console.log('\n📝 Step 1: Adding a practiced note...');
    const addResponse = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentUid: 'test-student-notebook-123',
        topicId: 'test-topic',
        questionId: 'test-question-notebook',
        question: 'What is the capital of India?',
        studentAnswer: 'New Delhi',
        correctAnswer: 'New Delhi is the capital of India',
        subject: 'Geography',
        chapter: 'Chapter 1: Countries and Capitals',
        topic: 'Indian Geography',
        isRetry: false
      })
    });

    if (addResponse.ok) {
      const addData = await addResponse.json();
      console.log('✅ Note added successfully!');
      console.log('   Notebook Document ID:', addData.notebookDocumentId);
      
      // Wait a bit for the data to be written
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('\n📚 Step 2: The frontend should now be able to read this note...');
      console.log('📋 Instructions to check:');
      console.log('   1. Update Firestore security rules in Firebase Console');
      console.log('   2. Go to: https://console.firebase.google.com/project/schoolapp-6e973/firestore/rules');
      console.log('   3. Add this rule:');
      console.log('      match /smartNotebook/{userId}/{document=**} {');
      console.log('        allow read, write: if request.auth != null && request.auth.uid == userId;');
      console.log('      }');
      console.log('   4. Click "Publish"');
      console.log('   5. Go to: http://localhost:3000/dashboard/student/notebook');
      console.log('   6. Click on "Practiced Notes" tab');
      console.log('   7. You should see the note with question: "What is the capital of India?"');
      console.log('\n🔧 Current Status: Practiced note saved but security rules need update');
      
    } else {
      const errorText = await addResponse.text();
      console.log('❌ Error adding note:', errorText);
    }

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Start the test
console.log('🧪 Starting notebook access test...');
console.log('📍 Make sure your Next.js server is running on http://localhost:3000');
console.log('⏳ Waiting 3 seconds for server...\n');

setTimeout(() => {
  testNotebookAccess();
}, 3000); 