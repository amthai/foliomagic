const path = require('path');
const fs = require('fs/promises');
const puppeteer = require('puppeteer');

async function renderResumeHtml(resume) {
  const templatePath = path.join(__dirname, '..', 'templates', 'resume.html');
  let html = await fs.readFile(templatePath, 'utf-8');
  
  // Заменяем основные поля
  html = html
    .replace(/<h1>.*?<\/h1>/, `<h1>${escapeHtml(resume.fullName || '')}</h1>`)
    .replace(/Product Designer/, escapeHtml(resume.title || ''))
    .replace(/Designer с опытом 5\+ лет в продуктовых компаниях, специализация — дизайн систем и UX для сложных сценариев\./, escapeHtml(resume.summary || ''));
  
  // Заменяем контакты и город
  const contactsAndCity = [resume.contacts, resume.city].filter(Boolean).join(' · ');
  html = html.replace(/email@example\.com · @telegram/, escapeHtml(contactsAndCity || ''));
  
  // Заменяем новые поля
  if (resume.age) {
    const ageText = `${resume.age} лет`;
    html = html.replace(/<span id="age">.*?<\/span>/, `<span id="age">${escapeHtml(ageText)}</span>`);
  } else {
    html = html.replace(/<span id="age">.*?<\/span>/, `<span id="age">Не указан</span>`);
  }
  
  if (resume.relocation !== undefined) {
    const relocationText = resume.relocation ? 'Да' : 'Нет';
    html = html.replace(/<span id="relocation">.*?<\/span>/, `<span id="relocation">${escapeHtml(relocationText)}</span>`);
  }
  
  if (resume.salary) {
    const salaryText = `${resume.salary.toLocaleString('ru-RU')} руб.`;
    html = html.replace(/<span id="salary">.*?<\/span>/, `<span id="salary">${escapeHtml(salaryText)}</span>`);
  } else {
    html = html.replace(/<span id="salary">.*?<\/span>/, `<span id="salary">Не указана</span>`);
  }
  
  if (resume.education) {
    const educationMap = {
      'no_education': 'Нет образования',
      'secondary': 'Среднее',
      'secondary_special': 'Среднее специальное',
      'higher_incomplete': 'Высшее не оконченное',
      'higher': 'Высшее'
    };
    const educationText = educationMap[resume.education] || resume.education;
    html = html.replace(/<span id="education">.*?<\/span>/, `<span id="education">${escapeHtml(educationText)}</span>`);
  } else {
    html = html.replace(/<span id="education">.*?<\/span>/, `<span id="education">Не указано</span>`);
  }
  
  // Заменяем секцию опыта работы
  if (resume.experience) {
    let experienceHtml;
    if (Array.isArray(resume.experience)) {
      // Если это массив объектов опыта
      experienceHtml = resume.experience.map(exp => {
        let html = `<li><strong>${escapeHtml(exp.role)}</strong>, ${escapeHtml(exp.company)} · ${escapeHtml(exp.dates)}</li>`;
        if (exp.achievements && exp.achievements.length > 0) {
          const achievementsHtml = exp.achievements.map(achievement => 
            `<li>${escapeHtml(achievement)}</li>`
          ).join('\n');
          html += `<ul style="margin-top: 4px; padding-left: 18px;">\n${achievementsHtml}\n</ul>`;
        }
        return html;
      }).join('\n');
    } else {
      // Если это строка с описанием опыта
      experienceHtml = `<li>${escapeHtml(resume.experience)}</li>`;
    }
    
    // Находим секцию опыта работы и заменяем весь список
    html = html.replace(
      /<h2>Опыт работы<\/h2>\s*<ul>[\s\S]*?<\/ul>/,
      `<h2>Опыт работы</h2>\n<ul>\n${experienceHtml}\n</ul>`
    );
  }
  
  // Заменяем секцию навыков
  if (resume.skills && resume.skills.length > 0) {
    const skillsHtml = resume.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join('\n');
    // Находим секцию навыков и заменяем весь список
    html = html.replace(
      /<h2>Навыки<\/h2>\s*<ul>[\s\S]*?<\/ul>/,
      `<h2>Навыки</h2>\n<ul>\n${skillsHtml}\n</ul>`
    );
  }
  
  return html;
}

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    timeout: 60000,
    protocolTimeout: 60000
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
      timeout: 30000
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;');
}

module.exports = { renderResumeHtml, generatePdfFromHtml };


