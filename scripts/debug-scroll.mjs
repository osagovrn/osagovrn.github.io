import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 13'] });
const page = await context.newPage();
await page.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.trackGoal === 'function');

for (const hash of ['#services', '#benefits']) {
  const before = await page.evaluate((h) => {
    const id = h.slice(1);
    const el = document.getElementById(id);
    const rect = el.getBoundingClientRect();
    return {
      scrollY: Math.round(window.scrollY),
      absTop: Math.round(rect.top + window.scrollY),
      height: Math.round(rect.height)
    };
  }, hash);

  await page.evaluate((h) => {
    document.querySelector(`a[href="${h}"]`).click();
  }, hash);

  await page.waitForTimeout(2500);

  const after = await page.evaluate((h) => {
    const id = h.slice(1);
    const el = document.getElementById(id);
    const rect = el.getBoundingClientRect();
    const offset = Math.ceil(document.querySelector('header').getBoundingClientRect().height) + 8;
    return {
      hash: h,
      scrollY: Math.round(window.scrollY),
      top: Math.round(rect.top),
      expectedScroll: Math.round(rect.top + window.scrollY - offset),
      offset
    };
  }, hash);

  console.log({ hash, before, after });
}

await browser.close();
