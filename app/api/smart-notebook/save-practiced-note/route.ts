import { NextRequest, NextResponse } from 'next/server';
import { savePracticedNote, SavePracticedNoteParams } from '@/lib/firebase/smart-notebook';

export async function POST(request: NextRequest) {
  try {
    const body: SavePracticedNoteParams = await request.json();
    
    const { studentUid, questionId, questionType, question } = body;
    
    if (!studentUid || !questionId || !questionType || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, questionId, questionType, question' },
        { status: 400 }
      );
    }

    const documentId = await savePracticedNote(body);
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      message: 'Practiced note saved successfully' 
    });

  } catch (error) {
    console.error('Error in save-practiced-note API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 