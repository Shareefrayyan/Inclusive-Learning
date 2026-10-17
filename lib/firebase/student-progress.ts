// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getFirestore, FieldValue, DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  console.log('🔧 Initializing Firebase Admin with env vars:', {
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

// Types
interface StudentAnswer {
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  isRetry: boolean;
  timestamp: FieldValue;
}

interface TopicProgress {
  totalScore: number;
  maxScore: number;
  percentage: number;
  answeredQuestions: StudentAnswer[];
}

interface SaveAnswerParams {
  studentUid: string;
  topicId: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  isRetry?: boolean;
}

/**
 * Save student answer to Firestore
 * @param params - Answer parameters
 * @returns Promise with the saved document ID
 */
export async function saveStudentAnswer(params: SaveAnswerParams): Promise<string> {
  try {
    const {
      studentUid,
      topicId,
      questionId,
      questionType,
      question,
      studentAnswer,
      correctAnswer,
      score,
      maxScore,
      isRetry = false
    } = params;

    // Validate required parameters
    if (!studentUid || !topicId || !questionId) {
      throw new Error('Missing required parameters: studentUid, topicId, or questionId');
    }

    if (score < 0 || score > maxScore) {
      throw new Error('Invalid score: score must be between 0 and maxScore');
    }

    // Create the answer document
    const answerDoc: StudentAnswer = {
      questionId,
      questionType,
      question,
      studentAnswer,
      correctAnswer,
      score,
      maxScore,
      isRetry,
      timestamp: FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const docRef = await db
      .collection('studentAnswers')
      .doc(studentUid)
      .collection('topics')
      .doc(topicId)
      .collection('answers')
      .add(answerDoc);

    console.log(`Answer saved with ID: ${docRef.id}`);
    return docRef.id;

  } catch (error) {
    console.error('Error saving student answer:', error);
    throw new Error(`Failed to save student answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get topic progress for a student
 * @param studentUid - Student's UID
 * @param topicId - Topic ID
 * @returns Promise with topic progress data
 */
export async function getTopicProgress(studentUid: string, topicId: string): Promise<TopicProgress> {
  try {
    // Validate required parameters
    if (!studentUid || !topicId) {
      throw new Error('Missing required parameters: studentUid or topicId');
    }

    // Fetch all answers for the topic
    const answersSnapshot = await db
      .collection('studentAnswers')
      .doc(studentUid)
      .collection('topics')
      .doc(topicId)
      .collection('answers')
      .orderBy('timestamp', 'desc')
      .get();

    // Convert documents to answer objects
    const answeredQuestions: StudentAnswer[] = answersSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        questionId: data.questionId,
        questionType: data.questionType,
        question: data.question,
        studentAnswer: data.studentAnswer,
        correctAnswer: data.correctAnswer,
        score: data.score,
        maxScore: data.maxScore,
        isRetry: data.isRetry || false,
        timestamp: data.timestamp
      };
    });

    // Calculate total scores
    const totalScore = answeredQuestions.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = answeredQuestions.reduce((sum, answer) => sum + answer.maxScore, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      totalScore,
      maxScore,
      percentage,
      answeredQuestions
    };

  } catch (error) {
    console.error('Error getting topic progress:', error);
    throw new Error(`Failed to get topic progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all topic progress for a student
 * @param studentUid - Student's UID
 * @returns Promise with all topics progress
 */
export async function getAllTopicsProgress(studentUid: string): Promise<Record<string, TopicProgress>> {
  try {
    if (!studentUid) {
      throw new Error('Missing required parameter: studentUid');
    }

    const topicsSnapshot = await db
      .collection('studentAnswers')
      .doc(studentUid)
      .collection('topics')
      .get();

    const allProgress: Record<string, TopicProgress> = {};

    // Get progress for each topic
    for (const topicDoc of topicsSnapshot.docs) {
      const topicId = topicDoc.id;
      allProgress[topicId] = await getTopicProgress(studentUid, topicId);
    }

    return allProgress;

  } catch (error) {
    console.error('Error getting all topics progress:', error);
    throw new Error(`Failed to get all topics progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get unique questions answered by student for a topic
 * @param studentUid - Student's UID
 * @param topicId - Topic ID
 * @returns Promise with unique question IDs and their best scores
 */
export async function getUniqueQuestionProgress(studentUid: string, topicId: string): Promise<Record<string, {
  bestScore: number;
  maxScore: number;
  attempts: number;
  lastAttempt: FieldValue;
}>> {
  try {
    const progress = await getTopicProgress(studentUid, topicId);
    const questionProgress: Record<string, any> = {};

    progress.answeredQuestions.forEach(answer => {
      const questionId = answer.questionId;
      
      if (!questionProgress[questionId]) {
        questionProgress[questionId] = {
          bestScore: answer.score,
          maxScore: answer.maxScore,
          attempts: 1,
          lastAttempt: answer.timestamp
        };
      } else {
        questionProgress[questionId].bestScore = Math.max(questionProgress[questionId].bestScore, answer.score);
        questionProgress[questionId].attempts += 1;
        questionProgress[questionId].lastAttempt = answer.timestamp;
      }
    });

    return questionProgress;

  } catch (error) {
    console.error('Error getting unique question progress:', error);
    throw new Error(`Failed to get unique question progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export types for use in other files
export type { StudentAnswer, TopicProgress, SaveAnswerParams }; 