import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(path.dirname(fileURLToPath(import.meta.url))), '..');
const htmlFiles = ['index.html', 'privacy.html', '404.html', 'voronezh.html'];
const issues = [];

function extractHrefs(file) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  return [...content.matchAll(/href=["']([^"']+)["']/gi)].map((m) => ({ file, href: m[1] }));
}

const allIds = new Set();
for (const f of htmlFiles) {
  const c = fs.readFileSync(path.join(root, f), 'utf8');
  for (const m of c.matchAll(/id=["']([^"']+)["']/g)) allIds.add(m[1]);
}

const hashLinks = [];
const fileLinks = [];
const externalLinks = new Set();

for (const f of htmlFiles) {
  for (const { file, href } of extractHrefs(f)) {
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      externalLinks.add(href.split('?')[0]);
      continue;
    }
    if (href.startsWith('#')) {
      const id = decodeURIComponent(href.slice(1));
      hashLinks.push({ file, href, id });
      if (file === 'index.html' && id && !allIds.has(id)) {
        issues.push({ file, href, problem: `missing target id: ${id}` });
      }
      continue;
    }
    const clean = href.split('?')[0].split('#')[0];
    if (clean === '/') {
      fileLinks.push({ file, href: clean, ok: fs.existsSync(path.join(root, 'index.html')) });
      if (!fs.existsSync(path.join(root, 'index.html'))) {
        issues.push({ file, href, problem: 'missing index.html' });
      }
      continue;
    }
    const target = path.join(root, clean.replace(/^\//, ''));
    const ok = fs.existsSync(target);
    fileLinks.push({ file, href: clean, ok });
    if (!ok) issues.push({ file, href, problem: `missing file: ${clean}` });
  }
}

const assets = [
  'assets/site.config.js', 'assets/site.js', 'assets/env.js', 'assets/legal.js',
  'favicon.ico', 'favicon.svg', 'sitemap.xml', 'llms.txt', 'og-image.png', 'og-image.svg'
];
for (const a of assets) {
  if (!fs.existsSync(path.join(root, a))) {
    issues.push({ file: 'assets', href: a, problem: 'missing asset' });
  }
}

function get(base, urlPath) {
  return new Promise((resolve) => {
    http.get(base + urlPath, (res) => {
      res.resume();
      resolve({ urlPath, status: res.statusCode });
    }).on('error', (e) => resolve({ urlPath, status: 'ERR', err: e.message }));
  });
}

const base = process.argv[2] || 'http://127.0.0.1:3001';
const pages = ['/', '/privacy.html', '/404.html', '/assets/site.js', '/favicon.ico', '/favicon.svg', '/llms.txt', '/sitemap.xml', '/og-image.png'];
const httpResults = [];
for (const p of pages) {
  const r = await get(base, p);
  httpResults.push(r);
  if (r.status !== 200 && r.status !== 301) issues.push({ file: 'server', href: p, problem: `HTTP ${r.status}` });
}

console.log('=== LINK AUDIT ===');
console.log('Hash links (index):', hashLinks.filter((x) => x.file === 'index.html').length);
console.log('Unique hash targets:', [...new Set(hashLinks.map((x) => x.id))].join(', '));
console.log('File links:', fileLinks.length);
console.log('External unique:', externalLinks.size);
console.log('HTTP checks:', httpResults.map((r) => `${r.status} ${r.urlPath}`).join(' | '));
console.log('Issues:', issues.length);
for (const i of issues) console.log(JSON.stringify(i));

process.exit(issues.length ? 1 : 0);
