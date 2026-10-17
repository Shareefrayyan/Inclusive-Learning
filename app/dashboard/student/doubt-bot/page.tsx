'use client';

import { useState } from 'react';
import { MessageCircle, Send, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

interface DoubtBotResponse {
  answer: string;
  success: boolean;
  error?: string;
}

export default function DoubtBotPage() {
  const { userProfile } = useAuth();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<DoubtBotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetAnswer = async () => {
    if (!question.trim()) {
      setError('Please enter a question first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const prompt = `You are a knowledgeable school tutor. Answer the student's question using only the information in the paragraph below.\n\nParagraph:\n"""\nWhen green plants are eaten by primary consumers, a great deal of energy is lost as heat to the environment. Some amount goes into digestion and in doing work, and the rest goes towards growth and reproduction. An average of 10% of the food eaten is turned into its own body and made available for the next level of consumers. Therefore, 10% can be taken as the average value for the amount of organic matter that is present at each step and reaches the next level of consumers. Since so little energy is available for the next level of consumers, food chains generally consist of only three or four steps. The loss of energy at each step is so great that very little usable energy remains after four trophic levels.\n"""\n\nQuestion: ${question}\n\nInstructions:\n- Give a direct, professional answer to the question, based only on the paragraph.\n- Briefly explain your answer in 1-2 sentences, if possible.\n- Do not mention the paragraph, the text, or yourself.\n- If the answer is not found in the paragraph, say: “I couldn’t find the answer in the given text.”`;

      const apiResponse = await fetch('/api/doubt-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          prompt: prompt
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`API request failed: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while getting the answer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToTeacher = () => {
    if (!question.trim()) {
      setError('Please enter a question first.');
      return;
    }
    
    // For now, just log the question
    console.log('Question sent to teacher:', question);
    alert('Question sent to teacher! (This is a demo - no actual teacher integration yet)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-800">Doubt Bot</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Ask questions about your studies and get instant answers from our AI tutor
          </p>
        </div>

        {/* Question Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetAnswer}
              disabled={isLoading || !question.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Bot className="h-5 w-5 mr-2" />
                  Get Answer
                </>
              )}
            </button>
            
            <button
              onClick={handleSendToTeacher}
              disabled={isLoading || !question.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Send to Teacher
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* AI Response */}
        {response && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Bot className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-800">AI Answer</h2>
            </div>
            
            {response.success ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-slate-700 leading-relaxed">{response.answer}</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">
                  {response.error || 'Failed to get answer. Please try again.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">ℹ</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How it works</h3>
              <p className="text-sm text-blue-700 mt-1">
                The AI tutor answers questions based on the provided study material. 
                If your question isn't covered in the material, it will let you know.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 