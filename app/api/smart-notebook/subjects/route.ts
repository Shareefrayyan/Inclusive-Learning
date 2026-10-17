import { NextRequest, NextResponse } from 'next/server';
import { getSubjects } from '@/lib/firebase/smart-notebook';

export async function GET(request: NextRequest) {
  try {
    const subjects = await getSubjects();
    
    return NextResponse.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    console.error('Error in get-subjects API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 