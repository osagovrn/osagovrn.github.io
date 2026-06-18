import { chromium, devices } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3001';
const viewports = [
  { name: 'mobile-s', width: 320, height: 568 },
  { name: 'mobile', ...devices['iPhone 13'] },
  { name: 'mobile-l', width: 430, height: 932 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'desktop-wide', width: 1920, height: 1080 }
];

const issues = [];

function add(name, detail) {
  issues.push({ name, detail });
}

const browser = await chromium.launch({ headless: true });

for (const vp of viewports) {
  const context = await browser.newContext(
    vp.name === 'mobile'
      ? { ...devices['iPhone 13'] }
      : { viewport: { width: vp.width, height: vp.height } }
  );
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/recaptcha|gstatic\.com|ppdw|pampadu|Failed to load resource/i.test(text)) return;
    consoleErrors.push(text);
  });

  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 });

  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth + 1
    };
  });
  if (layout.hasHorizontalOverflow) {
    add(`${vp.name}:overflow`, `scrollWidth ${layout.scrollWidth} > ${layout.clientWidth}`);
  }

  const brokenAnchors = await page.evaluate(() => {
    return [...document.querySelectorAll('a[href^="#"]')]
      .filter((a) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return false;
        const id = decodeURIComponent(href.slice(1));
        return id && !document.getElementById(id);
      })
      .map((a) => a.getAttribute('href'));
  });
  if (brokenAnchors.length) {
    add(`${vp.name}:broken-anchors`, brokenAnchors.join(', '));
  }

  await context.close();
  if (consoleErrors.length) {
    add(`${vp.name}:js-errors`, consoleErrors.slice(0, 3).join(' | '));
  }
}

// FAQ toggle
{
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  await page.goto(BASE + '/#faq', { waitUntil: 'networkidle' });
  const more = page.locator('#faq-more');
  await page.click('#faq-toggle');
  await page.waitForTimeout(200);
  const visible = await more.evaluate((el) => !el.hidden && !el.classList.contains('hidden'));
  if (!visible) add('faq-toggle:open', 'faq-more not visible after click');
  await page.click('#faq-toggle');
  await page.waitForTimeout(200);
  const hidden = await more.evaluate((el) => el.hidden && el.classList.contains('hidden'));
  if (!hidden) add('faq-toggle:close', 'faq-more not hidden after second click');
  await context.close();
}

// Favicon + assets
{
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const path of ['/favicon.ico', '/favicon.svg', '/assets/site.js']) {
    const res = await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    if (!res || res.status() !== 200) add('asset:' + path, String(res && res.status()));
  }
  await context.close();
}

await browser.close();

console.log('RESPONSIVE_ISSUES', issues.length);
issues.forEach((i) => console.log(JSON.stringify(i)));
process.exit(issues.length ? 1 : 0);
