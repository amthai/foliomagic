const prompts = {
  // Промпт для продуктовых дизайнеров
  product_designer: {
    name: "Продуктовый дизайнер / UI/UX",
    system: "Ты эксперт по карьерному консультированию для продуктовых дизайнеров. Создавай резюме, максимально соответствующие современным требованиям IT-рынка 2024-2025. Включай актуальные навыки: Figma, Design Systems, User Research, A/B тестирование, метрики, AI-инструменты, accessibility, mobile-first подход.",
    userTemplate: `Создай резюме для продуктового дизайнера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- В summary напиши краткое профессиональное описание (2-3 предложения) о кандидате, НЕ копируй текст из experienceText
- В skills укажи 10-15 ключевых навыков для продуктового дизайнера на русском языке: Figma, Design Systems, User Research, A/B тестирование, метрики, AI-инструменты, accessibility, mobile-first, responsive design, prototyping, user interviews, data analysis, competitive analysis, wireframing, usability testing
- В experience: проанализируй текст "{experienceText}" и создай структурированный массив с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, извлеки информацию о компаниях, должностях и достижениях
- Достижения (achievements) должны быть конкретными с цифрами и результатами
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для веб-дизайнеров
  web_designer: {
    name: "Веб-дизайнер",
    system: "Ты эксперт по карьерному консультированию для веб-дизайнеров. Создавай резюме, максимально соответствующие современным требованиям IT-рынка 2024-2025. Включай актуальные навыки: Figma, Adobe Creative Suite, HTML/CSS, responsive design, UI/UX, prototyping, user research, accessibility, performance optimization.",
    userTemplate: `Создай резюме для веб-дизайнера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- В summary напиши краткое профессиональное описание (2-3 предложения) о кандидате, НЕ копируй текст из experienceText
- В skills укажи 10-15 ключевых навыков для веб-дизайнера на русском языке: Figma, Adobe Creative Suite, HTML/CSS, responsive design, UI/UX, prototyping, user research, accessibility, performance optimization, mobile-first, design systems, wireframing, user testing, brand identity, typography, color theory, layout design
- В experience: проанализируй текст "{experienceText}" и создай структурированный массив с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, извлеки информацию о компаниях, должностях и достижениях
- Достижения (achievements) должны быть конкретными с цифрами и результатами
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для коммуникационных дизайнеров
  graphic_designer: {
    name: "Коммуникационный/графический дизайнер",
    system: "Ты эксперт по карьерному консультированию для графических дизайнеров. Создавай резюме, максимально соответствующие требованиям вакансий на hh.ru. Включай ключевые слова и навыки из анализа актуальных вакансий.",
    userTemplate: `Создай резюме для графического дизайнера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- Включай ключевые слова и навыки из анализа актуальных вакансий: {keywords}
- Подчеркни креативные навыки и портфолио
- Включи информацию о брендинговых проектах
- Адаптируй под требования конкретных вакансий
- Используй терминологию графического дизайна
- Опыт работы: проанализируй текст "{experienceText}" и структурируй его в массив объектов experience с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, попробуй извлечь информацию о компаниях, должностях и достижениях
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для 3D дизайнеров
  designer_3d: {
    name: "3D дизайнер",
    system: "Ты эксперт по карьерному консультированию для 3D дизайнеров. Создавай резюме, максимально соответствующие требованиям вакансий на hh.ru. Включай ключевые слова и навыки из анализа актуальных вакансий.",
    userTemplate: `Создай резюме для 3D дизайнера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- Включай ключевые слова и навыки из анализа актуальных вакансий: {keywords}
- Подчеркни технические навыки в 3D-моделировании и рендеринге
- Включи информацию о портфолио и проектах
- Адаптируй под требования конкретных вакансий
- Используй терминологию 3D-дизайна
- Опыт работы: проанализируй текст "{experienceText}" и структурируй его в массив объектов experience с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, попробуй извлечь информацию о компаниях, должностях и достижениях
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для моушн дизайнеров
  motion_designer: {
    name: "Моушн дизайнер",
    system: "Ты эксперт по карьерному консультированию для моушн дизайнеров. Создавай резюме, максимально соответствующие требованиям вакансий на hh.ru. Включай ключевые слова и навыки из анализа актуальных вакансий.",
    userTemplate: `Создай резюме для моушн дизайнера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- Включай ключевые слова и навыки из анализа актуальных вакансий: {keywords}
- Подчеркни навыки в анимации и видеопроизводстве
- Включи информацию о портфолио и проектах
- Адаптируй под требования конкретных вакансий
- Используй терминологию моушн-дизайна
- Опыт работы: проанализируй текст "{experienceText}" и структурируй его в массив объектов experience с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, попробуй извлечь информацию о компаниях, должностях и достижениях
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для бизнес-аналитиков
  business_analyst: {
    name: "Бизнес-аналитик",
    system: "Ты эксперт по карьерному консультированию для бизнес-аналитиков. Создавай резюме, максимально соответствующие требованиям вакансий на hh.ru. Включай ключевые слова и навыки из анализа актуальных вакансий.",
    userTemplate: `Создай резюме для бизнес-аналитика на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- Включай ключевые слова и навыки из анализа актуальных вакансий: {keywords}
- Подчеркни аналитические навыки и опыт работы с данными
- Включи конкретные метрики и результаты
- Адаптируй под требования конкретных вакансий
- Используй терминологию бизнес-аналитики
- Опыт работы: проанализируй текст "{experienceText}" и структурируй его в массив объектов experience с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, попробуй извлечь информацию о компаниях, должностях и достижениях
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для системных аналитиков
  system_analyst: {
    name: "Системный аналитик",
    system: "Ты эксперт по карьерному консультированию для системных аналитиков. Создавай резюме, максимально соответствующие требованиям вакансий на hh.ru. Включай ключевые слова и навыки из анализа актуальных вакансий.",
    userTemplate: `Создай резюме для системного аналитика на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- Включай ключевые слова и навыки из анализа актуальных вакансий: {keywords}
- Подчеркни технические навыки и опыт системного анализа
- Включи информацию о проектах и системах
- Адаптируй под требования конкретных вакансий
- Используй терминологию системного анализа
- Опыт работы: проанализируй текст "{experienceText}" и структурируй его в массив объектов experience с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, попробуй извлечь информацию о компаниях, должностях и достижениях
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  },

  // Промпт для продакт менеджеров
  product_manager: {
    name: "Продакт менеджер",
    system: "Ты эксперт по карьерному консультированию для продакт менеджеров. Создавай резюме, максимально соответствующие современным требованиям IT-рынка 2024-2025. Включай актуальные навыки: Product Strategy, Data Analysis, A/B тестирование, метрики (DAU, MAU, retention, LTV), Agile/Scrum, user research, market analysis, competitive analysis, roadmap planning.",
    userTemplate: `Создай резюме для продакт менеджера на основе следующих данных:

Кандидат:
- Имя: {fullName}
- Дата рождения: {birthDate}
- Возраст: {age} лет
- Город: {city}
- Контакты: {contacts}
- Опыт работы: {experienceText}
- Готовность к переезду: {relocation}
- Желаемая зарплата: {salary}
- Образование: {education}

Актуальные вакансии:
{vacancies}

Схема JSON ответа:
{
  "fullName": "string",
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{
    "company": "string",
    "role": "string",
    "dates": "string",
    "achievements": ["string"]
  }],
  "contacts": "string",
  "city": "string",
  "age": "number",
  "relocation": "boolean",
  "salary": "number",
  "education": "string"
}

Важно:
- В summary напиши краткое профессиональное описание (2-3 предложения) о кандидате, НЕ копируй текст из experienceText
- В skills укажи 10-15 ключевых навыков для продакт-менеджера на русском языке: Product Strategy, Data Analysis, A/B тестирование, метрики (DAU, MAU, retention, LTV), Agile/Scrum, user research, market analysis, competitive analysis, roadmap planning, stakeholder management, requirements gathering, product launch, KPI tracking, user stories, backlog management
- В experience: проанализируй текст "{experienceText}" и создай структурированный массив с полями company, role, dates, achievements
- Если в тексте опыта нет четкой структуры, извлеки информацию о компаниях, должностях и достижениях
- Достижения (achievements) должны быть конкретными с цифрами и результатами
- Контакты и город: используй точные данные из формы "{contacts}" и "{city}"`
  }
};

function getPrompt(promptType) {
  return prompts[promptType] || prompts.product_designer;
}

function formatPrompt(prompt, data) {
  const { fullName, birthDate, city, contacts, experienceText, relocation, salary, education, age, vacancies, keywords } = data;
  
  const vacanciesText = vacancies.map(v => 
    `- ${v.title} (${v.url}): ${v.content?.slice(0, 1000) || 'Описание недоступно'}`
  ).join('\n');

  const keywordsText = keywords || '';

  // Format new fields
  const relocationText = relocation ? 'Да' : 'Нет';
  const salaryText = salary ? `${salary.toLocaleString('ru-RU')} руб.` : 'Не указана';
  const educationText = education || 'Не указано';
  const ageText = age ? `${age} лет` : 'Не указан';

  return prompt.userTemplate
    .replace('{fullName}', fullName || '')
    .replace('{birthDate}', birthDate || '')
    .replace('{age}', ageText)
    .replace('{city}', city || '')
    .replace('{contacts}', contacts || '')
    .replace('{experienceText}', experienceText || '')
    .replace('{relocation}', relocationText)
    .replace('{salary}', salaryText)
    .replace('{education}', educationText)
    .replace('{vacancies}', vacanciesText)
    .replace('{keywords}', keywordsText);
}

function getAllPrompts() {
  return Object.keys(prompts).map(key => ({
    id: key,
    name: prompts[key].name
  }));
}

module.exports = {
  getPrompt,
  formatPrompt,
  getAllPrompts
};