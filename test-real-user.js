// Test with a realistic user ID to match frontend
const fetch = require('node-fetch');

async function testWithRealUser() {
  console.log('🔍 TESTING WITH REAL USER ID');
  console.log('============================\n');

  console.log('📋 CURRENT STATUS:');
  console.log('✅ Rules deployed: Working (you see "Loaded 1 practiced notes")');
  console.log('❌ User ID mismatch: Most notes saved under test user IDs');
  console.log('');

  console.log('🎯 SOLUTION: Save a note with a realistic user ID');
  console.log('This user ID should match what your frontend auth system uses');
  console.log('');

  // Use a more realistic user ID format
  const realisticUserId = 'student_' + Date.now(); // e.g., student_1749123456789
  
  console.log(`📝 Testing with realistic user ID: ${realisticUserId}`);
  console.log('');

  try {
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUid: realisticUserId,
        topicId: 'biology-ecosystems',
        questionId: 'test-real-user-question',
        question: 'What is photosynthesis?',
        studentAnswer: 'The process by which plants make food using sunlight',
        correctAnswer: 'Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.',
        subject: 'Biology',
        chapter: 'Chapter 1: Plant Biology',
        topic: 'Photosynthesis',
        isRetry: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Note saved with realistic user ID');
      console.log(`   User ID: ${realisticUserId}`);
      console.log(`   Notebook Document ID: ${data.notebookDocumentId}`);
      console.log('');
      
      console.log('🔍 NOW CHECK FIREBASE CONSOLE:');
      console.log('1. Go to: https://console.firebase.google.com/project/schoolapp-6e973/firestore/data');
      console.log('2. Navigate to: smartNotebook collection');
      console.log(`3. Look for folder: ${realisticUserId}`);
      console.log('4. Inside should be: practicedNotes → document with your question');
      console.log('');
      
      console.log('🎯 TO GET YOUR ACTUAL USER ID:');
      console.log('1. In your app, open browser DevTools (F12)');
      console.log('2. Go to Console tab');
      console.log('3. Type this and press Enter:');
      console.log('   localStorage.getItem("user") || "Not found"');
      console.log('4. Or check Network tab when loading notebook page');
      console.log('5. Look for Firestore requests to see what user ID is being used');
      console.log('');
      
      console.log('🚀 QUICK TEST:');
      console.log('If you can log in as a user and get their actual user ID,');
      console.log('run this script again but replace the studentUid with your real user ID.');
      console.log('Then those notes should appear in your notebook immediately!');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to save note:', errorText);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

console.log('Starting real user ID test...\n');
setTimeout(testWithRealUser, 1000); 