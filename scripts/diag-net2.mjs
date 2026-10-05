import { chromium } from 'playwright';
import os from 'os';
import path from 'path';

const userDataDir = path.join(os.tmpdir(), 'dcp-pw-net2-' + Date.now());
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  args: ['--no-proxy-server', '--no-sandbox', '--disable-gpu'],
});
const page = await ctx.newPage();

// 1. Is browser functional at all?
try {
  await page.goto('data:text/html,<h1>hi</h1>', { timeout: 5000 });
  console.log('data URL OK, title len:', (await page.content()).length);
} catch (e) {
  console.log('data URL FAIL', String(e).split('\n')[0]);
}

// 2. Does page.request (APIRequestContext) reach the server?
try {
  const r = await page.request.get('http://127.0.0.1:3001/', { timeout: 8000 });
  console.log('page.request status:', r.status());
} catch (e) {
  console.log('page.request FAIL', String(e).split('\n')[0]);
}

await ctx.close();
