'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/firebase/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Brain, Target, Shuffle, CheckCircle, AlertCircle, Loader2, RotateCcw, Check, X, Trophy, RefreshCw, Camera } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Types
interface TodaysTask {
  subject: string;
  topic: string;
  completed: boolean;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  type: 'qa' | 'mcq' | 'flashcard' | 'match';
  options?: string[];
  correctAnswer?: string;
  leftOptions?: string[];
  rightOptions?: string[];
  correctMatch?: { keyword: string; definition: string };
  matches?: {
    correct: { keyword: string; definition: string }[];
    incorrect: string[];
  };
}

interface ScoreState {
  questionId: string;
  score: number;
  maxScore: number;
  isRetry: boolean;
}

// Sample today's tasks
const sampleTodaysTasks: TodaysTask[] = [
  { subject: "Biological Science", topic: "Cell Structure", completed: false },
  { subject: "Mathematics", topic: "Trigonometric Ratios", completed: false },
  { subject: "English", topic: "Literary Devices", completed: true },
];

export default function StudyPage() {
  const { userProfile } = useAuth();
  
  // Today's Tasks state
  const [todaysTasks, setTodaysTasks] = useState<TodaysTask[]>(sampleTodaysTasks);
  
  // Dropdown state
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  
  // Selected values
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  // Learning mode state
  const [selectedLearningMode, setSelectedLearningMode] = useState<string>('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  
  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // MCQ State
  const [mcqAnswers, setMcqAnswers] = useState<{[questionId: string]: string}>({});
  const [mcqResults, setMcqResults] = useState<{[questionId: string]: boolean}>({});
  const [mcqScores, setMcqScores] = useState<ScoreState[]>([]);
  const [wrongMcqs, setWrongMcqs] = useState<string[]>([]);
  const [mcqRetryMode, setMcqRetryMode] = useState(false);

  // Flashcard State
  const [flippedCards, setFlippedCards] = useState<{[questionId: string]: boolean}>({});
  const [flashcardScores, setFlashcardScores] = useState<ScoreState[]>([]);
  const [wrongFlashcards, setWrongFlashcards] = useState<string[]>([]);
  const [flashcardRetryMode, setFlashcardRetryMode] = useState(false);

  // Match State
  const [selectedLeft, setSelectedLeft] = useState<{[questionId: string]: string}>({});
  const [selectedRight, setSelectedRight] = useState<{[questionId: string]: string}>({});
  const [matchResults, setMatchResults] = useState<{[questionId: string]: boolean}>({});
  const [matchScores, setMatchScores] = useState<ScoreState[]>([]);
  const [wrongMatches, setWrongMatches] = useState<string[]>([]);
  const [matchRetryMode, setMatchRetryMode] = useState(false);

  // Q&A state with enhanced result properties
  const [qaAnswers, setQaAnswers] = useState<{[questionId: string]: string}>({});
  const [qaResults, setQaResults] = useState<{[questionId: string]: {
    score: number; 
    feedback: string;
    originalScore?: number;
    penaltyApplied?: boolean;
    aiSuccess?: boolean;
    aiError?: string;
  }}>({});
  const [qaScores, setQaScores] = useState<ScoreState[]>([]);
  const [qaShowCorrectAnswer, setQaShowCorrectAnswer] = useState<{[questionId: string]: boolean}>({});
  const [qaRetryMode, setQaRetryMode] = useState<{[questionId: string]: boolean}>({});

  // State for Q&A loading
  const [qaLoading, setQaLoading] = useState<{[key: string]: boolean}>({});

  // 📚 Fetch functions remain the same
  const fetchSubjects = async () => {
    if (!userProfile?.uid) return;
    
    try {
      setLoading(true);
      const questionaireRef = collection(db, 'questionaire');
      const snapshot = await getDocs(questionaireRef);
      const subjectList = snapshot.docs.map(doc => doc.id);
      setSubjects(subjectList);
      
      if (subjectList.length === 0) {
        toast.info("No subjects found in questionaire collection");
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async (subject: string) => {
    if (!userProfile?.uid || !subject) return;
    
    try {
      setLoading(true);
      const chaptersRef = collection(db, 'questionaire', subject, 'chapters');
      const snapshot = await getDocs(chaptersRef);
      const chapterList = snapshot.docs.map(doc => doc.id);
      setChapters(chapterList);
      
      if (chapterList.length === 0) {
        toast.info(`No chapters found for ${subject}`);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      toast.error("Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (subject: string, chapter: string) => {
    if (!userProfile?.uid || !subject || !chapter) return;
    
    try {
      setLoading(true);
      const topicsRef = collection(db, 'questionaire', subject, 'chapters', chapter, 'topics');
      const snapshot = await getDocs(topicsRef);
      const topicList = snapshot.docs.map(doc => doc.id);
      setTopics(topicList);
      
      if (topicList.length === 0) {
        toast.info(`No topics found for ${chapter}`);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (subject: string, chapter: string, topic: string) => {
    if (!userProfile?.uid || !subject || !chapter || !topic) return;
    
    try {
      setQuestionsLoading(true);
      const questionsRef = collection(db, 'questionaire', subject, 'chapters', chapter, 'topics', topic, 'questions');
      const snapshot = await getDocs(questionsRef);
      
      const questionsList: Question[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question || '',
          answer: data.answer || '',
          type: data.type || 'qa',
          options: data.options || [],
          correctAnswer: data.correctAnswer || '',
          leftOptions: data.leftOptions || [],
          rightOptions: data.rightOptions || [],
          correctMatch: data.correctMatch || {},
          matches: data.matches || { correct: [], incorrect: [] }
        };
      });
      
      setQuestions(questionsList);
      resetAllStates();
      
      if (questionsList.length === 0) {
        toast.info(`No questions found for ${topic}`);
      } else {
        toast.success(`Found ${questionsList.length} questions for ${topic}`);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error("Failed to load questions");
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Reset all question states
  const resetAllStates = () => {
    // MCQ
    setMcqAnswers({});
    setMcqResults({});
    setMcqScores([]);
    setWrongMcqs([]);
    setMcqRetryMode(false);
    
    // Flashcards
    setFlippedCards({});
    setFlashcardScores([]);
    setWrongFlashcards([]);
    setFlashcardRetryMode(false);
    
    // Match
    setSelectedLeft({});
    setSelectedRight({});
    setMatchResults({});
    setMatchScores([]);
    setWrongMatches([]);
    setMatchRetryMode(false);
    
    // Q&A
    setQaAnswers({});
    setQaResults({});
    setQaScores([]);
    setQaShowCorrectAnswer({});
    setQaRetryMode({});
  };

  // Handle selections
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedChapter('');
    setSelectedTopic('');
    setChapters([]);
    setTopics([]);
    setQuestions([]);
    resetAllStates();
    
    if (subject) {
      fetchChapters(subject);
    }
  };

  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter);
    setSelectedTopic('');
    setTopics([]);
    setQuestions([]);
    resetAllStates();
    
    if (chapter && selectedSubject) {
      fetchTopics(selectedSubject, chapter);
    }
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setQuestions([]);
    resetAllStates();
    
    if (topic && selectedSubject && selectedChapter) {
      fetchQuestions(selectedSubject, selectedChapter, topic);
    }
  };

  const toggleTaskCompletion = (index: number) => {
    setTodaysTasks(prev => 
      prev.map((task, i) => 
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleLearningModeSelect = (mode: string) => {
    setSelectedLearningMode(mode);
    if (selectedTopic) {
      toast.success(`Selected ${mode.toUpperCase()} mode for ${selectedTopic}`);
    } else {
      toast.info(`${mode.toUpperCase()} mode selected. Choose a topic to start learning!`);
    }
  };

  // Get filtered questions with retry logic
  const getFilteredQuestions = (): Question[] => {
    if (!selectedLearningMode) return [];
    
    if (selectedLearningMode === 'qa') {
      return questions.filter(q => q.type === 'qa');
    } else if (selectedLearningMode === 'flashcards') {
      return questions.filter(q => q.type === 'flashcard' || q.type === 'qa');
    } else if (selectedLearningMode === 'mcq') {
      return questions.filter(q => q.type === 'mcq');
    } else if (selectedLearningMode === 'match') {
      return questions.filter(q => q.type === 'match');
    }
    
    return [];
  };

  // MCQ Handlers
  const handleMCQAnswer = async (questionId: string, selectedOption: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.options || !userProfile?.uid) return;

    const isCorrect = selectedOption === question.answer;
    const previouslyCorrect = mcqResults[questionId];
    
    setMcqResults(prev => ({ ...prev, [questionId]: isCorrect }));

    if (!previouslyCorrect) {
      const score = isCorrect ? (mcqRetryMode ? 5 : 10) : 0;

      // Save to backend
      try {
        const response = await fetch('/api/practice-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentUid: userProfile.uid,
            topicId: selectedTopic,
            questionId: question.id,
            questionType: 'mcq',
            question: question.question,
            studentAnswer: selectedOption,
            correctAnswer: question.answer,
            score,
            maxScore: 10,
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: selectedTopic,
            isRetry: mcqRetryMode
          })
        });

        if (response.ok) {
          console.log('✅ MCQ attempt saved to practiced notes');
        } else {
          console.error('❌ Failed to save MCQ attempt');
        }
      } catch (error) {
        console.error('Error saving MCQ attempt:', error);
      }

      // Update local state
      if (isCorrect) {
        setMcqScores(prev => [...prev.filter(s => s.questionId !== questionId),
          { questionId, score, maxScore: 10, isRetry: mcqRetryMode }]);
      } else {
        if (!wrongMcqs.includes(questionId)) {
          setWrongMcqs(prev => [...prev, questionId]);
        }
      }
    }
  };

  const retryWrongMCQs = () => {
    setMcqRetryMode(true);
    wrongMcqs.forEach(questionId => {
      setMcqAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
      setMcqResults(prev => {
        const newResults = { ...prev };
        delete newResults[questionId];
        return newResults;
      });
    });
    toast.info("Retry mode activated. Answer the wrong questions again!");
  };

  // Flashcard Handlers
  const handleFlashcardFlip = (questionId: string) => {
    setFlippedCards(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleFlashcardRecall = async (questionId: string, recalled: boolean) => {
    const previouslyCorrect = flashcardScores.some(s => s.questionId === questionId && s.score === 10);

    if (!previouslyCorrect) {
      const question = questions.find(q => q.id === questionId);
      if (!question || !userProfile?.uid) return;

      const score = recalled ? (flashcardRetryMode ? 5 : 10) : 0;
      const studentAnswer = recalled ? "Recalled correctly" : "Did not recall";

      // Save to backend
      try {
        const response = await fetch('/api/practice-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentUid: userProfile.uid,
            topicId: selectedTopic,
            questionId: question.id,
            questionType: 'flashcard',
            question: question.question,
            studentAnswer,
            correctAnswer: question.answer,
            score,
            maxScore: 10,
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: selectedTopic,
            isRetry: flashcardRetryMode
          })
        });

        if (response.ok) {
          console.log('✅ Flashcard attempt saved to practiced notes');
        } else {
          console.error('❌ Failed to save flashcard attempt');
        }
      } catch (error) {
        console.error('Error saving flashcard attempt:', error);
      }

      // Update local state
      if (recalled) {
        setFlashcardScores(prev => [...prev.filter(s => s.questionId !== questionId),
          { questionId, score, maxScore: 10, isRetry: flashcardRetryMode }]);
      } else {
        if (!wrongFlashcards.includes(questionId)) {
          setWrongFlashcards(prev => [...prev, questionId]);
        }
      }
    }
  };

  const retryWrongFlashcards = () => {
    setFlashcardRetryMode(true);
    wrongFlashcards.forEach(questionId => {
      setFlippedCards(prev => ({ ...prev, [questionId]: false }));
    });
    setFlashcardScores(prev => prev.filter(s => !wrongFlashcards.includes(s.questionId)));
    toast.info("Retry mode activated. Try to recall the wrong flashcards again!");
  };

  // Match Handlers
  const handleLeftSelect = (questionId: string, leftValue: string) => {
    setSelectedLeft(prev => ({ ...prev, [questionId]: leftValue }));
  };

  const handleRightSelect = (questionId: string, rightValue: string) => {
    setSelectedRight(prev => ({ ...prev, [questionId]: rightValue }));
    
    const leftValue = selectedLeft[questionId];
    if (leftValue) {
      checkMatch(questionId, leftValue, rightValue);
    }
  };

  const checkMatch = async (questionId: string, leftValue: string, rightValue: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.correctMatch || !userProfile?.uid) {
      console.error('❌ Missing required data for match:', { question: !!question, correctMatch: !!question?.correctMatch, userProfile: !!userProfile?.uid });
      return;
    }

    // Check if the selected pair matches the correctMatch object
    const isCorrect =
      question.correctMatch.keyword === leftValue &&
      question.correctMatch.definition === rightValue;

    const previouslyCorrect = matchResults[questionId];
    setMatchResults(prev => ({ ...prev, [questionId]: isCorrect }));

    if (!previouslyCorrect) {
      const score = isCorrect ? (matchRetryMode ? 5 : 10) : 0;
      const studentAnswer = `${leftValue} → ${rightValue}`;
      const correctAnswer = `${question.correctMatch.keyword} → ${question.correctMatch.definition}`;

      // Validate all required fields before API call
      if (!selectedSubject || !selectedChapter || !selectedTopic) {
        console.error('❌ Missing selection data:', { selectedSubject, selectedChapter, selectedTopic });
        toast.error("Please select subject, chapter, and topic first");
        return;
      }

      // Save to backend
      try {
        const requestData = {
          studentUid: userProfile.uid,
          topicId: selectedTopic,
          questionId: question.id,
          questionType: 'match' as const,
          question: question.question,
          studentAnswer,
          correctAnswer,
          score,
          maxScore: 10,
          subject: selectedSubject,
          chapter: selectedChapter,
          topic: selectedTopic,
          isRetry: matchRetryMode
        };
        
        console.log('🔍 Sending match data to API:', requestData);
        
        const response = await fetch('/api/practice-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        const responseData = await response.json();
        console.log('📝 API Response:', responseData);

        if (response.ok) {
          console.log('✅ Match attempt saved to practiced notes');
          toast.success("Match attempt saved! Check your practiced notes in the Notebook.");
        } else {
          console.error('❌ Failed to save match attempt:', responseData);
          toast.error(`Failed to save: ${responseData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error saving match attempt:', error);
        toast.error("Error saving match attempt");
      }

      // Update local state
      if (isCorrect) {
        setMatchScores(prev => [...prev.filter(s => s.questionId !== questionId),
          { questionId, score, maxScore: 10, isRetry: matchRetryMode }]);
      } else {
        if (!wrongMatches.includes(questionId)) {
          setWrongMatches(prev => [...prev, questionId]);
        }
      }
    }
  };

  const retryWrongMatches = () => {
    setMatchRetryMode(true);
    wrongMatches.forEach(questionId => {
      setSelectedLeft(prev => {
        const newLeft = { ...prev };
        delete newLeft[questionId];
        return newLeft;
      });
      setSelectedRight(prev => {
        const newRight = { ...prev };
        delete newRight[questionId];
        return newRight;
      });
      setMatchResults(prev => {
        const newResults = { ...prev };
        delete newResults[questionId];
        return newResults;
      });
    });
    toast.info("Retry mode activated. Try to match the wrong answers again!");
  };

  // Q&A Handlers
  const handleQASubmit = async (questionId: string) => {
    const answer = qaAnswers[questionId];
    if (!answer || !answer.trim()) {
      toast.error("Please write an answer first");
      return;
    }

    const question = questions.find(q => q.id === questionId);
    if (!question) {
      toast.error("Question not found");
      return;
    }

    // Set loading state
    setQaLoading(prev => ({ ...prev, [questionId]: true }));

    try {
      // Call AI verification API
      const response = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentUid: userProfile?.uid,
          topicId: selectedTopic,
          questionId: question.id,
          question: question.question,
          studentAnswer: answer.trim(),
          correctAnswer: question.answer,
          subject: selectedSubject,
          topic: selectedTopic,
          isRetry: qaRetryMode[questionId] || false
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify answer');
      }

      // Check if student already had a correct answer
      const previouslyCorrect = qaResults[questionId]?.score === 10;

      // Update scores if not previously correct
      if (!previouslyCorrect) {
        setQaScores(prev => [...prev.filter(s => s.questionId !== questionId),
          { 
            questionId, 
            score: result.score, 
            maxScore: result.maxScore, 
            isRetry: result.isRetry 
          }]);
      }

      // Update results with detailed feedback
      setQaResults(prev => ({ 
        ...prev, 
        [questionId]: { 
          score: result.score,
          originalScore: result.originalScore,
          feedback: result.feedback,
          penaltyApplied: result.penaltyApplied,
          aiSuccess: result.aiSuccess,
          aiError: result.aiError
        } 
      }));

      // Auto-save low scores to mistakes section
      if (result.score < 5 && !previouslyCorrect && userProfile?.uid) {
        console.log('✅ Low-score Q&A will be flagged in practiced notes');
      }

      // Show success message with score
      if (result.aiSuccess) {
        const scoreMessage = result.penaltyApplied 
          ? `Score: ${result.score}/10 (${result.originalScore}/10 with retry penalty)`
          : `Score: ${result.score}/10`;
        toast.success(`Answer verified! ${scoreMessage}`);
      } else {
        toast.warning("Answer saved, but AI verification had issues. Check feedback for details.");
      }

    } catch (error) {
      console.error('Error verifying answer:', error);
      toast.error(`Failed to verify answer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to previous mock system in case of API failure
      const score = Math.floor(Math.random() * 6) + 5; // 5-10
      const feedback = "AI verification failed. Using fallback scoring.";
      const previouslyCorrect = qaResults[questionId]?.score === 10;

      if (!previouslyCorrect) {
        const finalScore = qaRetryMode[questionId] ? Math.floor(score / 2) : score;
        setQaScores(prev => [...prev.filter(s => s.questionId !== questionId),
          { questionId, score: finalScore, maxScore: 10, isRetry: qaRetryMode[questionId] || false }]);
      }

      setQaResults(prev => ({ 
        ...prev, 
        [questionId]: { 
          score, 
          feedback,
          aiSuccess: false,
          aiError: error instanceof Error ? error.message : 'Unknown error'
        } 
      }));

    } finally {
      // Clear loading state
      setQaLoading(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const handleQARetry = (questionId: string) => {
    setQaRetryMode(prev => ({ ...prev, [questionId]: true }));
    setQaAnswers(prev => ({ ...prev, [questionId]: '' }));
    setQaResults(prev => {
      const newResults = { ...prev };
      delete newResults[questionId];
      return newResults;
    });
    toast.info("Retry mode activated for this question!");
  };

  const showCorrectAnswer = (questionId: string) => {
    setQaShowCorrectAnswer(prev => ({ ...prev, [questionId]: true }));
  };

  // Calculate total scores
  const calculateTotalScore = () => {
    if (selectedLearningMode === 'mcq') {
      const total = mcqScores.reduce((sum, score) => sum + score.score, 0);
      const max = getFilteredQuestions().length * 10;
      return { total, max };
    } else if (selectedLearningMode === 'flashcards') {
      const total = flashcardScores.reduce((sum, score) => sum + score.score, 0);
      const max = getFilteredQuestions().length * 10;
      return { total, max };
    } else if (selectedLearningMode === 'match') {
      const total = matchScores.reduce((sum, score) => sum + score.score, 0);
      const max = getFilteredQuestions().length * 10;
      return { total, max };
    } else if (selectedLearningMode === 'qa') {
      const total = qaScores.reduce((sum, score) => sum + score.score, 0);
      const max = getFilteredQuestions().length * 10;
      return { total, max };
    }
    return { total: 0, max: 0 };
  };

  useEffect(() => {
    if (userProfile?.uid) {
      fetchSubjects();
    }
  }, [userProfile]);

  // 📦 Render different question types based on learning mode
  const renderFlashcard = (question: Question, index: number) => {
    const isFlipped = flippedCards[question.id];
    const hasAnswered = flashcardRetryMode 
      ? flashcardScores.some(s => s.questionId === question.id)
      : flashcardScores.some(s => s.questionId === question.id) || wrongFlashcards.includes(question.id);
    const isWrong = wrongFlashcards.includes(question.id);
    
    return (
      <Card 
        key={question.id} 
        className="relative h-64 cursor-pointer transform-gpu transition-transform duration-300 hover:scale-105"
        onClick={() => !hasAnswered && handleFlashcardFlip(question.id)}
      >
        <div className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 flex flex-col justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Question {index + 1}</h3>
              <p className="text-purple-700 text-sm leading-relaxed px-2">{question.question}</p>
              {!hasAnswered && (
                <div className="mt-3 text-xs text-purple-600">
                  Click to reveal answer
                </div>
              )}
            </div>
          </div>
          
          {/* Back of card */}
          <div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 ${
            isWrong && !flashcardRetryMode
              ? 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200' 
              : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'
          } rounded-xl p-4 flex flex-col justify-center`}>
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-3 ${
                isWrong && !flashcardRetryMode ? 'text-red-800' : 'text-green-800'
              }`}>Answer</h3>
              <p className={`text-sm leading-relaxed px-2 mb-3 ${
                isWrong && !flashcardRetryMode ? 'text-red-700' : 'text-green-700'
              }`}>{question.answer}</p>
              {!hasAnswered && (
                <div className="space-y-2">
                  <p className={`text-xs mb-2 ${
                    isWrong && !flashcardRetryMode ? 'text-red-600' : 'text-green-600'
                  }`}>Did you recall this correctly?</p>
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlashcardRecall(question.id, true);
                      }}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                    >
                      Yes
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlashcardRecall(question.id, false);
                      }}
                      variant="outline"
                      size="sm"
                      className="border-red-600 text-red-600 hover:bg-red-50 text-xs px-3 py-1"
                    >
                      No
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderMCQ = (question: Question, index: number) => {
    const selectedAnswer = mcqAnswers[question.id];
    const isAnswered = mcqResults.hasOwnProperty(question.id);
    const isCorrect = mcqResults[question.id];

    return (
      <Card key={question.id} className="bg-white border border-slate-200 p-4 rounded-xl h-fit">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Question {index + 1}</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">{question.question}</p>
        </div>

        <div className="space-y-2">
          {question.options?.map((option, optionIndex) => {
            let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors text-sm ";
            
            if (isAnswered) {
              if (option === question.answer) {
                buttonClass += "bg-green-50 border-green-200 text-green-800";
              } else if (option === selectedAnswer && option !== question.answer) {
                buttonClass += "bg-red-50 border-red-200 text-red-800";
              } else {
                buttonClass += "bg-slate-50 border-slate-200 text-slate-600";
              }
            } else {
              buttonClass += "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
            }

            return (
              <Button
                key={optionIndex}
                onClick={() => !isAnswered && handleMCQAnswer(question.id, option)}
                className={buttonClass}
                disabled={isAnswered}
                variant="ghost"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-left">{option}</span>
                  {isAnswered && option === question.answer && (
                    <Check size={16} className="text-green-600 flex-shrink-0" />
                  )}
                  {isAnswered && option === selectedAnswer && option !== question.answer && (
                    <X size={16} className="text-red-600 flex-shrink-0" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {isAnswered && !isCorrect && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="font-medium text-red-700 text-sm mb-1">
              ❌ Incorrect
            </div>
            <div className="text-xs text-slate-600">
              Correct answer: <span className="font-medium text-green-700">{question.answer}</span>
            </div>
          </div>
        )}

        {isAnswered && isCorrect && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="font-medium text-green-700 text-sm">
              ✅ Correct!
            </div>
          </div>
        )}
      </Card>
    );
  };

  const renderMatch = (question: Question, index: number) => {
    const selectedLeftValue = selectedLeft[question.id];
    const selectedRightValue = selectedRight[question.id];
    const isAnswered = matchResults.hasOwnProperty(question.id);
    const isCorrect = matchResults[question.id];

    // Use the new Firestore structure
    const leftOptions = question.leftOptions || [];
    const rightOptions = question.rightOptions || [];

    // If no new structure, fall back to legacy or generate default
    if (leftOptions.length === 0 || rightOptions.length === 0) {
      return (
        <Card key={question.id} className="bg-white border border-slate-200 p-4 rounded-xl h-fit">
          <div className="text-center text-slate-500 text-sm">
            No match options configured for this question
          </div>
        </Card>
      );
    }

    return (
      <Card key={question.id} className="bg-white border border-slate-200 p-4 rounded-xl h-fit">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Match {index + 1}</h3>
          <p className="text-slate-600 text-sm mb-4">{question.question}</p>
          <p className="text-slate-500 text-xs mb-4">Select one from the left, then one from the right to match:</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Options */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2 text-center">Left Options</h4>
            <div className="space-y-2">
              {leftOptions.slice(0, 3).map((leftOption, leftIndex) => (
                <Button
                  key={leftIndex}
                  onClick={() => !isAnswered && handleLeftSelect(question.id, leftOption)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${
                    selectedLeftValue === leftOption 
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  disabled={isAnswered}
                  variant="ghost"
                >
                  {leftOption}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Options */}
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2 text-center">Right Options</h4>
            <div className="space-y-2">
              {rightOptions.slice(0, 3).map((rightOption, rightIndex) => (
                <Button
                  key={rightIndex}
                  onClick={() => !isAnswered && selectedLeftValue && handleRightSelect(question.id, rightOption)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${
                    selectedRightValue === rightOption 
                      ? (isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800')
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  disabled={isAnswered || !selectedLeftValue}
                  variant="ghost"
                >
                  {rightOption}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Pair Display */}
        {selectedLeftValue && selectedRightValue && (
          <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-sm text-slate-700">
              <span className="font-medium">Your Match:</span> {selectedLeftValue} → {selectedRightValue}
            </div>
          </div>
        )}

        {/* Result Display */}
        {isAnswered && (
          <div className={`p-3 rounded-lg border ${
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className={`font-medium text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✅ Correct Match!' : '❌ Incorrect Match'}
            </div>
            {!isCorrect && question.correctMatch && (
              <div className="text-xs text-slate-600 mt-1">
                Correct matches: {question.correctMatch.keyword} → {question.correctMatch.definition}
              </div>
            )}
          </div>
        )}
      </Card>
    );
  };

  const renderQAQuestion = (question: Question, index: number) => {
    const result = qaResults[question.id];
    const isInRetryMode = qaRetryMode[question.id];
    const showCorrect = qaShowCorrectAnswer[question.id];
    const isLoading = qaLoading[question.id];

    return (
      <Card key={question.id} className="bg-blue-50 border border-blue-200 p-4 rounded-xl h-fit">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Question {index + 1}
            {result && !isInRetryMode && (
              <span className="ml-2 text-xs text-green-600 font-normal">
                (Score: {result.score}/10{result.penaltyApplied ? ` - retry penalty applied` : ''})
              </span>
            )}
            {isInRetryMode && (
              <span className="ml-2 text-xs text-orange-600 font-normal">
                (Retry mode - 50% score penalty)
              </span>
            )}
            {isLoading && (
              <span className="ml-2 text-xs text-blue-600 font-normal">
                (Verifying with AI...)
              </span>
            )}
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            {question.question}
          </p>
        </div>

        <div className="space-y-3">
          {result && !isInRetryMode && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">AI Verification Result:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Score: </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      result.score >= 8 ? 'text-green-600' : 
                      result.score >= 6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.score}/10
                    </span>
                    {result.penaltyApplied && result.originalScore && (
                      <span className="text-xs text-orange-600">
                        (Original: {result.originalScore}/10)
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-slate-600">AI Feedback: </span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">{result.feedback}</p>
                </div>

                {/* Show AI status */}
                <div className="flex items-center gap-1">
                  {result.aiSuccess ? (
                    <span className="text-xs text-green-600">✓ AI Verified</span>
                  ) : (
                    <span className="text-xs text-red-600">⚠ AI Error: {result.aiError}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              {isInRetryMode ? 'Your New Answer:' : 'Your Answer:'}
            </label>
            <Textarea
              placeholder={isInRetryMode ? "Write your new answer here..." : "Write your answer here..."}
              value={qaAnswers[question.id] || ''}
              onChange={(e) => setQaAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
              className="w-full h-20 bg-white border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-between items-center gap-2">
            {/* Upload Button */}
            <button
              type="button"
              className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors text-xs"
              onClick={() => {
                // TODO: Implement upload functionality
                toast.info("Upload feature coming soon!");
              }}
            >
              <Camera size={16} />
              <span>Upload</span>
            </button>

            <div className="flex gap-2">
              {result && !isInRetryMode && !showCorrect && (
                <>
                  <Button
                    onClick={() => showCorrectAnswer(question.id)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 text-xs px-3 py-1"
                    size="sm"
                    disabled={isLoading}
                  >
                    Show Answer
                  </Button>
                  <Button
                    onClick={() => handleQARetry(question.id)}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1"
                    size="sm"
                    disabled={isLoading}
                  >
                    Try Again
                  </Button>
                </>
              )}
              {(!result || isInRetryMode) && (
                <Button
                  onClick={() => handleQASubmit(question.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 disabled:opacity-50"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    isInRetryMode ? 'Submit New Answer' : 'Verify Answer'
                  )}
                </Button>
              )}
            </div>
          </div>

          {showCorrect && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="text-xs font-semibold text-green-700 mb-2">Correct Answer:</h4>
              <p className="text-xs text-green-700 leading-relaxed">{question.answer}</p>
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Add a retry button for flashcards
  const retryAllWrongFlashcards = () => {
    setFlashcardRetryMode(true);
    setFlippedCards({});
    setFlashcardScores(prev => prev.filter(s => !wrongFlashcards.includes(s.questionId)));
    toast.info("Retry mode activated for all wrong flashcards!");
  };

  // Add a retry button for MCQs
  const retryAllWrongMCQs = () => {
    setMcqRetryMode(true);
    setMcqAnswers({});
    setMcqResults({});
    setMcqScores(prev => prev.filter(s => !wrongMcqs.includes(s.questionId)));
    toast.info("Retry mode activated for all wrong MCQs!");
  };

  // Add a retry button for match questions
  const retryAllWrongMatches = () => {
    setMatchRetryMode(true);
    setSelectedLeft({});
    setSelectedRight({});
    setMatchResults({});
    setMatchScores(prev => prev.filter(s => !wrongMatches.includes(s.questionId)));
    toast.info("Retry mode activated for all wrong matches!");
  };

  // Add a retry button for Q&A
  const retryAllWrongQA = () => {
    setQaRetryMode({});
    setQaAnswers({});
    setQaResults({});
    setQaScores(prev => prev.filter(s => !qaScores.some(q => q.isRetry)));
    toast.info("Retry mode activated for all wrong Q&A!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-6">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 font-bonanova">Let's Study</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/student" className="text-slate-600 hover:text-slate-800 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Today's Tasks Section */}
      <Card className="bg-amber-50 border border-amber-100 p-4 mb-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-merriweather text-slate-800 mb-4 text-center">Today's Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todaysTasks.map((task, index) => {
            const getSubjectColor = (subjectName: string) => {
              const colors = {
                "Telugu": "bg-blue-50 border-blue-200 text-blue-800",
                "English": "bg-purple-50 border-purple-200 text-purple-800",
                "Mathematics": "bg-green-50 border-green-200 text-green-800",
                "Physical Science": "bg-amber-50 border-amber-200 text-amber-800",
                "Biological Science": "bg-rose-50 border-rose-200 text-rose-800",
                "Social Studies": "bg-indigo-50 border-indigo-200 text-indigo-800",
              };
              return colors[subjectName as keyof typeof colors] || "bg-slate-50 border-slate-200 text-slate-700";
            };

            const subjectColor = getSubjectColor(task.subject);
            return (
              <Card
                key={index}
                className={`${subjectColor.split(" ")[0]} ${
                  subjectColor.split(" ")[1]
                } p-4 rounded-xl transition-all duration-300`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskCompletion(index)}
                      className={`p-1 rounded-full mr-3 mt-1 ${
                        task.completed 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-slate-400 hover:text-indigo-600'
                      }`}
                    >
                      <CheckCircle size={20} className={task.completed ? 'fill-current' : ''} />
                    </Button>
                    <label
                      className={`${subjectColor.split(" ")[2]} ${task.completed ? "line-through opacity-70" : ""}`}
                    >
                      <div className="font-semibold">{task.subject}</div>
                      <div>{task.topic}</div>
                    </label>
                  </div>
                  <Button
                    onClick={() => console.log(`Let's study: ${task.topic}`)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200"
                  >
                    Let's Study
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Subject → Chapter → Topic Selection */}
      <Card className="bg-slate-50 border border-slate-200 p-4 mb-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Choose Your Learning Topic</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
            <Select value={selectedSubject} onValueChange={handleSubjectSelect} disabled={loading}>
              <SelectTrigger className="w-full bg-white border-slate-300 rounded-lg h-10">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chapter Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Chapter</label>
            <Select 
              value={selectedChapter} 
              onValueChange={handleChapterSelect} 
              disabled={!selectedSubject || loading}
            >
              <SelectTrigger className="w-full bg-white border-slate-300 rounded-lg h-10">
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter} value={chapter}>
                    {chapter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
            <Select 
              value={selectedTopic} 
              onValueChange={handleTopicSelect} 
              disabled={!selectedChapter || loading}
            >
              <SelectTrigger className="w-full bg-white border-slate-300 rounded-lg h-10">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="text-center py-2 mt-4">
            <p className="text-slate-500 text-sm">Loading...</p>
          </div>
        )}

        {selectedTopic && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <CheckCircle size={16} className="mr-2" />
              <span className="text-sm font-medium">
                Ready to learn: <span className="font-semibold">{selectedTopic}</span>
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Learning Mode Cards - Always Visible */}
      <Card className="bg-white border border-slate-200 p-6 mb-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          {selectedTopic ? (
            <>How would you like to learn: <span className="text-indigo-600">{selectedTopic}</span>?</>
          ) : (
            "Choose Your Learning Mode"
          )}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-xl ${
              selectedLearningMode === 'qa' 
                ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-400' 
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
            }`}
            onClick={() => handleLearningModeSelect('qa')}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <BookOpen size={40} className="text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Question & Answers</h3>
              <p className="text-sm text-blue-600">Practice with detailed Q&A and get verified answers</p>
              {selectedLearningMode === 'qa' && (
                <div className="mt-3 text-xs text-blue-700 font-medium">✓ Selected</div>
              )}
            </div>
          </Card>

          <Card 
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-xl ${
              selectedLearningMode === 'flashcards' 
                ? 'bg-purple-100 border-purple-300 ring-2 ring-purple-400' 
                : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
            }`}
            onClick={() => handleLearningModeSelect('flashcards')}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Brain size={40} className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Flashcards</h3>
              <p className="text-sm text-purple-600">Quick recall practice with flip cards</p>
              {selectedLearningMode === 'flashcards' && (
                <div className="mt-3 text-xs text-purple-700 font-medium">✓ Selected</div>
              )}
            </div>
          </Card>

          <Card 
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-xl ${
              selectedLearningMode === 'mcq' 
                ? 'bg-green-100 border-green-300 ring-2 ring-green-400' 
                : 'bg-green-50 border-green-200 hover:bg-green-100'
            }`}
            onClick={() => handleLearningModeSelect('mcq')}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Target size={40} className="text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">MCQs</h3>
              <p className="text-sm text-green-600">Multiple choice questions with instant feedback</p>
              {selectedLearningMode === 'mcq' && (
                <div className="mt-3 text-xs text-green-700 font-medium">✓ Selected</div>
              )}
            </div>
          </Card>

          <Card 
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 rounded-xl ${
              selectedLearningMode === 'match' 
                ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400' 
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
            }`}
            onClick={() => handleLearningModeSelect('match')}
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Shuffle size={40} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-amber-700 mb-2">Match</h3>
              <p className="text-sm text-amber-600">Match terms with their definitions</p>
              {selectedLearningMode === 'match' && (
                <div className="mt-3 text-xs text-amber-700 font-medium">✓ Selected</div>
              )}
            </div>
          </Card>
        </div>
      </Card>

      {/* Questions Section */}
      {selectedTopic && selectedLearningMode && (
        <Card className="bg-white border border-slate-200 p-6 mb-6 rounded-xl shadow-sm relative">
          <div className="absolute top-4 right-4 text-sm text-slate-600 font-medium">
            Score: {calculateTotalScore().total}/{calculateTotalScore().max}
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            {selectedLearningMode.charAt(0).toUpperCase() + selectedLearningMode.slice(1)} Questions: <span className="text-indigo-600">{selectedTopic}</span>
          </h2>
          
          {questionsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
              <p className="text-slate-600">Loading questions...</p>
            </div>
          ) : getFilteredQuestions().length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No {selectedLearningMode} questions found for this topic</p>
              <p className="text-slate-500 text-sm mt-2">Try selecting a different learning mode or topic!</p>
            </div>
          ) : (
            <>
              {/* Questions Grid Layout */}
              <div className="mb-6">
                {selectedLearningMode === 'mcq' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredQuestions().map((question, index) => renderMCQ(question, index))}
                  </div>
                )}

                {selectedLearningMode === 'flashcards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {getFilteredQuestions().map((question, index) => renderFlashcard(question, index))}
                  </div>
                )}

                {selectedLearningMode === 'match' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {getFilteredQuestions().map((question, index) => renderMatch(question, index))}
                  </div>
                )}

                {selectedLearningMode === 'qa' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {getFilteredQuestions().map((question, index) => renderQAQuestion(question, index))}
                  </div>
                )}
              </div>

              {/* Score Display and Retry Buttons */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <span className="text-lg font-semibold text-slate-800">
                      Total Score: {calculateTotalScore().total}/{calculateTotalScore().max}
                    </span>
                    <span className="text-sm text-slate-600">
                      ({calculateTotalScore().max > 0 ? Math.round((calculateTotalScore().total / calculateTotalScore().max) * 100) : 0}%)
                    </span>
                  </div>

                  {/* Retry Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {selectedLearningMode === 'mcq' && wrongMcqs.length > 0 && !mcqRetryMode && (
                      <Button
                        onClick={retryAllWrongMCQs}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Try Again All Wrong MCQs ({wrongMcqs.length})
                      </Button>
                    )}
                    
                    {selectedLearningMode === 'flashcards' && wrongFlashcards.length > 0 && !flashcardRetryMode && (
                      <Button
                        onClick={retryAllWrongFlashcards}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Try Again All Wrong Flashcards ({wrongFlashcards.length})
                      </Button>
                    )}
                    
                    {selectedLearningMode === 'match' && wrongMatches.length > 0 && !matchRetryMode && (
                      <Button
                        onClick={retryAllWrongMatches}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        🔁 Try Again All Wrong Matches
                      </Button>
                    )}

                    {selectedLearningMode === 'qa' && qaScores.some(q => q.isRetry) && (
                      <Button
                        onClick={retryAllWrongQA}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Try Again All Wrong Q&A
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
} 