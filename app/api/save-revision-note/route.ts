import { NextRequest, NextResponse } from 'next/server';
import { saveNotebookNote } from '@/lib/firebase/smart-notebook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      studentUid, 
      subject,
      chapter,
      topic,
      content,
      isRevision = true
    } = body;
    
    if (!studentUid || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, content' },
        { status: 400 }
      );
    }

    // Save using the Firebase Admin function to the correct path
    const documentId = await saveNotebookNote({
      studentUid,
      subject: subject || 'General',
      chapter: chapter || 'General',
      topic: topic || 'General',
      content,
      isImportant: false,
      isDoubt: false,
      isRevision: true,
      isMistake: false
    });
    
    return NextResponse.json({ 
      success: true, 
      documentId,
      message: 'Revision note saved successfully' 
    });

  } catch (error) {
    console.error('Error in save-revision-note API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 