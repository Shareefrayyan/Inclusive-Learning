import { NextRequest, NextResponse } from 'next/server';
import { fetchNotes } from '@/lib/firebase/smart-notebook';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentUid = searchParams.get('studentUid');
    const subject = searchParams.get('subject') || undefined;
    const chapter = searchParams.get('chapter') || undefined;
    const topic = searchParams.get('topic') || undefined;
    
    if (!studentUid) {
      return NextResponse.json(
        { error: 'Missing studentUid parameter' },
        { status: 400 }
      );
    }

    const notes = await fetchNotes(studentUid, subject, chapter, topic);
    
    return NextResponse.json({
      success: true,
      data: notes
    });

  } catch (error) {
    console.error('Error in fetch-notes API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 