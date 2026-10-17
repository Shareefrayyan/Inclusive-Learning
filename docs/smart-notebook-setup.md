# 🧠 Smart Notebook Backend Setup – Firebase + Firestore

Complete backend system for Smart Notebook functionality with Firebase authentication and Firestore database integration.

## 📦 Backend Functions

### Core Functions

1. **`saveNote(params)`** - Save manual notes with subject/chapter/topic organization
2. **`fetchNotes(studentUid, subject?, chapter?, topic?)`** - Fetch notes with optional filters
3. **`savePracticedNote(params)`** - Save question attempts as practiced notes
4. **`saveMistake(params)`** - Store wrong answers as mistakes for review
5. **`markNoteAsImportant(studentUid, noteId, isImportant)`** - Mark notes as important
6. **`markNoteForRevision(studentUid, noteId, isRevision)`** - Add notes to revision list
7. **`getSmartSchedule(studentUid)`** - Get AI-generated study schedule
8. **`getSmartStrategy(studentUid)`** - Get personalized learning strategy
9. **`getMistakes(studentUid, subject?)`** - Get all mistakes for review
10. **`getSubjects()`** - Get subjects from questionaire collection
11. **`getChapters(subject)`** - Get chapters for a subject
12. **`getTopics(subject, chapter)`** - Get topics for a chapter

## 🗂️ Firestore Structure

### Smart Notebook Collections
```
smartNotebook/{studentUid}/
  ├── notes/             → manually written notes
  ├── practicedNotes/    → flashcard, mcq, match, qa attempts
  ├── mistakes/          → auto-stored wrong answers
  ├── revisionNotes/     → notes/questions marked for revision
  ├── importantNotes/    → notes/questions marked important
  ├── schedule/          → smart topic revision schedule
  └── strategy/          → smart learning strategy
```

### Sample Document Structures

#### Manual Note Document
```json
{
  "id": "note_1684567890123",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Linear Equations",
  "content": "Linear equations have the form ax + b = c...",
  "isImportant": false,
  "isDoubt": false,
  "isRevision": true,
  "isMistake": false,
  "timestamp": "<serverTimestamp>",
  "lastModified": "<serverTimestamp>"
}
```

#### Practiced Note Document
```json
{
  "id": "practiced_1684567890123",
  "questionId": "q123",
  "questionType": "mcq",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Linear Equations",
  "question": "Solve: 2x + 3 = 7",
  "studentAnswer": "x = 2",
  "correctAnswer": "x = 2",
  "score": 10,
  "maxScore": 10,
  "isRetry": false,
  "isImportant": false,
  "isDoubt": false,
  "isRevision": false,
  "timestamp": "<serverTimestamp>"
}
```

#### Mistake Document
```json
{
  "id": "mistake_1684567890123",
  "questionId": "q456",
  "questionType": "mcq",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Quadratic Equations",
  "question": "Solve: x² - 5x + 6 = 0",
  "incorrectAnswer": "x = 1, 2",
  "correctAnswer": "x = 2, 3",
  "explanation": "Use factoring: (x-2)(x-3) = 0",
  "timestamp": "<serverTimestamp>",
  "reviewCount": 0,
  "isFixed": false
}
```

#### Smart Schedule Document
```json
{
  "id": "current",
  "topics": [
    {
      "subject": "Mathematics",
      "chapter": "Algebra",
      "topic": "Linear Equations",
      "nextReviewDate": "2023-05-20",
      "priority": "high",
      "difficulty": 7,
      "lastReviewed": "2023-05-15",
      "reviewCount": 3
    }
  ],
  "lastUpdated": "<serverTimestamp>"
}
```

#### Smart Strategy Document
```json
{
  "id": "current",
  "learningProfile": {
    "preferredLearningStyle": "visual",
    "strongSubjects": ["Mathematics", "Physical Science"],
    "weakSubjects": ["English", "Social Studies"],
    "averageSessionTime": 45,
    "bestStudyTime": "evening"
  },
  "recommendations": [
    {
      "message": "Focus more on English grammar exercises",
      "type": "focus",
      "priority": 1
    },
    {
      "message": "Review Mathematics concepts from last week",
      "type": "review",
      "priority": 2
    }
  ],
  "lastUpdated": "<serverTimestamp>"
}
```

## 🚀 API Endpoints

### 1. Save Manual Note
```
POST /api/smart-notebook/save-note
```
**Body:**
```json
{
  "studentUid": "user123",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Linear Equations",
  "content": "Important formulas and concepts...",
  "isImportant": false,
  "isDoubt": false,
  "isRevision": true,
  "isMistake": false
}
```

### 2. Fetch Notes
```
GET /api/smart-notebook/fetch-notes?studentUid=user123&subject=Mathematics&chapter=Algebra&topic=Linear%20Equations
```

### 3. Save Practiced Note
```
POST /api/smart-notebook/save-practiced-note
```
**Body:**
```json
{
  "studentUid": "user123",
  "questionId": "q123",
  "questionType": "mcq",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Linear Equations",
  "question": "Solve: 2x + 3 = 7",
  "studentAnswer": "x = 2",
  "correctAnswer": "x = 2",
  "score": 10,
  "maxScore": 10,
  "isRetry": false
}
```

### 4. Save Mistake
```
POST /api/smart-notebook/save-mistake
```
**Body:**
```json
{
  "studentUid": "user123",
  "questionId": "q456",
  "questionType": "mcq",
  "subject": "Mathematics",
  "chapter": "Algebra",
  "topic": "Quadratic Equations",
  "question": "Solve: x² - 5x + 6 = 0",
  "incorrectAnswer": "x = 1, 2",
  "correctAnswer": "x = 2, 3",
  "explanation": "Use factoring method"
}
```

