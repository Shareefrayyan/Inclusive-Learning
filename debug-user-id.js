// Debug user ID matching between saved documents and frontend
const fetch = require('node-fetch');

async function debugUserID() {
  console.log('🔍 USER ID DEBUG CHECK');
  console.log('=====================\n');

  console.log('📋 Your logs show practiced notes saved for these user IDs:');
  console.log('- Actual user sessions (from logs)');
  console.log('- test-student-123 (from our tests)');
  console.log('- debug-test-123 (from debug tests)');
  console.log('- test-rules-check-123 (from rules test)');
  console.log('');

  console.log('🚨 CRITICAL CHECK NEEDED:');
  console.log('─────────────────────────');
  console.log('The practiced notes might be saved under a different user ID');
  console.log('than the one you\'re logged in with in the frontend!');
  console.log('');

  console.log('🔧 HOW TO CHECK:');
  console.log('1. Go to Firebase Console → Firestore → Data');
  console.log('2. Navigate to: smartNotebook collection');
  console.log('3. You should see user ID folders like:');
  console.log('   - test-student-123');
  console.log('   - [your-actual-user-id]');
  console.log('   - debug-test-123');
  console.log('   - etc.');
  console.log('');
  console.log('4. Click on each user folder → practicedNotes');
  console.log('5. Check which folders have the documents with IDs:');
  console.log('   - wLpIC8Y3De6ZhbIMT0Mi');
  console.log('   - ZBmdDldsa9jwSoXmEDPh');
  console.log('   - NVKTMdmIKnInvwugH113');
  console.log('');

  console.log('🎯 TO FIND YOUR REAL USER ID:');
  console.log('─────────────────────────────');
  console.log('1. In your app, open browser DevTools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Type: console.log("User ID:", firebase.auth().currentUser?.uid)');
  console.log('4. Or check the Application tab → Local Storage → look for user data');
  console.log('');

  console.log('🔥 QUICK TEST - Add a note with your real user ID:');
  console.log('──────────────────────────────────────────────');
  console.log('1. Go to your study page');
  console.log('2. Answer any question');
  console.log('3. Check terminal logs for: "Practiced note saved with ID: [ID]"');
  console.log('4. Go to notebook page and refresh');
  console.log('5. The note should appear if user IDs match');
  console.log('');

  console.log('🚀 MOST LIKELY SOLUTIONS:');
  console.log('─────────────────────────');
  console.log('A) User ID mismatch - documents saved under different user ID');
  console.log('B) Rules not deployed - need to publish in Firebase Console');
  console.log('C) Caching issue - try hard refresh (Ctrl+Shift+R)');
  console.log('D) Authentication issue - make sure you\'re logged in');
  console.log('');

  // Test the API with a real user session
  console.log('📡 Testing API with fresh data...');
  try {
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUid: 'CURRENT-USER-TEST',
        topicId: 'debug-topic-real',
        questionId: 'debug-question-real',
        question: 'Real user test question',
        studentAnswer: 'Real test answer',
        correctAnswer: 'Real test correct answer',
        subject: 'Debug Subject',
        chapter: 'Debug Chapter',
        topic: 'Debug Topic'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Test: Success');
      console.log(`   New notebook ID: ${data.notebookDocumentId}`);
      console.log('   This should appear in Firestore under user: CURRENT-USER-TEST');
    } else {
      console.log('❌ API Test: Failed');
    }
  } catch (error) {
    console.log('❌ API Error:', error.message);
  }

  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Check Firestore Console for user ID folders');
  console.log('2. Verify your logged-in user ID matches the folder with data');
  console.log('3. If mismatch, we need to fix the user authentication');
  console.log('4. If match, the issue is with rules deployment');
}

setTimeout(debugUserID, 1000); 