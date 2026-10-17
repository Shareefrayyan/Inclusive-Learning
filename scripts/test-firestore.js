// Test Firestore connection and add sample data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

// Firebase config (you'll need to replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    console.log('Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      // Don't log sensitive keys
    });

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase initialized successfully');

    // Add sample data
    console.log('Adding sample data...');

    // Create Mathematics subject with sample question
    const mathQuestionRef = doc(db, 'questionaire', 'Mathematics', 'chapters', 'Algebra', 'topics', 'Linear Equations', 'questions', 'q1');
    await setDoc(mathQuestionRef, {
      question: "What is the solution to 2x + 5 = 15?",
      answer: "x = 5. First subtract 5 from both sides: 2x = 10, then divide by 2: x = 5",
      type: "qa"
    });

    // Create English subject with sample question
    const englishQuestionRef = doc(db, 'questionaire', 'English', 'chapters', 'Grammar', 'topics', 'Tenses', 'questions', 'q1');
    await setDoc(englishQuestionRef, {
      question: "What is the past tense of 'run'?",
      answer: "The past tense of 'run' is 'ran'.",
      type: "qa"
    });

    // Create Science subject with sample question
    const scienceQuestionRef = doc(db, 'questionaire', 'Science', 'chapters', 'Physics', 'topics', 'Motion', 'questions', 'q1');
    await setDoc(scienceQuestionRef, {
      question: "What is Newton's first law of motion?",
      answer: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
      type: "qa"
    });

    console.log('✅ Sample data added successfully!');
    console.log('📚 Created subjects: Mathematics, English, Science');
    console.log('📖 Each with sample chapters, topics, and questions');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Check your Firebase configuration and make sure:');
    console.error('1. .env.local file exists with correct Firebase credentials');
    console.error('2. Firestore is enabled in your Firebase project');
    console.error('3. Firestore rules allow reads/writes');
  }
}

testFirestore(); 