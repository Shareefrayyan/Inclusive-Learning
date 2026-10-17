import { NextRequest, NextResponse } from 'next/server';
import { getAllTopicsProgress } from '@/lib/firebase/student-progress';

interface RouteParams {
  params: {
    studentUid: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { studentUid } = params;
    
    if (!studentUid) {
      return NextResponse.json(
        { error: 'Missing studentUid' },
        { status: 400 }
      );
    }

    // Get all topics progress
    const allProgress = await getAllTopicsProgress(studentUid);
    
    return NextResponse.json({
      success: true,
      data: allProgress
    });

  } catch (error) {
    console.error('Error in get-all-topics-progress API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 