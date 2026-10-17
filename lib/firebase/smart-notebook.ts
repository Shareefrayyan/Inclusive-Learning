// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getFirestore, FieldValue, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  console.log('🔧 Initializing Firebase Admin (smart-notebook) with env vars:', {
    projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'SET' : 'NOT SET',
  });
  
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing required Firebase Admin environment variables');
  }
  
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

// Types for Smart Notebook
interface Note {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  content: string;
  isImportant: boolean;
  isDoubt: boolean;
  isRevision: boolean;
  isMistake: boolean;
  timestamp: FieldValue;
  lastModified: FieldValue;
}

interface PracticedNote {
  id: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  isRetry: boolean;
  isImportant: boolean;
  isDoubt: boolean;
  isRevision: boolean;
  timestamp: FieldValue;
}

interface Mistake {
  id: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  incorrectAnswer: string;
  correctAnswer: string;
  explanation?: string;
  timestamp: FieldValue;
  reviewCount: number;
  isFixed: boolean;
}

interface SmartSchedule {
  id: string;
  topics: {
    subject: string;
    chapter: string;
    topic: string;
    nextReviewDate: string;
    priority: 'high' | 'medium' | 'low';
    difficulty: number; // 1-10
    lastReviewed: string;
    reviewCount: number;
  }[];
  lastUpdated: FieldValue;
}

interface SmartStrategy {
  id: string;
  learningProfile: {
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    strongSubjects: string[];
    weakSubjects: string[];
    averageSessionTime: number; // in minutes
    bestStudyTime: string;
  };
  recommendations: {
    message: string;
    type: 'focus' | 'review' | 'practice' | 'break';
    priority: number;
  }[];
  lastUpdated: FieldValue;
}

// Save Note Parameters
interface SaveNoteParams {
  studentUid: string;
  subject: string;
  chapter: string;
  topic: string;
  content: string;
  isImportant?: boolean;
  isDoubt?: boolean;
  isRevision?: boolean;
  isMistake?: boolean;
}

interface SavePracticedNoteParams {
  studentUid: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  isRetry?: boolean;
}

