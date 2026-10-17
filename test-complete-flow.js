// Complete Practice Notes Flow Test
const fetch = require('node-fetch');

async function testCompleteFlow() {
  console.log('🔄 COMPLETE PRACTICE NOTES FLOW TEST');
  console.log('====================================\n');

  // Step 1: Test backend saving with exact user ID
  console.log('📝 STEP 1: Testing Backend Saving');
  console.log('──────────────────────────────────');
  
  const exactUserId = 'E6RrBLxUS6N9gsRax01fcTVfGYt2';
  console.log('Using user ID:', exactUserId);
  
  try {
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUid: exactUserId,
        topicId: 'complete-flow-test',
        questionId: 'complete-test-' + Date.now(),
        question: 'What is the process by which plants make their own food?',
        studentAnswer: 'Photosynthesis',
        correctAnswer: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create glucose and oxygen.',
        subject: 'Biology',
        chapter: 'Chapter 2: Plant Biology',
        topic: 'Photosynthesis',
        isRetry: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend save successful!');
      console.log('   Document ID:', data.notebookDocumentId);
      console.log('   Saved to path: smartNotebook/' + exactUserId + '/practicedNotes/' + data.notebookDocumentId);
      console.log('');
      
      // Step 2: Instructions for frontend verification
      console.log('📱 STEP 2: Frontend Verification');
      console.log('─────────────────────────────────');
      console.log('Now do these steps in your browser:');
      console.log('');
      console.log('1. 🌐 Open your app: http://localhost:3000');
      console.log('2. 🔑 Make sure you are signed in');
      console.log('3. 📚 Go to Smart Notebook page');
      console.log('4. 🏷️  Click on "Practiced Notes" tab');
      console.log('5. 🔍 Look for the question: "What is the process by which plants make their own food?"');
      console.log('');
      
      console.log('📊 EXPECTED RESULTS:');
      console.log('──────────────────');
      console.log('✅ You should see the photosynthesis question');
      console.log('✅ It should be under Biology > Chapter 2 > Photosynthesis');
      console.log('✅ Your answer "Photosynthesis" should be visible');
      console.log('');
      
      console.log('🚨 IF YOU DON\'T SEE IT:');
      console.log('───────────────────────');
      console.log('1. Open browser DevTools (F12)');
      console.log('2. Go to Console tab');
      console.log('3. Look for console logs starting with "📚 Loading practiced notes..."');
      console.log('4. Check the user ID in the logs');
      console.log('5. If user ID is different from', exactUserId, 'that\'s the problem!');
      console.log('');
      
      console.log('🔧 DEBUGGING STEPS:');
      console.log('──────────────────');
      console.log('Copy this into your browser console:');
      console.log('');
      console.log('// Check current user ID');
      console.log('console.log("Current user:", firebase.auth().currentUser?.uid);');
      console.log('');
      console.log('// Or if using the auth context:');
      console.log('console.log("Auth state:", JSON.stringify(localStorage));');
      console.log('');
      
      console.log('💡 QUICK FIXES:');
      console.log('──────────────');
      console.log('A) If user ID mismatch: Sign out and sign in again');
      console.log('B) If loading errors: Check Firestore rules are deployed');
      console.log('C) If permission errors: Clear browser cache and cookies');
      console.log('D) If no logs appear: Check if usePracticedNotes hook is running');
      console.log('');
      
      console.log('🎯 SUCCESS CRITERIA:');
      console.log('───────────────────');
      console.log('Practice notes are working if:');
      console.log('✅ Backend saves notes (this test passed)');
      console.log('✅ Frontend loads notes (check notebook page)');
      console.log('✅ User ID matches between backend and frontend');
      console.log('✅ Firestore rules allow access (already confirmed)');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Backend save failed:', errorText);
      console.log('Fix the backend first before testing frontend');
    }
  } catch (error) {
    console.error('💥 Error in backend test:', error.message);
  }
}

console.log('Starting complete flow test...\n');
setTimeout(testCompleteFlow, 1000); 