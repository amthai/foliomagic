const path = require('path');
const fs = require('fs/promises');
const puppeteer = require('puppeteer');

async function generateSamplePdf() {
  const templatePath = path.join(__dirname, '..', 'templates', 'resume.html');
  const html = await fs.readFile(templatePath, 'utf-8');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

module.exports = { generateSamplePdf };


