import { chromium } from 'playwright';
import os from 'os';
import path from 'path';

const userDataDir = path.join(os.tmpdir(), 'dcp-pw-net3-' + Date.now());
const ctx = await chromium.launchPersistentContext(userDataDir, {
  headless: true,
  args: ['--no-proxy-server', '--no-sandbox', '--disable-gpu'],
});
const page = await ctx.newPage();
page.on('requestfailed', (r) => console.log('reqfailed', r.url(), r.failure() && r.failure().errorText));
for (const url of ['http://example.com/', 'https://example.com/']) {
  try {
    const resp = await page.goto(url, { waitUntil: 'commit', timeout: 10000 });
    console.log('OK', url, resp && resp.status());
  } catch (e) {
    console.log('FAIL', url, String(e).split('\n')[0]);
  }
}
await ctx.close();
