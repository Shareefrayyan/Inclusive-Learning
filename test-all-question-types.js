// Test all question types (MCQ, flashcard, match, Q&A) for practiced notes integration
const fetch = require('node-fetch');

async function testQuestionType(questionType, testData) {
  console.log(`\n🧪 Testing ${questionType.toUpperCase()} question type...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/practice-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`📡 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${questionType.toUpperCase()} saved successfully!`);
      console.log(`   Score: ${data.score}/${data.maxScore}`);
      console.log(`   Progress ID: ${data.documentId}`);
      console.log(`   Notebook ID: ${data.notebookDocumentId}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    console.error(`💥 Error testing ${questionType}:`, error);
    return false;
  }
}

async function testAllQuestionTypes() {
  console.log('🎯 Testing all question types for practiced notes integration...\n');
  
  const baseData = {
    studentUid: 'test-student-123',
    topicId: 'math-algebra',
    subject: 'Mathematics',
    chapter: 'Chapter 1: Algebra',
    topic: 'Linear Equations',
    isRetry: false
  };

  // Test MCQ
  const mcqData = {
    ...baseData,
    questionId: 'mcq-linear-eq-1',
    questionType: 'mcq',
    question: 'What is the slope of the line y = 2x + 3?',
    studentAnswer: 'B) 2',
    correctAnswer: 'B) 2',
    score: 10,
    maxScore: 10,
    feedback: 'Excellent! You correctly identified the slope.'
  };

  // Test Flashcard
  const flashcardData = {
    ...baseData,
    questionId: 'flashcard-algebra-1',
    questionType: 'flashcard',
    question: 'Define: Linear Equation',
    studentAnswer: 'An equation where the highest power of the variable is 1',
    correctAnswer: 'An equation of the form ax + b = c where the highest power of the variable is 1',
    score: 8,
    maxScore: 10,
    feedback: 'Good answer! You got the main concept, but could include the standard form.'
  };

  // Test Match
  const matchData = {
    ...baseData,
    questionId: 'match-algebra-terms-1',
    questionType: 'match',
    question: 'Match algebraic terms: Coefficient → 3 (in 3x)',
    studentAnswer: 'Coefficient = 3, Variable = x, Constant = 5',
    correctAnswer: 'Coefficient = 3, Variable = x, Constant = 5',
    score: 9,
    maxScore: 10,
    feedback: 'Great matching! You correctly identified all terms.'
  };

  // Test Q&A (we'll also test the original verify-answer endpoint)
  const qaData = {
    ...baseData,
    questionId: 'qa-solve-equation-1',
    questionType: 'qa',
    question: 'Solve: 2x + 5 = 15',
    studentAnswer: 'x = 5',
    correctAnswer: 'x = 5. Subtract 5 from both sides: 2x = 10, then divide by 2.',
    score: 7,
    maxScore: 10,
    feedback: 'Correct answer, but show your work next time!'
  };

  const results = [];
  
  // Test each question type
  results.push(await testQuestionType('mcq', mcqData));
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  
  results.push(await testQuestionType('flashcard', flashcardData));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testQuestionType('match', matchData));
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testQuestionType('qa', qaData));
  
  // Summary
  const successful = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n📊 TEST SUMMARY:');
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`${successful === total ? '🎉 All question types working!' : '⚠️  Some tests failed'}`);
  console.log('\n📚 All practiced questions should now appear in the Smart Notebook!');
}

// Wait for server to be ready, then run tests
setTimeout(() => {
  testAllQuestionTypes();
}, 3000); 