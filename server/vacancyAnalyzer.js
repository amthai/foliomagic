const { callOpenRouter } = require('./openrouter');

// Функция для анализа вакансий и извлечения ключевых слов
async function analyzeVacancies(vacancies, promptType) {
  if (!vacancies || vacancies.length === 0) {
    return getDefaultKeywords(promptType);
  }

  try {
    // Подготавливаем текст вакансий для анализа
    const vacanciesText = vacancies.map(v => 
      `${v.title}: ${v.content?.slice(0, 2000) || ''}`
    ).join('\n\n');

    const systemPrompt = `Ты эксперт по анализу вакансий. Проанализируй следующие вакансии и извлеки ключевые слова, навыки и требования, которые чаще всего встречаются. 

Верни результат в формате JSON:
{
  "skills": ["навык1", "навык2", "навык3"],
  "tools": ["инструмент1", "инструмент2", "инструмент3"],
  "keywords": ["ключевое_слово1", "ключевое_слово2", "ключевое_слово3"],
  "requirements": ["требование1", "требование2", "требование3"]
}

Фокусируйся на:
- Технических навыках и инструментах
- Методологиях и подходах
- Отраслевой терминологии
- Ключевых компетенциях

Верни только JSON, без дополнительного текста.`;

    const userPrompt = `Проанализируй эти вакансии и извлеки ключевые слова:

${vacanciesText}`;

    const completion = await callOpenRouter({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      responseFormat: { type: 'json_object' },
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const analysis = JSON.parse(completion?.choices?.[0]?.message?.content || '{}');
    
    // Объединяем с дефолтными ключевыми словами
    const defaultKeywords = getDefaultKeywords(promptType);
    
    return {
      skills: [...new Set([...(analysis.skills || []), ...(defaultKeywords.skills || [])])],
      tools: [...new Set([...(analysis.tools || []), ...(defaultKeywords.tools || [])])],
      keywords: [...new Set([...(analysis.keywords || []), ...(defaultKeywords.keywords || [])])],
      requirements: [...new Set([...(analysis.requirements || []), ...(defaultKeywords.requirements || [])])]
    };

  } catch (error) {
    console.error('Ошибка анализа вакансий:', error);
    return getDefaultKeywords(promptType);
  }
}

// Дефолтные ключевые слова для каждого типа промпта
function getDefaultKeywords(promptType) {
  const defaultKeywords = {
    product_designer: {
      skills: ['пользовательские исследования', 'wireframes', 'прототипирование', 'дизайн-системы', 'A/B тестирование', 'аналитика', 'информационная архитектура'],
      tools: ['Figma', 'Sketch', 'Adobe XD', 'Principle', 'InVision', 'Zeplin'],
      keywords: ['UI/UX', 'пользовательский опыт', 'интерфейс', 'usability', 'метрики', 'конверсия'],
      requirements: ['опыт работы', 'портфолио', 'командная работа', 'аналитическое мышление']
    },
    web_designer: {
      skills: ['адаптивный дизайн', 'мобильная версия', 'кроссбраузерность', 'типографика', 'цветовые схемы'],
      tools: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'Tilda', 'Webflow', 'Photoshop', 'Illustrator'],
      keywords: ['веб-дизайн', 'интерфейс', 'юзабилити', 'responsive', 'мобильная версия'],
      requirements: ['портфолио', 'опыт работы', 'знание трендов', 'креативность']
    },
    graphic_designer: {
      skills: ['брендинг', 'айдентика', 'типографика', 'цветовые схемы', 'композиция'],
      tools: ['Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'CorelDRAW'],
      keywords: ['графический дизайн', 'брендинг', 'логотипы', 'полиграфия', 'наружная реклама'],
      requirements: ['портфолио', 'креативность', 'знание трендов', 'опыт работы']
    },
    designer_3d: {
      skills: ['моделирование', 'текстурирование', 'рендеринг', 'анимация', 'визуализация'],
      tools: ['3ds Max', 'Maya', 'Blender', 'Cinema 4D', 'ZBrush', 'V-Ray', 'Corona'],
      keywords: ['3D дизайн', 'моделирование', 'визуализация', 'анимация', 'VFX'],
      requirements: ['портфолио', 'технические навыки', 'опыт работы', 'креативность']
    },
    motion_designer: {
      skills: ['анимация', 'motion graphics', 'композитинг', 'кинематография', 'постпродакшн'],
      tools: ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Final Cut Pro', 'Nuke'],
      keywords: ['моушн дизайн', 'анимация', 'видео', 'motion graphics', 'VFX'],
      requirements: ['портфолио', 'технические навыки', 'креативность', 'опыт работы']
    },
    business_analyst: {
      skills: ['аналитика', 'метрики', 'KPI', 'A/B тестирование', 'гипотезы', 'воронки'],
      tools: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Google Analytics', 'Python', 'R'],
      keywords: ['бизнес-аналитика', 'метрики', 'конверсия', 'retention', 'LTV', 'CAC'],
      requirements: ['аналитическое мышление', 'опыт работы', 'знание инструментов', 'коммуникативные навыки']
    },
    system_analyst: {
      skills: ['системный анализ', 'техническая документация', 'UML', 'BPMN', 'тестирование'],
      tools: ['SQL', 'Jira', 'Confluence', 'Postman', 'Git', 'Docker'],
      keywords: ['системный анализ', 'архитектура', 'API', 'интеграции', 'базы данных'],
      requirements: ['технические навыки', 'опыт работы', 'аналитическое мышление', 'документирование']
    },
    product_manager: {
      skills: ['продуктовое управление', 'roadmap', 'backlog', 'user stories', 'приоритизация'],
      tools: ['Jira', 'Confluence', 'Figma', 'Analytics', 'A/B тестирование'],
      keywords: ['продакт менеджмент', 'продукт', 'roadmap', 'метрики', 'пользователи'],
      requirements: ['опыт работы', 'лидерские качества', 'аналитическое мышление', 'коммуникативные навыки']
    }
  };

  return defaultKeywords[promptType] || defaultKeywords.product_designer;
}

// Функция для форматирования ключевых слов в текст для промпта
function formatKeywordsForPrompt(keywords) {
  const { skills, tools, keywords: keyWords, requirements } = keywords;
  
  const skillsText = skills.length > 0 ? `Навыки: ${skills.join(', ')}` : '';
  const toolsText = tools.length > 0 ? `Инструменты: ${tools.join(', ')}` : '';
  const keywordsText = keyWords.length > 0 ? `Ключевые слова: ${keyWords.join(', ')}` : '';
  const requirementsText = requirements.length > 0 ? `Требования: ${requirements.join(', ')}` : '';
  
  return [skillsText, toolsText, keywordsText, requirementsText]
    .filter(text => text.length > 0)
    .join('. ');
}

module.exports = {
  analyzeVacancies,
  getDefaultKeywords,
  formatKeywordsForPrompt
};
