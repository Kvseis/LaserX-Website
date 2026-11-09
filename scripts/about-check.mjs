import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});
await mkdir('artifacts', { recursive: true });
const results = [];
try {
  for (const width of [390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const locale of ['az', 'en', 'ru', 'tr']) {
      const prefix = locale === 'az' ? '' : `/${locale}`;
      const response = await page.goto(`${baseUrl}${prefix}/about`, { waitUntil: 'load', timeout: 60000 });
      if (response.status() !== 200) throw Error(`${locale}: about route failed`);
      await page.evaluate(() => document.fonts.ready);
      if (await page.locator('h1').count() !== 1 || await page.locator('html').getAttribute('lang') !== locale) {
        throw Error(`${locale}: heading or language missing`);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 1) throw Error(`${locale}/${width}: overflow ${overflow}`);
      const nav = await page.locator('#main-navigation a').evaluateAll((links) => links.map((link) => ({ text: link.textContent, href: link.getAttribute('href') })));
      if (nav.length !== 5 || nav[0].href !== `${prefix}/about`) throw Error('About navigation missing');
      const flagLinks = await page.locator('.language-switch li a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
      if (flagLinks.join(',') !== '/about,/ru/about,/en/about,/tr/about') throw Error('Language switch loses the About page');
      if (width < 1101) {
        await page.locator('.menu-button').click();
        await page.locator(`#main-navigation a[href="${prefix}/about"]`).click();
        await page.waitForURL(`**${prefix}/about`);
      }
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((img) => img.decode());
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `artifacts/about-${locale}-${width}.png`, fullPage: true });
      if (errors.length) throw Error(errors.join('\n'));
      results.push({ locale, width, overflow });
    }
    await page.close();
  }
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
