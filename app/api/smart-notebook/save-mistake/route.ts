import { NextRequest, NextResponse } from 'next/server';
import { saveMistake, SaveMistakeParams } from '@/lib/firebase/smart-notebook';

export async function POST(request: NextRequest) {
  try {
    const body: SaveMistakeParams = await request.json();
    
    const { studentUid, questionId, question, incorrectAnswer, correctAnswer } = body;
    
    if (!studentUid || !questionId || !question || !incorrectAnswer || !correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, questionId, question, incorrectAnswer, correctAnswer' },
        { status: 400 }
      );
    }

    const documentId = await saveMistake(body);
    
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