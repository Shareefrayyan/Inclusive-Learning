import { NextRequest, NextResponse } from 'next/server';
import { getSmartSchedule } from '@/lib/firebase/smart-notebook';

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

    const schedule = await getSmartSchedule(studentUid);
    
    return NextResponse.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    console.error('Error in get-smart-schedule API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 