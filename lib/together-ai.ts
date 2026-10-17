interface VerificationResult {
  score: number; // 1-10
  feedback: string;
  success: boolean;
  error?: string;
}

interface VerifyAnswerParams {
  studentAnswer: string;
  correctAnswer: string;
  question: string;
  subject?: string;
  topic?: string;
}

export async function verifyAnswerWithAI({
  studentAnswer,
  correctAnswer,
  question,
  subject,
  topic
}: VerifyAnswerParams): Promise<VerificationResult> {
  try {
    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('TOGETHER_API_KEY environment variable is not set');
    }

    // Construct the prompt with context
    const contextInfo = subject && topic ? `Subject: ${subject}, Topic: ${topic}` : '';
    
    const prompt = `You are a helpful teacher giving direct feedback to a student. Compare their answer to the correct answer and provide a score from 1 to 10 with constructive feedback.

${contextInfo ? `Context: ${contextInfo}` : ''}

Question: ${question}

Correct Answer: ${correctAnswer}

Student's Answer: ${studentAnswer}

Please respond in this exact JSON format:
{
  "score": [number from 1-10],
  "feedback": "[Direct feedback using 'you' - what you did well, what you missed, what you should improve]"
}

Give direct, helpful feedback using "you" instead of "the student". Be encouraging but specific about improvements needed.

Score based on:
- Factual correctness (40%)
- Completeness (30%) 
- Clarity (20%)
- Relevance (10%)`;

    console.log('🔍 Making API request to Together.ai...');
    
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
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first to debug
    const responseText = await response.text();
    console.log('📄 Raw API Response:', responseText.substring(0, 500) + '...');

    if (!response.ok) {
      console.error('❌ API Error Response:', responseText);
      
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

        const fallbackText = await fallbackResponse.text();
        console.log('📄 Fallback Response:', fallbackText.substring(0, 500) + '...');

        if (!fallbackResponse.ok) {
          throw new Error(`Both models failed. Primary: ${response.status}, Fallback: ${fallbackResponse.status}. Response: ${fallbackText}`);
        }

        try {
          const fallbackData = JSON.parse(fallbackText);
          return parseAIResponse(fallbackData.choices[0].message.content);
        } catch (parseError) {
          throw new Error(`Failed to parse fallback response: ${parseError}`);
        }
      }

      throw new Error(`Together.ai API error: ${response.status} ${response.statusText}. Response: ${responseText}`);
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 200)}...`);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Unexpected API response structure: ${JSON.stringify(data)}`);
    }

    const aiResponse = data.choices[0].message.content;
    console.log('🤖 AI Response Content:', aiResponse);
    
    return parseAIResponse(aiResponse);

  } catch (error) {
    console.error('💥 Error in AI verification:', error);
    return {
      score: 5, // Default middle score on error
      feedback: `Unable to verify answer automatically. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function parseAIResponse(aiResponse: string): VerificationResult {
  try {
    console.log('🔍 Parsing AI response:', aiResponse);
    
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (typeof parsed.score !== 'number' || typeof parsed.feedback !== 'string') {
      throw new Error('Invalid response format from AI');
    }

    // Clamp score to 1-10 range
    const score = Math.min(10, Math.max(1, Math.round(parsed.score)));

    return {
      score,
      feedback: parsed.feedback.trim(),
      success: true
    };

  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    
    // Fallback: try to extract score and feedback with regex if JSON parsing fails
    const scoreMatch = aiResponse.match(/score["\s]*:?\s*(\d+)/i);
    const feedbackMatch = aiResponse.match(/feedback["\s]*:?\s*["']?([^"'\n]+)["']?/i);
    
    const score = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : 5;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Could not parse detailed feedback from AI response.';
    
    return {
      score,
      feedback,
      success: true
    };
  }
} 