import { chromium } from 'playwright';
import os from 'os';
import path from 'path';

const userDataDir = path.join(os.tmpdir(), 'dcp-pw-net-' + Date.now());
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  args: ['--no-proxy-server', '--no-sandbox', '--disable-gpu'],
});
const page = await ctx.newPage();
for (const url of ['http://192.168.0.180:3001/', 'http://127.0.0.1:3001/']) {
  try {
    const resp = await page.goto(url, { waitUntil: 'commit', timeout: 8000 });
    console.log('OK', url, resp && resp.status());
  } catch (e) {
    console.log('FAIL', url, String(e).split('\n')[0]);
  }
}
await ctx.close();
