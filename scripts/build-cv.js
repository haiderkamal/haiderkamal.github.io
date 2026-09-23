// Renders assets/cv.html to assets/Haider-Kamal-CV.pdf via headless Chrome.
//   node scripts/build-cv.js
// Needs puppeteer-core and a local Chrome; set CHROME_PATH to override.
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME = process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = path.resolve(__dirname, '..');
const SRC = 'file:///' + path.join(ROOT, 'assets', 'cv.html').replace(/\\/g, '/');
const OUT = path.join(ROOT, 'assets', 'Haider-Kamal-CV.pdf');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none']
  });
  const page = await browser.newPage();
  await page.goto(SRC, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 600));

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true
  });

  const pages = await page.evaluate(() => document.querySelectorAll('.page').length);
  console.log('wrote ' + OUT + ' (' + pages + ' pages)');
  await browser.close();
})();