interface SaveMistakeParams {
  studentUid: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  subject: string;
  chapter: string;
  topic: string;
  question: string;
  incorrectAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

/**
 * Save a manual note to Firestore
 */
export async function saveNote(params: SaveNoteParams): Promise<string> {
  try {
    const {
      studentUid,
      subject,
      chapter,
      topic,
      content,
      isImportant = false,
      isDoubt = false,
      isRevision = false,
      isMistake = false
    } = params;

    if (!studentUid || !subject || !chapter || !topic || !content.trim()) {
      throw new Error('Missing required parameters for saving note');
    }

    const noteDoc: Note = {
      id: `note_${Date.now()}`,
      subject,
      chapter,
      topic,
      content,
      isImportant,
      isDoubt,
      isRevision,
      isMistake,
      timestamp: FieldValue.serverTimestamp(),
      lastModified: FieldValue.serverTimestamp()
    };

    const docRef = await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('notes')
      .add(noteDoc);

    console.log(`Note saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving note:', error);
    throw new Error(`Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Fetch notes for a specific subject/chapter/topic
 */
export async function fetchNotes(
  studentUid: string,
  subject?: string,
  chapter?: string,
  topic?: string
): Promise<Note[]> {
  try {
    if (!studentUid) {
      throw new Error('Missing studentUid parameter');
    }

    let query = db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('notes')
      .orderBy('timestamp', 'desc');

    // Apply filters if provided
    if (subject) {
      query = query.where('subject', '==', subject);
    }
    if (chapter) {
      query = query.where('chapter', '==', chapter);
    }
    if (topic) {
      query = query.where('topic', '==', topic);
    }

    const snapshot = await query.get();

    const notes: Note[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        content: data.content,
        isImportant: data.isImportant || false,
        isDoubt: data.isDoubt || false,
        isRevision: data.isRevision || false,
        isMistake: data.isMistake || false,
        timestamp: data.timestamp,
        lastModified: data.lastModified
      };
    });

    return notes;

  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error(`Failed to fetch notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save a practiced note (from question attempts)
 */
export async function savePracticedNote(params: SavePracticedNoteParams): Promise<string> {
  try {
    const {
      studentUid,
      questionId,
      questionType,
      subject,
      chapter,
      topic,
      question,
      studentAnswer,
      correctAnswer,
      score,
      maxScore,
      isRetry = false
    } = params;

    if (!studentUid || !questionId || !questionType || !question) {
      throw new Error('Missing required parameters for saving practiced note');
    }

    const practicedNoteDoc: PracticedNote = {
      id: `practiced_${Date.now()}`,
      questionId,
      questionType,
      subject,
      chapter,
      topic,
      question,
      studentAnswer,
      correctAnswer,
      score,
      maxScore,
      isRetry,
      isImportant: false,
      isDoubt: false,
      isRevision: false,
      timestamp: FieldValue.serverTimestamp()
    };

    const docRef = await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('practicedNotes')
      .add(practicedNoteDoc);

    console.log(`Practiced note saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving practiced note:', error);
    throw new Error(`Failed to save practiced note: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save a mistake (wrong answer)
 */
export async function saveMistake(params: SaveMistakeParams): Promise<string> {
  try {
    const {
      studentUid,
      questionId,
      questionType,
      subject,
      chapter,
      topic,
      question,
      incorrectAnswer,
      correctAnswer,
      explanation
    } = params;

    if (!studentUid || !questionId || !question || !incorrectAnswer || !correctAnswer) {
      throw new Error('Missing required parameters for saving mistake');
    }

    const mistakeDoc: Mistake = {
      id: `mistake_${Date.now()}`,
      questionId,
      questionType,
      subject,
      chapter,
      topic,
      question,
      incorrectAnswer,
      correctAnswer,
      explanation,
      timestamp: FieldValue.serverTimestamp(),
      reviewCount: 0,
      isFixed: false
    };

    const docRef = await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('mistakes')
      .add(mistakeDoc);

    console.log(`Mistake saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving mistake:', error);
    throw new Error(`Failed to save mistake: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Mark a note as important
 */
export async function markNoteAsImportant(studentUid: string, noteId: string, isImportant: boolean = true): Promise<void> {
  try {
    if (!studentUid || !noteId) {
      throw new Error('Missing required parameters');
    }

    await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('notes')
      .doc(noteId)
      .update({
        isImportant,
        lastModified: FieldValue.serverTimestamp()
      });

    console.log(`Note ${noteId} marked as ${isImportant ? 'important' : 'not important'}`);

  } catch (error) {
    console.error('Error marking note as important:', error);
    throw new Error(`Failed to mark note as important: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Mark a note for revision
 */
export async function markNoteForRevision(studentUid: string, noteId: string, isRevision: boolean = true): Promise<void> {
  try {
    if (!studentUid || !noteId) {
      throw new Error('Missing required parameters');
    }

    await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('notes')
      .doc(noteId)
      .update({
        isRevision,
        lastModified: FieldValue.serverTimestamp()
      });

    console.log(`Note ${noteId} marked for ${isRevision ? 'revision' : 'removed from revision'}`);

  } catch (error) {
    console.error('Error marking note for revision:', error);
    throw new Error(`Failed to mark note for revision: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get smart schedule for student
 */
export async function getSmartSchedule(studentUid: string): Promise<SmartSchedule | null> {
  try {
    if (!studentUid) {
      throw new Error('Missing studentUid parameter');
    }

    const scheduleDoc = await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('schedule')
      .doc('current')
      .get();

    if (!scheduleDoc.exists) {
      return null;
    }

    const data = scheduleDoc.data();
    return {
      id: scheduleDoc.id,
      topics: data?.topics || [],
      lastUpdated: data?.lastUpdated
    };

  } catch (error) {
    console.error('Error getting smart schedule:', error);
    throw new Error(`Failed to get smart schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get smart learning strategy for student
 */
export async function getSmartStrategy(studentUid: string): Promise<SmartStrategy | null> {
  try {
    if (!studentUid) {
      throw new Error('Missing studentUid parameter');
    }

    const strategyDoc = await db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('strategy')
      .doc('current')
      .get();

    if (!strategyDoc.exists) {
      return null;
    }

    const data = strategyDoc.data();
    return {
      id: strategyDoc.id,
      learningProfile: data?.learningProfile || {},
      recommendations: data?.recommendations || [],
      lastUpdated: data?.lastUpdated
    };

  } catch (error) {
    console.error('Error getting smart strategy:', error);
    throw new Error(`Failed to get smart strategy: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all mistakes for a student
 */
export async function getMistakes(studentUid: string, subject?: string): Promise<Mistake[]> {
  try {
    if (!studentUid) {
      throw new Error('Missing studentUid parameter');
    }

    let query = db
      .collection('smartNotebook')
      .doc(studentUid)
      .collection('mistakes')
      .orderBy('timestamp', 'desc');

    if (subject) {
      query = query.where('subject', '==', subject);
    }

    const snapshot = await query.get();

    const mistakes: Mistake[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        questionId: data.questionId,
        questionType: data.questionType,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        question: data.question,
        incorrectAnswer: data.incorrectAnswer,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        timestamp: data.timestamp,
        reviewCount: data.reviewCount || 0,
        isFixed: data.isFixed || false
      };
    });

    return mistakes;

  } catch (error) {
    console.error('Error getting mistakes:', error);
    throw new Error(`Failed to get mistakes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get subjects from questionaire collection
 */
export async function getSubjects(): Promise<string[]> {
  try {
    const questionaireSnapshot = await db.collection('questionaire').get();
    return questionaireSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting subjects:', error);
    throw new Error(`Failed to get subjects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get chapters for a subject
 */
export async function getChapters(subject: string): Promise<string[]> {
  try {
    if (!subject) {
      throw new Error('Missing subject parameter');
    }

    const chaptersSnapshot = await db
      .collection('questionaire')
      .doc(subject)
      .collection('chapters')
      .get();

    return chaptersSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting chapters:', error);
    throw new Error(`Failed to get chapters: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get topics for a chapter
 */
export async function getTopics(subject: string, chapter: string): Promise<string[]> {
  try {
    if (!subject || !chapter) {
      throw new Error('Missing subject or chapter parameter');
    }

    const topicsSnapshot = await db
      .collection('questionaire')
      .doc(subject)
      .collection('chapters')
      .doc(chapter)
      .collection('topics')
      .get();

    return topicsSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting topics:', error);
    throw new Error(`Failed to get topics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save a note to the UI-compatible path (users/{uid}/notebookNotes)
 */
export async function saveNotebookNote(params: SaveNoteParams): Promise<string> {
  try {
    const {
      studentUid,
      subject,
      chapter,
      topic,
      content,
      isImportant = false,
      isDoubt = false,
      isRevision = false,
      isMistake = false
    } = params;

    if (!studentUid || !content.trim()) {
      throw new Error('Missing required parameters: studentUid and content');
    }

    const noteDoc = {
      subject: subject || 'General',
      chapter: chapter || 'General',
      topic: topic || 'General',
      content,
      isImportant,
      isDoubt,
      isRevision,
      isMistake,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      date: new Date().toISOString().split('T')[0]
    };

    const docRef = await db
      .collection('users')
      .doc(studentUid)
      .collection('notebookNotes')
      .add(noteDoc);

    console.log(`Notebook note saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving notebook note:', error);
    throw new Error(`Failed to save notebook note: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save a mistake to the UI-compatible path (users/{uid}/mistakes)
 */
export async function saveNotebookMistake(params: SaveMistakeParams): Promise<string> {
  try {
    const {
      studentUid,
      questionId,
      questionType,
      subject,
      chapter,
      topic,
      question,
      incorrectAnswer,
      correctAnswer,
      explanation
    } = params;

    if (!studentUid || !questionId || !question || !incorrectAnswer || !correctAnswer) {
      throw new Error('Missing required parameters for saving mistake');
    }

    const mistakeDoc = {
      questionId,
      questionType: questionType || 'qa',
      subject: subject || 'General',
      chapter: chapter || 'General',
      topic: topic || 'General',
      question,
      studentAnswer: incorrectAnswer,
      correctAnswer,
      score: 0,
      featureType: questionType || 'qa',
      topicId: topic || 'General',
      explanation: explanation || '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const docRef = await db
      .collection('users')
      .doc(studentUid)
      .collection('mistakes')
      .add(mistakeDoc);

    console.log(`Notebook mistake saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving notebook mistake:', error);
    throw new Error(`Failed to save notebook mistake: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export types for use in other files
export type {
  Note,
  PracticedNote,
  Mistake,
  SmartSchedule,
  SmartStrategy,
  SaveNoteParams,
  SavePracticedNoteParams,
  SaveMistakeParams
}; 