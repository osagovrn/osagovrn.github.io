import { chromium, webkit, firefox, devices } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3001';
const issues = [];

function add(platform, detail) {
  issues.push({ platform, detail });
}

const HASHES = ['#services', '#benefits', '#check', '#oformit-polisa', '#faq', '#cta'];

const platforms = [
  { name: 'apple-iphone-safari', browser: webkit, context: { ...devices['iPhone 13'] } },
  { name: 'apple-iphone-se', browser: webkit, context: { ...devices['iPhone SE'] } },
  { name: 'apple-ipad', browser: webkit, context: { ...devices['iPad Pro 11'] } },
  { name: 'linux-firefox-desktop', browser: firefox, context: { viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0' } },
  { name: 'linux-chrome-desktop', browser: chromium, context: { viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } },
];

async function waitScroll(page) {
  await page.waitForTimeout(1600);
}

async function measureTarget(page, hash) {
  return page.evaluate((h) => {
    const header = document.querySelector('header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    const id = h === '#oformit-polisa' ? 'oformit-polisa-target' : h.slice(1);
    const section = document.getElementById(id);
    const el = section ? (section.querySelector('h1, h2, h3') || section) : null;
    if (!el) return { ok: false, reason: 'missing ' + id };
    const top = el.getBoundingClientRect().top;
    const doc = document.documentElement;
    return {
      ok: top >= headerBottom - 10 && doc.scrollWidth <= doc.clientWidth + 1,
      top: Math.round(top),
      headerBottom: Math.round(headerBottom),
      overflow: doc.scrollWidth > doc.clientWidth + 1,
    };
  }, hash);
}

for (const pf of platforms) {
  const browser = await pf.browser.launch({ headless: true });
  const context = await browser.newContext(pf.context);
  const page = await context.newPage();
  const jsErrors = [];
  page.on('pageerror', (e) => jsErrors.push(String(e)));

  try {
    const res = await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!res || res.status() !== 200) add(pf.name, 'HTTP ' + (res && res.status()));

    const layout = await page.evaluate(() => ({
      tailwind: !!document.getElementById('tailwind-local')?.sheet || !!document.getElementById('tailwind-cdn'),
      cssLoaded: getComputedStyle(document.querySelector('header')).position === 'fixed',
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }));
    if (layout.overflow) add(pf.name, 'horizontal overflow');
    if (!layout.cssLoaded) add(pf.name, 'header styles missing');

    const vw = pf.context.viewport?.width || (pf.context.defaultBrowserType === 'webkit' && pf.name.includes('ipad') ? 834 : 375);
    const useMobileNav = vw < 1024;

    for (const hash of HASHES) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);

      if (useMobileNav) {
        const toggle = page.locator('#menu-toggle');
        await toggle.scrollIntoViewIfNeeded();
        try {
          await toggle.click({ timeout: 5000 });
        } catch (e) {
          await page.evaluate(() => document.getElementById('menu-toggle')?.click());
        }
        await page.waitForTimeout(300);
        const link = page.locator(`a.mobile-nav-link[href="${hash}"]`);
        if (await link.count()) await link.click();
        else await page.evaluate((h) => document.querySelector(`a[href="${h}"]`)?.click(), hash);
      } else {
        await page.locator(`.desktop-nav a[href="${hash}"]`).first().click({ timeout: 10000 });
      }

      await waitScroll(page);
      const m = await measureTarget(page, hash);
      if (!m.ok) add(pf.name, `scroll ${hash} top=${m.top} header=${m.headerBottom}`);
    }

    // Hero CTA
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    await page.locator('main .btn-primary[href="#oformit-polisa"]').first().click();
    await waitScroll(page);
    const order = await measureTarget(page, '#oformit-polisa');
    if (!order.ok) add(pf.name, `hero-cta top=${order.top}`);

    // FAQ toggle
    await page.evaluate(() => window.scrollTo(0, document.getElementById('faq')?.offsetTop || 0));
    await page.waitForTimeout(300);
    await page.click('#faq-toggle');
    await page.waitForTimeout(200);
    const faqOpen = await page.evaluate(() => {
      const m = document.getElementById('faq-more');
      return m && !m.hidden;
    });
    if (!faqOpen) add(pf.name, 'FAQ toggle failed');

    if (jsErrors.length) add(pf.name, 'JS: ' + jsErrors.slice(0, 2).join(' | '));
  } catch (e) {
    add(pf.name, String(e.message || e).slice(0, 120));
  }

  await context.close();
  await browser.close();
}

console.log('PLATFORM_ISSUES', issues.length);
issues.forEach((i) => console.log(JSON.stringify(i)));
process.exit(issues.length ? 1 : 0);
