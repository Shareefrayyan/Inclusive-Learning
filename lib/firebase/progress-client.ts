import { SaveAnswerParams, TopicProgress } from './student-progress';

/**
 * Save student answer via API
 */
export async function saveStudentAnswerClient(params: SaveAnswerParams): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    const response = await fetch('/api/student-progress/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save answer');
    }

    return data;
  } catch (error) {
    console.error('Error saving answer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get topic progress via API
 */
export async function getTopicProgressClient(studentUid: string, topicId: string): Promise<{ success: boolean; data?: TopicProgress; error?: string }> {
  try {
    const response = await fetch(`/api/student-progress/${studentUid}/${topicId}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get topic progress');
    }

    return result;
  } catch (error) {
    console.error('Error getting topic progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get all topics progress via API
 */
export async function getAllTopicsProgressClient(studentUid: string): Promise<{ success: boolean; data?: Record<string, TopicProgress>; error?: string }> {
  try {
    const response = await fetch(`/api/student-progress/${studentUid}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get all topics progress');
    }

    return result;
  } catch (error) {
    console.error('Error getting all topics progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Utility function to create save answer params
 */
export function createSaveAnswerParams(
  studentUid: string,
  topicId: string,
  questionId: string,
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa',
  question: string,
  studentAnswer: string,
  correctAnswer: string,
  score: number,
  maxScore: number,
  isRetry: boolean = false
): SaveAnswerParams {
  return {
    studentUid,
    topicId,
    questionId,
    questionType,
    question,
    studentAnswer,
    correctAnswer,
    score,
    maxScore,
    isRetry
  };
} 