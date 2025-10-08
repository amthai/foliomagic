const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');

// Debug: check if env vars are loaded
console.log('OPENROUTER_API_KEY loaded:', !!process.env.OPENROUTER_API_KEY);

// Check for required environment variables
if (!process.env.OPENROUTER_API_KEY) {
  console.error('❌ OPENROUTER_API_KEY не установлен!');
  console.error('Создайте файл .env в корне проекта и добавьте:');
  console.error('OPENROUTER_API_KEY=your_api_key_here');
  console.error('Получите ключ на https://openrouter.ai/keys');
}

const { generateSamplePdf } = require('./pdf');
const { scrapeHhForRole } = require('./scrape');
const { callOpenRouter } = require('./openrouter');
const { getPrompt, formatPrompt, getAllPrompts } = require('./prompts');
const { analyzeVacancies, formatKeywordsForPrompt } = require('./vacancyAnalyzer');

// Function to get search query based on prompt type
function getSearchQueryForPrompt(promptType) {
  const searchQueries = {
    'product_designer': 'продуктовый дизайнер UI UX',
    'web_designer': 'веб дизайнер',
    'graphic_designer': 'графический дизайнер коммуникационный',
    'designer_3d': '3D дизайнер',
    'motion_designer': 'моушн дизайнер анимация',
    'business_analyst': 'бизнес аналитик',
    'system_analyst': 'системный аналитик',
    'product_manager': 'продакт менеджер'
  };
  return searchQueries[promptType] || 'работа';
}

// Function to calculate age from birth date
function calculateAge(birthDate) {
  if (!birthDate) return null;
  
  // Поддерживаем разные форматы даты: DD.MM.YYYY, DD/MM/YYYY, YYYY-MM-DD
  let date;
  if (birthDate.includes('.')) {
    // DD.MM.YYYY
    const [day, month, year] = birthDate.split('.');
    date = new Date(year, month - 1, day);
  } else if (birthDate.includes('/')) {
    // DD/MM/YYYY
    const [day, month, year] = birthDate.split('/');
    date = new Date(year, month - 1, day);
  } else if (birthDate.includes('-')) {
    // YYYY-MM-DD
    date = new Date(birthDate);
  } else {
    return null;
  }
  
  if (isNaN(date.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  return age;
}

// Use global store to survive nodemon restarts
global.inMemoryStore = global.inMemoryStore || new Map(); // requestId -> Buffer
const inMemoryStore = global.inMemoryStore;

// Create temp directory for PDFs
const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static UI
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Endpoint to get available prompts
app.get('/api/prompts', (req, res) => {
  try {
    const prompts = getAllPrompts();
    res.json({ prompts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get prompts' });
  }
});

// Stub endpoint for generation flow
app.post('/api/generate', async (req, res) => {
  try {
    const { fullName, birthDate, city, contacts, experienceText, promptType, relocation, salary, education } = req.body || {};
    console.log('Received form data:', { fullName, birthDate, city, contacts, experienceText, promptType, relocation, salary, education });
    if (!fullName) {
      return res.status(400).json({ error: 'fullName is required' });
    }
    
    if (!promptType) {
      return res.status(400).json({ error: 'promptType is required' });
    }

    const requestId = `req_${Date.now()}`;
    
    // Store pending status
    inMemoryStore.set(requestId, { status: 'processing' });

    try {
      console.log('Starting generation for prompt type:', promptType);
      
      // Временно отключаем парсинг HH из-за блокировок
      console.log('Skipping HH scraping due to 403 errors...');
      const vacancies = [];
      const keywordsText = 'Опыт работы в сфере IT';

      // 3) Get prompt and call LLM via OpenRouter
      console.log('Calling OpenRouter...');
      console.log('OPENROUTER_API_KEY available:', !!process.env.OPENROUTER_API_KEY);
      
      const selectedPrompt = getPrompt(promptType);
      const age = calculateAge(birthDate);
      const promptData = {
        fullName, birthDate, city, contacts, experienceText, relocation, salary, education, age,
        vacancies: vacancies.map(v => ({ url: v.url, title: v.title, content: v.content?.slice(0, 4000) })),
        keywords: keywordsText
      };
      
      const system = {
        role: 'system',
        content: selectedPrompt.system
      };
      const user = {
        role: 'user',
        content: formatPrompt(selectedPrompt, promptData)
      };

      const completion = await callOpenRouter({
        model: 'openai/gpt-4o-mini',
        messages: [system, user],
        responseFormat: { type: 'json_object' },
        apiKey: process.env.OPENROUTER_API_KEY,
      });

      const text = completion?.choices?.[0]?.message?.content || '{}';
      const resume = JSON.parse(text);
      console.log('Generated resume:', JSON.stringify(resume, null, 2));

      // 3) Render HTML and generate PDF
      console.log('Generating PDF...');
      const { renderResumeHtml, generatePdfFromHtml } = require('./renderer');
      const html = await renderResumeHtml(resume);
      
      let pdfBuffer;
      try {
        pdfBuffer = await generatePdfFromHtml(html);
      } catch (pdfError) {
        console.error('PDF generation failed, using fallback:', pdfError.message);
        // Fallback - возвращаем HTML вместо PDF
        const htmlBuffer = Buffer.from(html, 'utf-8');
        pdfBuffer = htmlBuffer;
      }

      // Save PDF to file for persistence
      const pdfPath = path.join(tempDir, `${requestId}.pdf`);
      fs.writeFileSync(pdfPath, pdfBuffer);
      inMemoryStore.set(requestId, pdfPath);
      console.log('PDF ready for download');
      
      return res.status(200).json({ requestId, status: 'ready' });
    } catch (err) {
      console.error('Generation failed:', err);
      inMemoryStore.delete(requestId);
      return res.status(500).json({ error: 'Generation failed: ' + err.message });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Temporary endpoint to download a sample PDF so the flow works end-to-end
app.get('/api/sample-pdf', async (req, res) => {
  try {
    const pdfBuffer = await generateSamplePdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    return res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

app.get('/api/download', (req, res) => {
  const { requestId } = req.query || {};
  console.log('Download request for requestId:', requestId);
  console.log('Available requestIds:', Array.from(inMemoryStore.keys()));
  
  if (!requestId || !inMemoryStore.has(requestId)) {
    return res.status(404).json({ error: 'Not ready' });
  }
  const pdfPath = inMemoryStore.get(requestId);
  
  // Check if it's still processing
  if (pdfPath && typeof pdfPath === 'object' && pdfPath.status === 'processing') {
    return res.status(202).json({ error: 'Still processing' });
  }
  
  // Check if file exists
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'PDF file not found' });
  }
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
  return res.sendFile(pdfPath);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


