import { NextRequest, NextResponse } from 'next/server';
import { getTopicProgress } from '@/lib/firebase/student-progress';

interface RouteParams {
  params: {
    studentUid: string;
    topicId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentUid, topicId } = params;
    
    if (!studentUid || !topicId) {
      return NextResponse.json(
        { error: 'Missing studentUid or topicId' },
        { status: 400 }
      );
    }

    // Get topic progress
    const progress = await getTopicProgress(studentUid, topicId);
    
    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error in get-topic-progress API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 