### 5. Get Smart Schedule
```
GET /api/smart-notebook/smart-schedule/{studentUid}
```

### 6. Get Smart Strategy
```
GET /api/smart-notebook/smart-strategy/{studentUid}
```

### 7. Get Subjects
```
GET /api/smart-notebook/subjects
```

## 📱 Client Usage Examples

```typescript
import { 
  saveNoteClient, 
  fetchNotesClient, 
  savePracticedNoteClient,
  saveMistakeClient,
  getSmartScheduleClient,
  getSmartStrategyClient,
  createSaveNoteParams
} from '@/lib/firebase/smart-notebook-client';

// Save a manual note
const noteResult = await saveNoteClient(createSaveNoteParams(
  'user123',
  'Mathematics',
  'Algebra',
  'Linear Equations',
  'Important formulas: ax + b = c',
  false, // isImportant
  false, // isDoubt
  true,  // isRevision
  false  // isMistake
));

// Fetch notes for a topic
const notesResult = await fetchNotesClient('user123', 'Mathematics', 'Algebra', 'Linear Equations');

// Save a practiced note after question attempt
const practicedResult = await savePracticedNoteClient({
  studentUid: 'user123',
  questionId: 'q123',
  questionType: 'mcq',
  subject: 'Mathematics',
  chapter: 'Algebra',
  topic: 'Linear Equations',
  question: 'Solve: 2x + 3 = 7',
  studentAnswer: 'x = 2',
  correctAnswer: 'x = 2',
  score: 10,
  maxScore: 10,
  isRetry: false
});

// Save a mistake
const mistakeResult = await saveMistakeClient({
  studentUid: 'user123',
  questionId: 'q456',
  questionType: 'mcq',
  subject: 'Mathematics',
  chapter: 'Algebra',
  topic: 'Quadratic Equations',
  question: 'Solve: x² - 5x + 6 = 0',
  incorrectAnswer: 'x = 1, 2',
  correctAnswer: 'x = 2, 3',
  explanation: 'Use factoring method'
});

// Get smart schedule
const scheduleResult = await getSmartScheduleClient('user123');

// Get smart strategy
const strategyResult = await getSmartStrategyClient('user123');
```

## 🎯 Integration with Study Page

Add these calls after each question attempt in your study page:

```typescript
// After any question attempt (correct or wrong)
await savePracticedNoteClient({
  studentUid: userProfile.uid,
  questionId: question.id,
  questionType: 'mcq', // or 'flashcard', 'match', 'qa'
  subject: selectedSubject,
  chapter: selectedChapter,
  topic: selectedTopic,
  question: question.question,
  studentAnswer: userAnswer,
  correctAnswer: question.answer,
  score: isCorrect ? (isRetryMode ? 5 : 10) : 0,
  maxScore: 10,
  isRetry: isRetryMode
});

// If answer is wrong, also save as mistake
if (!isCorrect) {
  await saveMistakeClient({
    studentUid: userProfile.uid,
    questionId: question.id,
    questionType: 'mcq',
    subject: selectedSubject,
    chapter: selectedChapter,
    topic: selectedTopic,
    question: question.question,
    incorrectAnswer: userAnswer,
    correctAnswer: question.answer,
    explanation: 'Generated explanation or hint'
  });
}
```

## 🎨 UI Integration

### Floating Modal Cards

The Smart Notebook system supports floating modal cards for smart schedule and strategy:

```typescript
// Smart Schedule Modal
const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
const [scheduleData, setScheduleData] = useState(null);

const openScheduleModal = async () => {
  const result = await getSmartScheduleClient(userProfile.uid);
  if (result.success) {
    setScheduleData(result.data);
    setScheduleModalOpen(true);
  }
};

// Smart Strategy Modal
const [strategyModalOpen, setStrategyModalOpen] = useState(false);
const [strategyData, setStrategyData] = useState(null);

const openStrategyModal = async () => {
  const result = await getSmartStrategyClient(userProfile.uid);
  if (result.success) {
    setStrategyData(result.data);
    setStrategyModalOpen(true);
  }
};
```

## 🔒 Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Smart Notebook access
    match /smartNotebook/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Questionaire collection (read-only for subjects/chapters/topics)
    match /questionaire/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📊 Features

- ✅ **Manual Note Taking** - Write and organize notes by subject/chapter/topic
- ✅ **Practiced Notes** - Auto-save question attempts from study sessions
- ✅ **Mistake Tracking** - Automatically track wrong answers for review
- ✅ **Smart Organization** - Mark notes as important, doubts, or for revision
- ✅ **Smart Schedule** - AI-generated study schedules based on performance
- ✅ **Smart Strategy** - Personalized learning recommendations
- ✅ **Subject Integration** - Fetch subjects/chapters/topics from existing structure
- ✅ **Floating Modals** - Smart cards for schedule and strategy
- ✅ **Real-time Sync** - All data synced with Firestore in real-time
- ✅ **TypeScript Support** - Full type safety throughout the system
- ✅ **Error Handling** - Comprehensive error handling and validation

## 🔧 Setup Requirements

1. **Firebase Admin SDK** - Already installed from previous student progress setup
2. **Environment Variables** - Use same `.env.local` configuration
3. **Firestore Rules** - Update rules to include smartNotebook collections
4. **Client Integration** - Import and use client functions in your components

The Smart Notebook system is production-ready and integrates seamlessly with your existing study page and notebook UI! 