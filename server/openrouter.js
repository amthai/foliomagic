const fetch = require('node-fetch');

// Ensure dotenv is loaded
require('dotenv').config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

async function callOpenRouter({ model, messages, responseFormat, apiKey }) {
  const key = apiKey || OPENROUTER_API_KEY;
  if (!key) {
    throw new Error('OPENROUTER_API_KEY не установлен. Создайте файл .env и добавьте OPENROUTER_API_KEY=your_key_here. Получите ключ на https://openrouter.ai/keys');
  }
  const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://resume.local',
      'X-Title': 'Resume Generator',
    },
    body: JSON.stringify({
      model,
      messages,
      ...(responseFormat ? { response_format: responseFormat } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data;
}

module.exports = { callOpenRouter };


