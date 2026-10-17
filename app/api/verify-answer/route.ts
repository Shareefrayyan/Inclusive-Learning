import { NextRequest, NextResponse } from 'next/server';
import { verifyAnswerWithAI } from '@/lib/together-ai';
import { saveStudentAnswer } from '@/lib/firebase/student-progress';
import { savePracticedNote } from '@/lib/firebase/smart-notebook';

interface VerifyAnswerRequest {
  studentUid: string;
  topicId: string;
  questionId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  subject?: string;
  topic?: string;
  chapter?: string;
  isRetry?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyAnswerRequest = await request.json();
    
    // Validate required fields
    const { 
      studentUid, 
      topicId, 
      questionId, 
      question, 
      studentAnswer, 
      correctAnswer,
      subject,
      topic,
      chapter,
      isRetry = false
    } = body;
    
    if (!studentUid || !topicId || !questionId || !question || !studentAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, topicId, questionId, question, studentAnswer, correctAnswer' },
        { status: 400 }
      );
    }

    // Verify answer with AI
    const verificationResult = await verifyAnswerWithAI({
      studentAnswer: studentAnswer.trim(),
      correctAnswer: correctAnswer.trim(),
      question: question.trim(),
      subject,
      topic
    });

    // Calculate final score (apply retry penalty if needed)
    const baseScore = verificationResult.score;
    const finalScore = isRetry ? Math.floor(baseScore / 2) : baseScore;
    const maxScore = 10;

    // Save to student progress tracking system
    let documentId: string | null = null;
    try {
      documentId = await saveStudentAnswer({
        studentUid,
        topicId,
        questionId,
        questionType: 'qa',
        question,
        studentAnswer,
        correctAnswer,
        score: finalScore,
        maxScore,
        isRetry
      });
    } catch (firestoreError) {
      console.error('Error saving to student progress:', firestoreError);
      // Continue even if this save fails
    }

    // Also save to smart notebook practiced notes
    let notebookDocumentId: string | null = null;
    try {
      notebookDocumentId = await savePracticedNote({
        studentUid,
        questionId,
        questionType: 'qa',
        subject: subject || 'General',
        chapter: chapter || 'Practice Questions',
        topic: topic || 'Q&A Practice',
        question,
        studentAnswer,
        correctAnswer,
        score: finalScore,
        maxScore,
        isRetry
      });
      console.log('✅ Practiced note saved to notebook:', notebookDocumentId);
    } catch (notebookError) {
      console.error('Error saving to notebook:', notebookError);
      // Continue even if notebook save fails
    }

    // Return the verification result
    return NextResponse.json({
      success: true,
      score: finalScore,
      maxScore,
      originalScore: baseScore,
      feedback: verificationResult.feedback,
      isRetry,
      penaltyApplied: isRetry && baseScore > 0,
      documentId,
      notebookDocumentId,
      aiSuccess: verificationResult.success,
      aiError: verificationResult.error
    });

  } catch (error) {
    console.error('Error in verify-answer API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 