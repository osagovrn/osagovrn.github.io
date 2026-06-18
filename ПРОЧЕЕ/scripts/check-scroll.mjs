import { chromium, devices } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3001';
const NAV_HASHES = [
  '#services', '#benefits', '#check', '#documents',
  '#oformit-polisa', '#faq', '#cta', '#how-it-works',
  '#partner-legal'
];

const viewports = [
  { name: 'mobile', ...devices['iPhone 13'] },
  { name: 'tablet', viewport: { width: 834, height: 1112 } },
  { name: 'desktop', viewport: { width: 1366, height: 900 } }
];

const issues = [];

function targetId(hash) {
  return hash === '#oformit-polisa' ? 'oformit-polisa-target' : hash.slice(1);
}

async function assertScroll(page, label, hash) {
  await page.evaluate((h) => {
    const link = document.querySelector(`a[href="${h}"]`);
    if (link) link.click();
  }, hash);
  await page.waitForTimeout(1800);

  const result = await page.evaluate((h) => {
    const header = document.querySelector('header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const sticky = document.getElementById('mobile-sticky-cta');
    const stickyVisible = sticky && !sticky.hidden && sticky.getBoundingClientRect().height > 0;
    const stickyTop = stickyVisible ? sticky.getBoundingClientRect().top : window.innerHeight;
    const id = h === '#oformit-polisa' ? 'oformit-polisa-target' : h.slice(1);
    const section = document.getElementById(id);
    const el = section ? (section.querySelector('h1, h2, h3') || section) : null;
    if (!el) return { ok: false, reason: 'missing target' };
    const r = el.getBoundingClientRect();
    const topOk = r.top >= headerBottom - 8;
    const bottomOk = r.top <= stickyTop - 8;
    return {
      ok: topOk && bottomOk,
      top: Math.round(r.top),
      headerBottom: Math.round(headerBottom),
      stickyTop: Math.round(stickyTop),
      id
    };
  }, hash);

  if (!result.ok) issues.push({ label, hash, ...result });
}

const browser = await chromium.launch({ headless: true });
for (const vp of viewports) {
  const context = await browser.newContext(
    vp.name === 'mobile'
      ? { ...devices['iPhone 13'] }
      : { viewport: vp.viewport }
  );
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForFunction(() => typeof window.trackGoal === 'function');

  for (const hash of NAV_HASHES) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    if (vp.name === 'mobile' && hash === '#partner-legal') {
      await page.evaluate((h) => {
        const link = document.querySelector(`a[href="${h}"]`);
        if (link) link.click();
      }, hash);
    } else if (vp.name === 'mobile') {
      await page.click('#menu-toggle');
      await page.waitForTimeout(250);
      await page.click(`a.mobile-nav-link[href="${hash}"]`);
    } else {
      await page.evaluate((h) => {
        const link = document.querySelector(`.desktop-nav a[href="${h}"]`) || document.querySelector(`a[href="${h}"]`);
        if (link) link.click();
      }, hash);
    }

    await assertScroll(page, `${vp.name}:${hash}`, hash);
  }

  // Mobile menu path
  if (vp.name === 'mobile') {
    await page.click('#menu-toggle');
    await page.waitForTimeout(200);
    await page.click('a.mobile-nav-link[href="#documents"]');
    await page.waitForTimeout(1800);
    const menuClosed = await page.evaluate(() => !document.getElementById('mobile-menu').classList.contains('open'));
    const docVisible = await page.evaluate(() => {
      const el = document.getElementById('documents-title') || document.getElementById('documents');
      const header = document.querySelector('header');
      if (!el || !header) return false;
      const r = el.getBoundingClientRect();
      return r.top >= header.getBoundingClientRect().bottom - 8;
    });
    if (!menuClosed || !docVisible) {
      issues.push({ label: 'mobile-menu-documents', menuClosed, docVisible });
    }
  }

  await context.close();
}

await browser.close();

console.log('SCROLL_ISSUES', issues.length);
issues.forEach((i) => console.log(JSON.stringify(i)));
process.exit(issues.length ? 1 : 0);
