import { 
  Note,
  PracticedNote,
  Mistake,
  SmartSchedule,
  SmartStrategy,
  SaveNoteParams,
  SavePracticedNoteParams,
  SaveMistakeParams
} from './smart-notebook';

/**
 * Save a manual note via API
 */
export async function saveNoteClient(params: SaveNoteParams): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    const response = await fetch('/api/smart-notebook/save-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save note');
    }

    return data;
  } catch (error) {
    console.error('Error saving note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch notes via API
 */
export async function fetchNotesClient(
  studentUid: string,
  subject?: string,
  chapter?: string,
  topic?: string
): Promise<{ success: boolean; data?: Note[]; error?: string }> {
  try {
    const params = new URLSearchParams({ studentUid });
    if (subject) params.append('subject', subject);
    if (chapter) params.append('chapter', chapter);
    if (topic) params.append('topic', topic);

    const response = await fetch(`/api/smart-notebook/fetch-notes?${params}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch notes');
    }

    return result;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Save a practiced note via API
 */
export async function savePracticedNoteClient(params: SavePracticedNoteParams): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    const response = await fetch('/api/smart-notebook/save-practiced-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save practiced note');
    }

    return data;
  } catch (error) {
    console.error('Error saving practiced note:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Save a mistake via API
 */
export async function saveMistakeClient(params: SaveMistakeParams): Promise<{ success: boolean; documentId?: string; error?: string }> {
  try {
    const response = await fetch('/api/smart-notebook/save-mistake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to save mistake');
    }

    return data;
  } catch (error) {
    console.error('Error saving mistake:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get smart schedule via API
 */
export async function getSmartScheduleClient(studentUid: string): Promise<{ success: boolean; data?: SmartSchedule | null; error?: string }> {
  try {
    const response = await fetch(`/api/smart-notebook/smart-schedule/${studentUid}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get smart schedule');
    }

    return result;
  } catch (error) {
    console.error('Error getting smart schedule:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get smart strategy via API
 */
export async function getSmartStrategyClient(studentUid: string): Promise<{ success: boolean; data?: SmartStrategy | null; error?: string }> {
  try {
    const response = await fetch(`/api/smart-notebook/smart-strategy/${studentUid}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get smart strategy');
    }

    return result;
  } catch (error) {
    console.error('Error getting smart strategy:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get subjects via API
 */
export async function getSubjectsClient(): Promise<{ success: boolean; data?: string[]; error?: string }> {
  try {
    const response = await fetch('/api/smart-notebook/subjects');
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to get subjects');
    }

    return result;
  } catch (error) {
    console.error('Error getting subjects:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Utility function to create save note params
 */
export function createSaveNoteParams(
  studentUid: string,
  subject: string,
  chapter: string,
  topic: string,
  content: string,
  isImportant: boolean = false,
  isDoubt: boolean = false,
  isRevision: boolean = false,
  isMistake: boolean = false
): SaveNoteParams {
  return {
    studentUid,
    subject,
    chapter,
    topic,
    content,
    isImportant,
    isDoubt,
    isRevision,
    isMistake
  };
}

/**
 * Utility function to create save practiced note params
 */
export function createSavePracticedNoteParams(
  studentUid: string,
  questionId: string,
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa',
  subject: string,
  chapter: string,
  topic: string,
  question: string,
  studentAnswer: string,
  correctAnswer: string,
  score: number,
  maxScore: number,
  isRetry: boolean = false
): SavePracticedNoteParams {
  return {
    studentUid,
    questionId,
    questionType,
    subject,
    chapter,
    topic,
    question,
    studentAnswer,
    correctAnswer,
    score,
    maxScore,
    isRetry
  };
}

/**
 * Utility function to create save mistake params
 */
export function createSaveMistakeParams(
  studentUid: string,
  questionId: string,
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa',
  subject: string,
  chapter: string,
  topic: string,
  question: string,
  incorrectAnswer: string,
  correctAnswer: string,
  explanation?: string
): SaveMistakeParams {
  return {
    studentUid,
    questionId,
    questionType,
    subject,
    chapter,
    topic,
    question,
    incorrectAnswer,
    correctAnswer,
    explanation
  };
} 