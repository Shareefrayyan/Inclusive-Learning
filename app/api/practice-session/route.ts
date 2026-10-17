import { NextRequest, NextResponse } from 'next/server';
import { saveStudentAnswer } from '@/lib/firebase/student-progress';
import { savePracticedNote } from '@/lib/firebase/smart-notebook';

interface PracticeSessionRequest {
  studentUid: string;
  topicId: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  subject?: string;
  topic?: string;
  chapter?: string;
  isRetry?: boolean;
  feedback?: string;
  timeSpent?: number; // in seconds
}

export async function POST(request: NextRequest) {
  try {
    const body: PracticeSessionRequest = await request.json();
    
    // Validate required fields
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
      subject,
      topic,
      chapter,
      isRetry = false,
      feedback,
      timeSpent
    } = body;
    
    if (!studentUid || !topicId || !questionId || !questionType || !question || !studentAnswer || !correctAnswer || typeof score !== 'number' || typeof maxScore !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, topicId, questionId, questionType, question, studentAnswer, correctAnswer, score, maxScore' },
        { status: 400 }
      );
    }

    // Validate question type
    if (!['mcq', 'flashcard', 'match', 'qa'].includes(questionType)) {
      return NextResponse.json(
        { error: 'Invalid questionType. Must be one of: mcq, flashcard, match, qa' },
        { status: 400 }
      );
    }

    // Validate score range
    if (score < 0 || score > maxScore) {
      return NextResponse.json(
        { error: 'Invalid score. Score must be between 0 and maxScore' },
        { status: 400 }
      );
    }

    // Save to student progress tracking system
    let documentId: string | null = null;
    try {
      documentId = await saveStudentAnswer({
        studentUid,
        topicId,
        questionId,
        questionType,
        question,
        studentAnswer,
        correctAnswer,
        score,
        maxScore,
        isRetry
      });
      console.log('✅ Student progress saved:', documentId);
    } catch (progressError) {
      console.error('Error saving to student progress:', progressError);
      // Continue even if this save fails
    }

    // Also save to smart notebook practiced notes
    let notebookDocumentId: string | null = null;
    try {
      notebookDocumentId = await savePracticedNote({
        studentUid,
        questionId,
        questionType,
        subject: subject || 'General',
        chapter: chapter || 'Practice Questions',
        topic: topic || `${questionType.toUpperCase()} Practice`,
        question,
        studentAnswer,
        correctAnswer,
        score,
        maxScore,
        isRetry
      });
      console.log('✅ Practiced note saved to notebook:', notebookDocumentId);
    } catch (notebookError) {
      console.error('Error saving to notebook:', notebookError);
      // Continue even if notebook save fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `${questionType.toUpperCase()} practice session saved successfully`,
      score,
      maxScore,
      isRetry,
      documentId,
      notebookDocumentId,
      questionType,
      feedback: feedback || `You scored ${score}/${maxScore} on this ${questionType} question!`,
      timeSpent: timeSpent || 0
    });

  } catch (error) {
    console.error('Error in practice-session API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 