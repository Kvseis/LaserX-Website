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
  for (const width of [390, 768, 820, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const locale of ([768, 1024].includes(width) ? ['az'] : ['az', 'en', 'ru', 'tr'])) {
      const prefix = locale === 'az' ? '' : `/${locale}`;
      const response = await page.goto(`${baseUrl}${prefix}/about`, { waitUntil: 'load', timeout: 60000 });
      if (response.status() !== 200) throw Error(`${locale}: about route failed`);
      await page.evaluate(() => document.fonts.ready);
      if (await page.locator('h1').count() !== 1 || await page.locator('html').getAttribute('lang') !== locale) {
        throw Error(`${locale}: heading or language missing`);
      }
      const heroImage = page.locator('main section').first().locator('img').first();
      if (!(await heroImage.getAttribute('src')).includes('about-hero.webp')) throw Error('Workshop image missing');
      if (await page.locator('#sifaris form').count() !== 1
        || await page.locator('#sifaris a[href="tel:+994553900028"]').count() !== 1) {
        throw Error('Shared booking section missing');
      }
      const footerGap = await page.evaluate(() => {
        const booking = document.querySelector('#sifaris').getBoundingClientRect();
        const footer = document.querySelector('footer').getBoundingClientRect();
        return footer.top - booking.bottom;
      });
      if (Math.abs(footerGap) > 1) throw Error('Booking section must touch the footer');
      const headingLines = await page.locator('h1').evaluate((heading) => heading.clientHeight / parseFloat(getComputedStyle(heading).lineHeight));
      if (headingLines > 3.1) throw Error(`${locale}/${width}: hero heading exceeds three lines`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 1) throw Error(`${locale}/${width}: overflow ${overflow}`);
      const clippedContent = await page.locator('main h1, main h2, main h3, main p').evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1;
      }).map((element) => element.textContent));
      if (clippedContent.length) throw Error(`${locale}/${width}: clipped content ${clippedContent.join(', ')}`);
      const processCards = page.locator('main section').filter({ has: page.locator('[class*="processGrid"]') }).locator('article');
      if (await processCards.count() !== 4) throw Error(`${locale}: process steps missing`);
      const cardPositions = await processCards.evaluateAll((cards) => cards.map((card) => ({ x: card.getBoundingClientRect().x, y: card.getBoundingClientRect().y })));
      if (width === 390 && !cardPositions.every((position) => position.x === cardPositions[0].x)) throw Error('Mobile steps must stack');
      if (width === 1440 && !cardPositions.every((position) => position.y === cardPositions[0].y)) throw Error('Desktop steps must share one row');
      const heroGap = await page.evaluate(() => document.querySelector('main section > div').getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom);
      if (Math.abs(heroGap - 16) > 1) throw Error(`${locale}/${width}: hero gap is ${heroGap}`);
      if (await page.locator('main nav a').getAttribute('href') !== (prefix || '/')) throw Error('Breadcrumb home link loses locale');
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
  const interactionPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const interactionErrors = [];
  interactionPage.on('pageerror', (error) => interactionErrors.push(error.message));
  await interactionPage.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' });
  await interactionPage.locator('[data-about-text]').evaluate((heading) => heading.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await interactionPage.waitForFunction(() => [...document.querySelectorAll('[data-about-word]')].every((word) => Number(getComputedStyle(word).opacity) > 0.95));
  const surface = interactionPage.locator('[class*="surfaceGrid"] > a').first();
  await surface.scrollIntoViewIfNeeded();
  await surface.focus();
  await interactionPage.waitForFunction(() => document.activeElement?.matches('a[class*="surface"]'));
  const focusStyle = await surface.evaluate((link) => ({ width: getComputedStyle(link).outlineWidth, style: getComputedStyle(link).outlineStyle }));
  if (focusStyle.width === '0px' || focusStyle.style === 'none') throw Error('Surface keyboard focus is not visible');
  await interactionPage.keyboard.press('Tab');
  if (!await interactionPage.locator('[class*="surfaceGrid"] > a').nth(1).evaluate((link) => link === document.activeElement)) throw Error('Surface keyboard order is incorrect');
  await interactionPage.emulateMedia({ reducedMotion: 'reduce' });
  await interactionPage.waitForFunction(() => [...document.querySelectorAll('[data-about-word]')].every((word) => Number(getComputedStyle(word).opacity) === 1));
  const mediaTransform = await interactionPage.locator('[data-about-media] img').evaluate((img) => getComputedStyle(img).transform);
  if (mediaTransform !== 'none') throw Error('Reduced motion does not reset the photo transform');
  if (interactionErrors.length) throw Error(interactionErrors.join('\n'));
  await interactionPage.close();
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
