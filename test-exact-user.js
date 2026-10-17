// Test with the EXACT user ID from Firebase Console
const fetch = require('node-fetch');

async function testExactUser() {
  console.log('🎯 TESTING WITH EXACT USER ID FROM FIREBASE CONSOLE');
  console.log('==============================================\n');

  // This is the exact user ID from your Firebase Console
  const exactUserId = 'E6RrBLxUS6N9gsRax01fcTVfGYt2';
  
  console.log('📋 WHAT WE KNOW:');
  console.log('✅ Your real user ID:', exactUserId);
  console.log('✅ Practiced notes exist in Firebase under this user ID');
  console.log('✅ Document ZBmdDldsa9jwSoXmEDPh exists with decomposer question');
  console.log('❌ Frontend showing permission errors');
  console.log('');

  console.log('🧪 TESTING: Add another note with your exact user ID');
  
  try {
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUid: exactUserId,  // Using YOUR exact user ID
        topicId: 'biology-cells',
        questionId: 'exact-user-test-' + Date.now(),
        question: 'What is the powerhouse of the cell?',
        studentAnswer: 'Mitochondria',
        correctAnswer: 'The mitochondria is the powerhouse of the cell, producing ATP through cellular respiration.',
        subject: 'Biology',
        chapter: 'Chapter 1: Cell Biology',
        topic: 'Cell Organelles',
        isRetry: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Added another note to your user ID');
      console.log(`   User ID: ${exactUserId}`);
      console.log(`   New Document ID: ${data.notebookDocumentId}`);
      console.log('');
      
      console.log('🔍 NOW CHECK:');
      console.log('1. Go back to Firebase Console');
      console.log(`2. Navigate to: smartNotebook/${exactUserId}/practicedNotes/`);
      console.log('3. You should see a NEW document with the mitochondria question');
      console.log('4. This proves the backend is working with your user ID');
      console.log('');
      
      console.log('🚨 FRONTEND DEBUGGING NEEDED:');
      console.log('Since the backend saves to your correct user ID, but frontend');
      console.log('shows permission errors, the issue is:');
      console.log('');
      console.log('A) Frontend is using a different user ID than:', exactUserId);
      console.log('B) Frontend authentication state is broken');
      console.log('C) Browser session/cookies are mismatched');
      console.log('');
      
      console.log('💡 IMMEDIATE ACTION:');
      console.log('1. In your browser console, run the user ID check I provided');
      console.log('2. Compare the frontend user ID with:', exactUserId);
      console.log('3. If they don\'t match, we need to fix authentication');
      console.log('4. If they do match, we need to check auth tokens');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to save note:', errorText);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

console.log('Testing with your exact user ID from Firebase Console...\n');
setTimeout(testExactUser, 1000); 