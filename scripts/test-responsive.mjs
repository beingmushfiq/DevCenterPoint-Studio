import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Find all buttons in header/nav to test interactions
  const buttons = await page.$$('header button, nav button');
  console.log(`Found ${buttons.length} navigation buttons`);
  
  if (buttons.length > 0) {
    for (const btn of buttons) {
      try {
        const isVisible = await btn.isVisible();
        if (isVisible) {
          await btn.click({ timeout: 1000 });
          await page.waitForTimeout(300);
        }
      } catch (e) {}
    }
  }

  const check = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const scrollW = document.documentElement.scrollWidth;
    const bodyScrollW = document.body.scrollWidth;
    return {
      docW,
      scrollW,
      bodyScrollW,
      hasOverflow: scrollW > docW || bodyScrollW > docW
    };
  });

  console.log('INTERACTION_RESPONSIVE_CHECK:', JSON.stringify(check, null, 2));
  await browser.close();
}

run().catch(console.error);
