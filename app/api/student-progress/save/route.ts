import { NextRequest, NextResponse } from 'next/server';
import { saveStudentAnswer, SaveAnswerParams } from '@/lib/firebase/student-progress';

export async function POST(request: NextRequest) {
  try {
    const body: SaveAnswerParams = await request.json();
    
    // Validate required fields
    const { studentUid, topicId, questionId, questionType, question, studentAnswer, correctAnswer, score, maxScore } = body;
    
    if (!studentUid || !topicId || !questionId || !questionType || !question || !correctAnswer || score === undefined || maxScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the answer
    const documentId = await saveStudentAnswer(body);
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      message: 'Answer saved successfully' 
    });

  } catch (error) {
    console.error('Error in save-answer API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 