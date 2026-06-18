import { chromium, devices } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3001';

const TARGETS = [
  { hash: '#services', id: 'services', titleId: null },
  { hash: '#benefits', id: 'benefits', titleId: null },
  { hash: '#check', id: 'check', titleId: 'check-title' },
  { hash: '#documents', id: 'documents', titleId: 'documents-title' },
  { hash: '#how-it-works', id: 'how-it-works', titleId: 'how-it-works-title' },
  { hash: '#oformit-polisa', id: 'oformit-polisa-target', titleId: null },
  { hash: '#faq', id: 'faq', titleId: 'faq-title' },
  { hash: '#cta', id: 'cta', titleId: null },
  { hash: '#partner-legal', id: 'partner-legal', titleId: 'partner-legal-title' },
];

const CLICK_SOURCES = [
  { name: 'desktop-nav', selector: (h) => `.desktop-nav a[href="${h}"]` },
  { name: 'hero-cta', selector: () => 'main .btn-primary[href="#oformit-polisa"]' },
  { name: 'mobile-sticky', selector: () => '.mobile-sticky-cta__order' },
  { name: 'footer-link', selector: (h) => `footer a[href="${h}"]` },
];

const viewports = [
  { name: 'mobile-s', width: 320, height: 568 },
  { name: 'mobile', ...devices['iPhone 13'] },
  { name: 'mobile-l', width: 430, height: 932 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'desktop-wide', width: 1920, height: 1080 },
];

const issues = [];

function add(issue) {
  issues.push(issue);
}

async function waitScrollEnd(page, ms = 2500) {
  await page.waitForFunction(
    () => {
      return new Promise((resolve) => {
        let last = window.scrollY;
        let stable = 0;
        const check = () => {
          if (Math.abs(window.scrollY - last) < 1) {
            stable += 1;
            if (stable >= 4) return resolve(true);
          } else {
            stable = 0;
            last = window.scrollY;
          }
          requestAnimationFrame(check);
        };
        check();
        setTimeout(() => resolve(true), 2200);
      });
    },
    null,
    { timeout: ms }
  );
  await page.waitForTimeout(150);
}

async function measureScroll(page, targetId, titleId) {
  return page.evaluate(({ targetId, titleId }) => {
    const header = document.querySelector('header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const sticky = document.getElementById('mobile-sticky-cta');
    const stickyVisible = sticky && !sticky.hidden && sticky.getBoundingClientRect().height > 0;
    const stickyTop = stickyVisible ? sticky.getBoundingClientRect().top : window.innerHeight;
    const el = document.getElementById(targetId);
    if (!el) return { ok: false, reason: 'missing target ' + targetId };
    const r = el.getBoundingClientRect();
    const title = titleId ? document.getElementById(titleId) : el.querySelector('h2, h3');
    const tr = title ? title.getBoundingClientRect() : r;
    const refTop = tr.top;
    const topOk = refTop >= headerBottom - 6;
    const notUnderSticky = refTop <= stickyTop - 12;
    const notAboveView = refTop < window.innerHeight * 0.85;
    return {
      ok: topOk && notUnderSticky && notAboveView,
      top: Math.round(refTop),
      headerBottom: Math.round(headerBottom),
      stickyTop: Math.round(stickyTop),
      scrollY: Math.round(window.scrollY),
      targetId,
      titleText: title ? title.textContent.trim().slice(0, 40) : null,
    };
  }, { targetId, titleId });
}

const browser = await chromium.launch({ headless: true });

for (const vp of viewports) {
  const context = await browser.newContext(
    vp.name === 'mobile'
      ? { ...devices['iPhone 13'] }
      : { viewport: { width: vp.width, height: vp.height } }
  );
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => typeof window.scrollToHash === 'function' || typeof window.trackGoal === 'function');

  for (const t of TARGETS) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    const link = await page.$(`.desktop-nav a[href="${t.hash}"], a.mobile-nav-link[href="${t.hash}"]`).catch(() => null);
    const href = t.hash;
    if (vp.width >= 1024) {
      const nav = await page.$(`.desktop-nav a[href="${href}"]`);
      if (nav) {
        await nav.click();
      } else {
        await page.evaluate((h) => {
          const a = document.querySelector(`a[href="${h}"]`);
          if (a) a.click();
        }, href);
      }
    } else if (t.hash !== '#partner-legal') {
      await page.click('#menu-toggle');
      await page.waitForTimeout(250);
      const mlink = await page.$(`a.mobile-nav-link[href="${href}"]`);
      if (mlink) await mlink.click();
      else add({ vp: vp.name, hash: t.hash, reason: 'mobile link missing' });
    } else {
      await page.evaluate((h) => {
        const a = document.querySelector(`a[href="${h}"]`);
        if (a) a.click();
      }, href);
    }

    await waitScrollEnd(page);
    const result = await measureScroll(page, t.id, t.titleId);
    if (!result.ok) {
      add({ vp: vp.name, hash: t.hash, source: 'nav', ...result });
    }
  }

  // Hero CTA from top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const heroBtn = await page.$('main .btn-primary[href="#oformit-polisa"]');
  if (heroBtn) {
    await heroBtn.click();
    await waitScrollEnd(page);
    const result = await measureScroll(page, 'oformit-polisa-target', null);
    if (!result.ok) add({ vp: vp.name, hash: '#oformit-polisa', source: 'hero-cta', ...result });
  }

  // Mobile sticky after scroll down
  if (vp.width < 768) {
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(400);
    const sticky = await page.$('.mobile-sticky-cta__order');
    if (sticky) {
      const visible = await sticky.isVisible();
      if (visible) {
        await sticky.click();
        await waitScrollEnd(page);
        const result = await measureScroll(page, 'oformit-polisa-target', null);
        if (!result.ok) add({ vp: vp.name, hash: '#oformit-polisa', source: 'sticky-cta', ...result });
      }
    }
  }

  await context.close();
}

await browser.close();

console.log('SCROLL_FULL_ISSUES', issues.length);
issues.forEach((i) => console.log(JSON.stringify(i)));
process.exit(issues.length ? 1 : 0);
