# Student Progress Tracking System

This system tracks student answers and calculates progress across different question types (MCQ, Flashcards, Match, Q&A).

## 📦 Backend Functions

### Core Functions

1. **`saveStudentAnswer(params)`** - Saves each student answer
2. **`getTopicProgress(studentUid, topicId)`** - Gets aggregated progress for a topic
3. **`getAllTopicsProgress(studentUid)`** - Gets progress for all topics
4. **`getUniqueQuestionProgress(studentUid, topicId)`** - Gets unique question stats

### Firestore Structure

```
/studentAnswers/{studentUid}/topics/{topicId}/answers/{autoId}
```

Each answer document contains:
```json
{
  "questionId": "abc123",
  "questionType": "mcq", // or "flashcard", "match", "qa"
  "question": "What is the capital of France?",
  "studentAnswer": "Paris",
  "correctAnswer": "Paris",
  "score": 10,
  "maxScore": 10,
  "isRetry": false,
  "timestamp": "<serverTimestamp>"
}
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 2. Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file
6. Copy the values to your `.env.local`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (escape newlines with `\n`)

### 3. Install Dependencies

```bash
npm install firebase-admin --legacy-peer-deps
```

## 🚀 API Endpoints

### Save Student Answer
```
POST /api/student-progress/save
```

**Body:**
```json
{
  "studentUid": "user123",
  "topicId": "topic456",
  "questionId": "q789",
  "questionType": "mcq",
  "question": "What is 2+2?",
  "studentAnswer": "4",
  "correctAnswer": "4",
  "score": 10,
  "maxScore": 10,
  "isRetry": false
}
```

### Get Topic Progress
```
GET /api/student-progress/{studentUid}/{topicId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScore": 72,
    "maxScore": 100,
    "percentage": 72,
    "answeredQuestions": [...]
  }
}
```

### Get All Topics Progress
```
GET /api/student-progress/{studentUid}
```

## 📱 Client Usage

```typescript
import { saveStudentAnswerClient, getTopicProgressClient } from '@/lib/firebase/progress-client';

// Save an answer
const result = await saveStudentAnswerClient({
  studentUid: 'user123',
  topicId: 'topic456',
  questionId: 'q789',
  questionType: 'mcq',
  question: 'What is 2+2?',
  studentAnswer: '4',
  correctAnswer: '4',
  score: 10,
  maxScore: 10,
  isRetry: false
});

// Get progress
const progress = await getTopicProgressClient('user123', 'topic456');
```

## 🎯 Integration with Study Page

To integrate with your existing study page, add these calls after each answer:

```typescript
// After MCQ answer
await saveStudentAnswerClient({
  studentUid: userProfile.uid,
  topicId: selectedTopic,
  questionId: question.id,
  questionType: 'mcq',
  question: question.question,
  studentAnswer: selectedOption,
  correctAnswer: question.answer,
  score: isCorrect ? (mcqRetryMode ? 5 : 10) : 0,
  maxScore: 10,
  isRetry: mcqRetryMode
});
```

## 🔒 Security Rules

Make sure your Firestore rules allow authenticated users to read/write their own progress:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /studentAnswers/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📊 Features

- ✅ Tracks every answer attempt
- ✅ Handles retry attempts separately
- ✅ Calculates aggregated scores
- ✅ Maintains detailed answer history
- ✅ Supports all question types (MCQ, Flashcards, Match, Q&A)
- ✅ Real-time progress tracking
- ✅ TypeScript support 