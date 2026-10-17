// Debug environment variables
console.log('🔍 Debugging environment variables...');
console.log('');

console.log('Client-side Firebase config:');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
console.log('');

console.log('Server-side Firebase Admin config:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET');
console.log('');

console.log('Together.ai config:');
console.log('TOGETHER_API_KEY:', process.env.TOGETHER_API_KEY ? 'SET' : 'NOT SET');
console.log('');

if (!process.env.FIREBASE_PROJECT_ID) {
  console.log('❌ FIREBASE_PROJECT_ID is missing!');
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  console.log('❌ FIREBASE_CLIENT_EMAIL is missing!');
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.log('❌ FIREBASE_PRIVATE_KEY is missing!');
}

console.log('Current working directory:', process.cwd());
console.log('Checking for .env.local file...');

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('File size:', content.length, 'characters');
  
  // Check if it has the Firebase admin keys
  if (content.includes('FIREBASE_PROJECT_ID=')) {
    console.log('✅ FIREBASE_PROJECT_ID found in file');
  } else {
    console.log('❌ FIREBASE_PROJECT_ID not found in file');
  }
  
  if (content.includes('FIREBASE_CLIENT_EMAIL=')) {
    console.log('✅ FIREBASE_CLIENT_EMAIL found in file');
  } else {
    console.log('❌ FIREBASE_CLIENT_EMAIL not found in file');
  }
  
  if (content.includes('FIREBASE_PRIVATE_KEY=')) {
    console.log('✅ FIREBASE_PRIVATE_KEY found in file');
  } else {
    console.log('❌ FIREBASE_PRIVATE_KEY not found in file');
  }
} else {
  console.log('❌ .env.local file does not exist');
} 