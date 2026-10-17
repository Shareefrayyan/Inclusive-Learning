// COPY AND PASTE THIS INTO YOUR BROWSER CONSOLE
// While you're logged into your app at localhost:3000

console.log('🔍 FRONTEND USER DEBUG CHECK');
console.log('============================');

// Check Firebase auth state
import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js').then((auth) => {
  import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js').then((app) => {
    import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js').then(async (firestore) => {
      
      // Get Firebase instances (they should already be initialized by your app)
      const authInstance = auth.getAuth();
      const user = authInstance.currentUser;
      
      if (user) {
        console.log('✅ User is authenticated!');
        console.log('🆔 Frontend User ID:', user.uid);
        console.log('📧 Email:', user.email);
        
        // Check if this matches the expected user ID from backend
        const expectedUserId = 'E6RrBLxUS6N9gsRax01fcTVfGYt2';
        
        if (user.uid === expectedUserId) {
          console.log('✅ SUCCESS: User ID MATCHES the backend user ID!');
          console.log('   This means practice notes should work correctly.');
        } else {
          console.log('❌ PROBLEM: User ID MISMATCH!');
          console.log('   Expected (from backend):', expectedUserId);
          console.log('   Actual (from frontend):', user.uid);
          console.log('   This is why practice notes don\'t show up!');
        }
        
        // Try to check if there are any docs under the current user ID
        console.log('\n🔍 Checking for documents under current user ID...');
        
        // This requires the Firestore instance to be available
        // You might need to check manually in Firebase Console instead
        
      } else {
        console.log('❌ User is not authenticated');
        console.log('Please make sure you are signed in');
      }
    });
  });
});

// Alternative simpler check (if the above doesn't work):
console.log('\n🔧 ALTERNATIVE CHECK:');
console.log('If the above script fails, try this:');
console.log('1. Go to Application tab in DevTools');
console.log('2. Look at Local Storage or Session Storage');
console.log('3. Find Firebase auth data');
console.log('4. Look for "uid" or "user" data');

// You can also manually check:
console.log('\n📋 MANUAL STEPS:');
console.log('1. Make sure you are signed in to your app');
console.log('2. Go to your app\'s Network tab');
console.log('3. Look for any Firebase requests');
console.log('4. Check the auth headers for user ID'); 