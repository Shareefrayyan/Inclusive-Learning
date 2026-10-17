// List available models from Together.ai
const fetch = require('node-fetch');

async function listModels() {
  const apiKey = '59e0b1e3dd88a706ffd4255b8dab9dd20026e6017b7a317382f79645a701c3ba';
  
  try {
    const response = await fetch('https://api.together.xyz/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('📋 Available Llama models:');
    const llamaModels = data.filter(model => model.toLowerCase().includes('llama'));
    
    llamaModels.forEach(model => {
      console.log(`  ✓ ${model}`);
    });
    
    console.log(`\n📊 Total models: ${data.length}, Llama models: ${llamaModels.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels(); 