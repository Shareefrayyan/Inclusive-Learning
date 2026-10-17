import { NextRequest, NextResponse } from 'next/server';
import { saveNote, SaveNoteParams } from '@/lib/firebase/smart-notebook';

export async function POST(request: NextRequest) {
  try {
    const body: SaveNoteParams = await request.json();
    
    const { studentUid, subject, chapter, topic, content } = body;
    
    if (!studentUid || !subject || !chapter || !topic || !content?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, subject, chapter, topic, content' },
        { status: 400 }
      );
    }

    const documentId = await saveNote(body);
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      message: 'Note saved successfully' 
    });

  } catch (error) {
    console.error('Error in save-note API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 