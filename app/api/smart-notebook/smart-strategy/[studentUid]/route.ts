import { NextRequest, NextResponse } from 'next/server';
import { getSmartStrategy } from '@/lib/firebase/smart-notebook';

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

    const strategy = await getSmartStrategy(studentUid);
    
    return NextResponse.json({
      success: true,
      data: strategy
    });

  } catch (error) {
    console.error('Error in get-smart-strategy API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 