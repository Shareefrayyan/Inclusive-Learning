// Check if Firestore rules are properly configured
const fetch = require('node-fetch');

async function checkFirestoreRules() {
  console.log('🔍 CHECKING FIRESTORE RULES DEBUG');
  console.log('=====================================\n');

  console.log('📋 STEP 1: Current Status Check');
  console.log('Your logs show these practiced notes were saved:');
  console.log('✅ wLpIC8Y3De6ZhbIMT0Mi');
  console.log('✅ ZBmdDldsa9jwSoXmEDPh'); 
  console.log('✅ NVKTMdmIKnInvwugH113');
  console.log('✅ And several others...\n');

  console.log('📡 STEP 2: Testing API (Backend Save)');
  try {
    const response = await fetch('http://localhost:3000/api/verify-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentUid: 'test-rules-check-123',
        topicId: 'rules-test-topic',
        questionId: 'rules-test-question',
        question: 'Test question for rules check',
        studentAnswer: 'Test answer',
        correctAnswer: 'Test correct answer',
        subject: 'Test Subject',
        chapter: 'Test Chapter',
        topic: 'Test Topic'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend Save: Working');
      console.log(`   Notebook ID: ${data.notebookDocumentId}`);
    } else {
      console.log('❌ Backend Save: Failed');
    }
  } catch (error) {
    console.log('❌ API Error:', error.message);
  }

  console.log('\n🚨 STEP 3: CRITICAL FIRESTORE RULES CHECK');
  console.log('────────────────────────────────────────');
  console.log('❗ The practiced notes are being saved but not showing in frontend');
  console.log('❗ This means Firestore security rules are BLOCKING frontend access');
  console.log('');
  console.log('🔧 IMMEDIATE ACTION REQUIRED:');
  console.log('1. Open Firebase Console: https://console.firebase.google.com/project/schoolapp-6e973/firestore/rules');
  console.log('2. Check if you see this rule:');
  console.log('   match /smartNotebook/{userId}/{document=**} {');
  console.log('     allow read, write: if request.auth != null && request.auth.uid == userId;');
  console.log('   }');
  console.log('3. If NOT present, add it and click "Publish"');
  console.log('4. If present, try clicking "Publish" again');

  console.log('\n🧪 STEP 4: FRONTEND TEST INSTRUCTIONS');
  console.log('───────────────────────────────────────');
  console.log('After updating rules:');
  console.log('1. Go to: http://localhost:3000/dashboard/student/notebook');
  console.log('2. Open browser DevTools (F12)');
  console.log('3. Go to Console tab');
  console.log('4. Click "Practiced Notes" tab in the notebook');
  console.log('5. Look for these messages:');
  console.log('   ✅ "📚 Loading practiced notes from smart notebook..."');
  console.log('   ✅ "✅ Loaded X practiced notes" (X should be > 0)');
  console.log('   ❌ Any "permission-denied" errors?');

  console.log('\n📊 STEP 5: VERIFICATION CHECKLIST');
  console.log('─────────────────────────────────');
  console.log('Check these in browser console:');
  console.log('□ No "FirebaseError: Missing or insufficient permissions" errors');
  console.log('□ No "permission-denied" errors');
  console.log('□ Console shows "✅ Loaded X practiced notes" with X > 0');
  console.log('□ Browser network tab shows successful Firestore queries');

  console.log('\n🎯 ALTERNATIVE DEBUG METHOD');
  console.log('──────────────────────────');
  console.log('If rules seem correct but still not working:');
  console.log('1. Go to Firebase Console → Firestore → Data');
  console.log('2. Navigate to: smartNotebook → [your-user-id] → practicedNotes');
  console.log('3. Verify documents exist there');
  console.log('4. Check if user ID in documents matches your logged-in user ID');

  console.log('\n🚀 MOST LIKELY SOLUTION');
  console.log('─────────────────────────');
  console.log('The rules need to be published in Firebase Console.');
  console.log('Even if you updated the local firestore.rules file,');
  console.log('they need to be deployed/published in the Firebase Console.');
}

console.log('Starting Firestore rules debug check...\n');
setTimeout(checkFirestoreRules, 1000); 