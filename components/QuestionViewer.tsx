'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Check, X } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  type: 'qa' | 'flashcard' | 'mcq' | 'match';
  options?: string[];
  correctAnswer?: string;
  matchOptions?: string[];
}

interface QuestionViewerProps {
  subject: string;
  chapter: string;
  topic: string;
}

export default function QuestionViewer({ subject, chapter, topic }: QuestionViewerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState<{[key: string]: boolean}>({});
  const [matchSelections, setMatchSelections] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (subject && chapter && topic) {
      fetchQuestions();
    }
  }, [subject, chapter, topic]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
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
          matchOptions: data.matchOptions || []
        };
      });
      
      setQuestions(questionsList);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardFlip = (questionId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleMCQAnswer = (questionId: string, selectedOption: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
    setShowResults(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const handleMatchSelection = (questionId: string, option: string) => {
    setMatchSelections(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const resetMCQ = (questionId: string) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    setShowResults(prev => ({
      ...prev,
      [questionId]: false
    }));
  };

  const renderFlashcard = (question: Question, index: number) => {
    const isFlipped = flippedCards[question.id];
    
    return (
      <Card 
        key={question.id} 
        className="relative h-64 cursor-pointer transform-gpu transition-transform duration-300 hover:scale-105"
        onClick={() => handleCardFlip(question.id)}
      >
        <div className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Question {index + 1}</h3>
              <p className="text-purple-700 text-base leading-relaxed">{question.question}</p>
              <div className="mt-4 text-sm text-purple-600">
                Click to reveal answer
              </div>
            </div>
          </div>
          
          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 flex flex-col justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Answer</h3>
              <p className="text-green-700 text-base leading-relaxed">{question.answer}</p>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardFlip(question.id);
                }}
                variant="outline"
                size="sm"
                className="mt-4 border-green-600 text-green-600 hover:bg-green-50"
              >
                <RotateCcw size={16} className="mr-2" />
                Flip Back
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderMCQ = (question: Question, index: number) => {
    const selectedAnswer = selectedAnswers[question.id];
    const showResult = showResults[question.id];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <Card key={question.id} className="bg-white border border-slate-200 p-6 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Question {index + 1}</h3>
          <p className="text-slate-700 text-base leading-relaxed mb-4">{question.question}</p>
        </div>

        <div className="space-y-3">
          {question.options?.map((option, optionIndex) => {
            let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors ";
            
            if (showResult) {
              if (option === question.correctAnswer) {
                buttonClass += "bg-green-50 border-green-200 text-green-800";
              } else if (option === selectedAnswer && option !== question.correctAnswer) {
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
                onClick={() => !showResult && handleMCQAnswer(question.id, option)}
                className={buttonClass}
                disabled={showResult}
                variant="ghost"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showResult && option === question.correctAnswer && (
                    <Check size={20} className="text-green-600" />
                  )}
                  {showResult && option === selectedAnswer && option !== question.correctAnswer && (
                    <X size={20} className="text-red-600" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Correct answer: <span className="font-medium">{question.correctAnswer}</span>
            </p>
            <Button 
              onClick={() => resetMCQ(question.id)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    );
  };

  const renderMatch = (question: Question, index: number) => {
    const selectedMatch = matchSelections[question.id];
    const allOptions = [question.answer, ...(question.matchOptions || [])].sort(() => Math.random() - 0.5);

    return (
      <Card key={question.id} className="bg-white border border-slate-200 p-6 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Match {index + 1}</h3>
          <p className="text-slate-600 text-sm mb-4">Match the question with the correct answer:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question side */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Question:</h4>
            <Card className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800">{question.question}</p>
            </Card>
          </div>

          {/* Options side */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700">Choose the correct match:</h4>
            <div className="space-y-2">
              {allOptions.map((option, optionIndex) => {
                let buttonClass = "w-full text-left p-3 rounded-lg border transition-colors ";
                
                if (selectedMatch) {
                  if (option === question.answer) {
                    buttonClass += "bg-green-50 border-green-200 text-green-800";
                  } else if (option === selectedMatch && option !== question.answer) {
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
                    onClick={() => !selectedMatch && handleMatchSelection(question.id, option)}
                    className={buttonClass}
                    disabled={!!selectedMatch}
                    variant="ghost"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {selectedMatch && option === question.answer && (
                        <Check size={20} className="text-green-600" />
                      )}
                      {selectedMatch && option === selectedMatch && option !== question.answer && (
                        <X size={20} className="text-red-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {selectedMatch && (
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className={`font-medium ${selectedMatch === question.answer ? 'text-green-700' : 'text-red-700'}`}>
              {selectedMatch === question.answer ? '✅ Correct Match!' : '❌ Incorrect Match'}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Correct answer: <span className="font-medium">{question.answer}</span>
            </p>
            <Button 
              onClick={() => setMatchSelections(prev => {
                const newSelections = { ...prev };
                delete newSelections[question.id];
                return newSelections;
              })}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
        <p className="text-slate-600">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 text-lg">No questions found for this topic</p>
        <p className="text-slate-500 text-sm mt-2">Questions may be added soon. Try another topic!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        if (question.type === 'flashcard' || question.type === 'qa') {
          return renderFlashcard(question, index);
        } else if (question.type === 'mcq') {
          return renderMCQ(question, index);
        } else if (question.type === 'match') {
          return renderMatch(question, index);
        }
        return null;
      })}
    </div>
  );
} 