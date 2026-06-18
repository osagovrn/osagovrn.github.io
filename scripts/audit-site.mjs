import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const BASE = process.argv[2] || 'http://127.0.0.1:3001';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const issues = [];

function add(cat, detail) {
  issues.push({ cat, detail });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...devices['iPhone 13'],
  permissions: ['clipboard-read', 'clipboard-write'],
});
const page = await context.newPage();

const t0 = Date.now();
await page.goto(BASE + '/', { waitUntil: 'load', timeout: 90000 });
const loadMs = Date.now() - t0;

const perf = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const resources = performance.getEntriesByType('resource');
  const heavy = resources
    .filter((r) => r.transferSize > 100000)
    .map((r) => ({ name: r.name.split('/').slice(-2).join('/'), kb: Math.round(r.transferSize / 1024) }))
    .sort((a, b) => b.kb - a.kb)
    .slice(0, 8);
  return {
    domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
    load: nav ? Math.round(nav.loadEventEnd) : null,
    heavy,
  };
});

// Buttons and interactive elements
await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForFunction(() => typeof window.trackGoal === 'function');

await page.click('#faq-toggle');
await page.waitForTimeout(150);
const faqOpen = await page.evaluate(() => {
  const m = document.getElementById('faq-more');
  return m && !m.hidden;
});
if (!faqOpen) add('buttons', 'FAQ toggle does not open');

await page.click('#tab-kbm');
await page.waitForTimeout(100);
const kbmActive = await page.evaluate(() => document.getElementById('panel-kbm')?.classList.contains('active'));
if (!kbmActive) add('buttons', 'KBM tab does not activate');

await page.click('#widget-share-copy');
await page.waitForTimeout(100);
const copied = await page.evaluate(() => document.getElementById('widget-share-copy')?.textContent === 'Скопировано');
if (!copied) add('buttons', 'Widget share copy button feedback missing');

await page.click('#menu-toggle');
await page.waitForTimeout(150);
const menuOpen = await page.evaluate(() => document.getElementById('mobile-menu')?.classList.contains('open'));
if (!menuOpen) add('buttons', 'Mobile menu does not open');

// Widget iframe present
const widget = await page.evaluate(() => {
  const f = document.getElementById('ppdwi');
  return f ? { src: f.src, w: f.offsetWidth, h: f.offsetHeight } : null;
});
if (!widget || !widget.src.includes('79694340')) add('widget', 'Pampadu iframe missing or wrong ID');
if (widget && widget.h < 100) add('widget', `iframe height too small: ${widget.h}`);

// Static file checks
for (const rel of ['og-image.png', 'favicon.ico', 'assets/tailwind.css']) {
  if (!fs.existsSync(path.join(root, rel))) {
    add('assets', `missing file: ${rel}`);
  }
}

// og meta consistency
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (html.includes("og-image.png") && !fs.existsSync(path.join(root, 'og-image.png'))) {
  add('seo', 'index.html references og-image.png but file missing');
}
if (html.includes('cdn.tailwindcss.com') && fs.existsSync(path.join(root, 'assets/tailwind.css'))) {
  add('perf', 'Tailwind CDN used while local assets/tailwind.css exists');
}

await context.close();
await browser.close();

console.log('=== SITE AUDIT ===');
console.log('Load (wall ms):', loadMs);
console.log('Navigation:', JSON.stringify(perf));
console.log('Widget:', JSON.stringify(widget));
console.log('Issues:', issues.length);
issues.forEach((i) => console.log(JSON.stringify(i)));
process.exit(issues.length ? 1 : 0);
