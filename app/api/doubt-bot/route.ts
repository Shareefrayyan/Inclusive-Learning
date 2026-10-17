import { NextRequest, NextResponse } from 'next/server';

interface DoubtBotRequest {
  question: string;
  prompt: string;
}

interface DoubtBotResponse {
  answer: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DoubtBotRequest = await request.json();
    const { question, prompt } = body;

    if (!question || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Question and prompt are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('🤖 Making API request to Together.ai for doubt bot...');
    
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
        stream: false
      })
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      console.error('❌ API Error Response:', response.status, response.statusText);
      
      // Try fallback model if primary model fails
      if (response.status === 400 || response.status === 404) {
        console.log('🔄 Trying fallback model...');
        
        const fallbackResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta-llama/Llama-3.2-1B-Instruct-Turbo',
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.1,
            stream: false
          })
        });

        if (!fallbackResponse.ok) {
          throw new Error(`Both models failed. Primary: ${response.status}, Fallback: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        const answer = fallbackData.choices[0].message.content;
        
        return NextResponse.json({
          answer: answer.trim(),
          success: true
        });
      }

      throw new Error(`Together.ai API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Unexpected API response structure');
    }

    const answer = data.choices[0].message.content;
    console.log('🤖 AI Response Content:', answer);
    
    return NextResponse.json({
      answer: answer.trim(),
      success: true
    });

  } catch (error) {
    console.error('💥 Error in doubt bot API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 