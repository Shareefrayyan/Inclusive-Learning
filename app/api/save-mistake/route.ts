import { NextRequest, NextResponse } from 'next/server';
import { saveNotebookMistake } from '@/lib/firebase/smart-notebook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
    } = body;
    
    if (!studentUid || !questionId || !question || !incorrectAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, questionId, question, incorrectAnswer, correctAnswer' },
        { status: 400 }
      );
    }

    // Save using the Firebase Admin function to the correct path
    const documentId = await saveNotebookMistake({
      studentUid,
      questionId,
      questionType: questionType || 'qa',
      subject: subject || 'General',
      chapter: chapter || 'General',
      topic: topic || 'General',
      question,
      incorrectAnswer,
      correctAnswer,
      explanation: explanation || ''
    });
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      message: 'Mistake saved successfully' 
    });

  } catch (error) {
    console.error('Error in save-mistake API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 