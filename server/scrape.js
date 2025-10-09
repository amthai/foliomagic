const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const HH_SEARCH_URL = 'https://hh.ru/search/vacancy';

async function searchHhVacancies(query, area) {
  const url = new URL(HH_SEARCH_URL);
  url.searchParams.set('text', query);
  // Moscow=1, SPB=2; оставляем опционально
  if (area) url.searchParams.set('area', String(area));
  url.searchParams.set('order_by', 'publication_time');
  url.searchParams.set('search_field', 'name');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 ResumeGeneratorBot',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });
  if (!res.ok) throw new Error(`HH search failed: ${res.status}`);
  const html = await res.text();
  const dom = new JSDOM(html, { url: url.toString() });
  const document = dom.window.document;
  const links = Array.from(document.querySelectorAll('a[data-qa="serp-item__title"]'))
    .map(a => a.href)
    .filter(Boolean)
    .slice(0, 10);
  return links;
}

async function fetchReadable(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 ResumeGeneratorBot',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return {
    url,
    title: article?.title || '',
    content: article?.textContent || '',
  };
}

async function scrapeHhForRole(role, area) {
  const links = await searchHhVacancies(role, area);
  const items = [];
  for (const href of links) {
    try {
      const item = await fetchReadable(href);
      items.push(item);
    } catch (_) {
      // skip silently
    }
  }
  return items;
}

// Функция для парсинга конкретной вакансии по URL
async function scrapeSpecificVacancy(vacancyUrl) {
  try {
    console.log('Парсинг вакансии по URL:', vacancyUrl);
    const item = await fetchReadable(vacancyUrl);
    console.log('Успешно спарсили вакансию:', item.title);
    return item;
  } catch (error) {
    console.error('Ошибка парсинга вакансии:', error);
    throw new Error(`Не удалось спарсить вакансию: ${error.message}`);
  }
}

module.exports = { scrapeHhForRole, scrapeSpecificVacancy };


