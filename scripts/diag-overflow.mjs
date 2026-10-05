import { chromium } from 'playwright';
import os from 'os';
import path from 'path';
import fs from 'fs';

const DIST = path.resolve('dist');
const ORIGIN = 'https://dcp.local';
const WIDTHS = [320, 375, 390, 414, 768, 1024, 1440, 1920];

const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png',
  '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff',
};

function readAsset(p) {
  try { return fs.readFileSync(p); } catch { return null; }
}

const userDataDir = path.join(os.tmpdir(), 'dcp-pw-ovf-' + Date.now());
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  args: ['--no-proxy-server', '--no-sandbox', '--disable-gpu'],
});
const page = await ctx.newPage();

page.on('console', (m) => { if (m.type() === 'error') console.log('  [console.error]', m.text().slice(0, 200)); });
page.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 200)));

await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  let filePath = path.join(DIST, pathname);
  let body = readAsset(filePath);
  if (body === null) {
    body = readAsset(path.join(DIST, 'index.html'));
    filePath = path.join(DIST, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  await route.fulfill({ status: 200, body, headers: { 'content-type': mime[ext] || 'application/octet-stream' } });
});

await page.goto(ORIGIN + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(5000);

const results = [];
for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const overflowRight = r.right - docW;
      const overflowLeft = r.left;
      if (overflowRight > 1 || overflowLeft < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 140),
          id: el.id || '',
          left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
          over: Math.round(Math.max(overflowRight, -overflowLeft)),
          text: (el.textContent || '').trim().slice(0, 50).replace(/\s+/g, ' '),
        });
      }
    }
    offenders.sort((a, b) => b.over - a.over);
    return { docW, scrollW, offenders: offenders.slice(0, 15) };
  });
  results.push({ width, ...info });
  console.log(`\n=== ${width}px === docW=${info.docW} scrollW=${info.scrollW} overflow=${info.scrollW > info.docW}`);
  for (const o of info.offenders) {
    console.log(`  over=${o.over}px <${o.tag}${o.id ? '#' + o.id : ''}> cls="${o.cls}" w=${o.width} L=${o.left} R=${o.right} txt="${o.text}"`);
  }
}

await ctx.close();
console.log('\nOVERFLOW_SUMMARY:' + JSON.stringify(results.map(r => ({ width: r.width, docW: r.docW, scrollW: r.scrollW, hasOverflow: r.scrollW > r.docW }))));
