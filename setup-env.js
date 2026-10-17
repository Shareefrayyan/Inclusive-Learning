const fs = require('fs');

console.log('🔧 Setting up complete .env.local file...');

const envContent = `# Client-side Firebase Config (for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAy0NTzQ03Zrf0yds5aS_B_HbmqRMtr7TQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=schoolapp-6e973.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=schoolapp-6e973
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=schoolapp-6e973.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=164252842508
NEXT_PUBLIC_FIREBASE_APP_ID=1:164252842508:web:a1f279f08ae6a1f9d70c29
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GNTK52GMH0

# Server-side Firebase Admin SDK Config (for API routes)
FIREBASE_PROJECT_ID=schoolapp-6e973
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-1234@schoolapp-6e973.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"

# Together.ai API Key
TOGETHER_API_KEY=59e0b1e3dd88a706ffd4255b8dab9dd20026e6017b7a317382f79645a701c3ba`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('');
  console.log('⚠️  IMPORTANT: You need to update the Firebase Admin SDK credentials:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Download the JSON file');
  console.log('4. Replace these values in .env.local:');
  console.log('   - FIREBASE_CLIENT_EMAIL: Copy "client_email" from the JSON');
  console.log('   - FIREBASE_PRIVATE_KEY: Copy "private_key" from the JSON (escape \\n as \\\\n)');
  console.log('');
  console.log('📝 The file has been created with placeholder values for now.');
} catch (error) {
  console.error('❌ Error creating .env.local:', error);
  console.log('');
  console.log('Please manually create .env.local with this content:');
  console.log('');
  console.log(envContent);
} 