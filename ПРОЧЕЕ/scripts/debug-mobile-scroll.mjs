import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ ...devices['iPhone 13'] });
await page.goto('http://127.0.0.1:3001/', { waitUntil: 'domcontentloaded' });
await page.click('#menu-toggle');
await page.waitForTimeout(300);
const openH = await page.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
await page.click('a.mobile-nav-link[href="#faq"]');
let prev = 0;
for (const ms of [50, 150, 400, 800, 2500]) {
  await page.waitForTimeout(ms === 50 ? 50 : ms - prev);
  prev = ms;
  const snap = await page.evaluate(() => {
    const header = document.querySelector('header');
    const title = document.getElementById('faq-title');
    return {
      headerH: Math.round(header.getBoundingClientRect().height),
      headerBottom: Math.round(header.getBoundingClientRect().bottom),
      faqTop: title ? Math.round(title.getBoundingClientRect().top) : null,
      scrollY: Math.round(window.scrollY),
      menuOpen: document.getElementById('mobile-menu').classList.contains('open'),
    };
  });
  console.log('after', ms, 'ms', JSON.stringify(snap));
}
await browser.close();
