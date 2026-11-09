import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const results = [];
try {
  for (const path of ['/', '/technology']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
    await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' });
    results.push(await page.evaluate(() => ({
      path: location.pathname,
      scriptBytes: performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'script').reduce((n, r) => n + r.encodedBodySize, 0),
      scripts: performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'script').length,
    })));
    if (path === '/') {
      await page.waitForFunction(() => {
        const video = document.querySelector('video');
        return video && video.readyState >= 2 && !video.paused;
      });
      await page.locator('#neticeler').evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('video')?.paused);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForFunction(() => !document.querySelector('video')?.paused);
      const origin = await page.evaluate(() => performance.timeOrigin);
      await page.locator('#main-navigation').getByRole('link', { name: 'Texnologiya', exact: true }).click();
      await page.waitForURL('**/technology');
      assert.equal(await page.evaluate(() => performance.timeOrigin), origin, 'Navigation must not reload the whole document');
      await page.locator('#main-navigation').getByRole('link', { name: 'Nəticələr', exact: true }).click();
      await page.waitForURL('**/#neticeler');
      await page.waitForFunction(() => {
        const section = document.querySelector('#neticeler').getBoundingClientRect();
        return section.top >= 0 && section.top < 150;
      });
    }
    await page.close();
  }
  for (const contextOptions of [{ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }]) {
    const page = await browser.newPage(contextOptions);
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    const videoCount = await page.locator('video').count();
    if (contextOptions.reducedMotion === 'reduce') assert.equal(videoCount, 0, 'Reduced-motion pages must not load a video');
    else {
      assert.equal(videoCount, 1, 'Mobile should load the hero video');
      await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2 && !document.querySelector('video')?.paused);
    }
    await page.close();
  }
  await writeFile('artifacts/performance-after.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ ok: true, results, video: 'pauses offscreen and resumes in view', navigation: 'no document reload' }, null, 2));
} finally { await browser.close(); }
