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
      const hero = page.locator('section[aria-labelledby="about-title"]');
      const heroImage = hero.locator('img');
      if (await hero.locator('p').count() !== 1 || await hero.locator('a[href="#sifaris"]').count() !== 1) {
        throw Error('The About introduction or booking link is missing');
      }
      const heroSource = await heroImage.evaluate((image) => image.currentSrc);
      const expectedHero = width <= 640 ? 'about-concrete-flanges-mobile.webp' : 'about-concrete-flanges.webp';
      if (!heroSource.includes(expectedHero)) throw Error(`${locale}/${width}: incorrect hero artwork`);
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
        if (element.closest('#steps-rail')) return false;
        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > innerWidth + 1;
      }).map((element) => element.textContent));
      if (clippedContent.length) throw Error(`${locale}/${width}: clipped content ${clippedContent.join(', ')}`);
      const story = page.locator('section[aria-labelledby="story-title"]');
      if (await story.locator('[class*="storyBody"] > p').count() !== 2) {
        throw Error(`${locale}/${width}: About story description is incomplete`);
      }
      if (await story.getByRole('slider').count() !== 1 || await story.getByRole('button').count() !== 3
        || await story.getByRole('link').getAttribute('href') !== `${prefix}/technology`) {
        throw Error(`${locale}/${width}: story controls or technology link missing`);
      }
      const mobileSteps = page.locator('section[aria-labelledby="steps-mobile-title"]');
      const desktopSteps = page.locator('section[aria-labelledby="steps-desktop-title"]');
      if (await mobileSteps.isVisible() !== (width < 768) || await desktopSteps.isVisible() !== (width >= 768)) {
        throw Error(`${locale}/${width}: wrong process layout`);
      }
      if (width < 768 && !await mobileSteps.locator('#steps-rail').evaluate((rail) =>
        rail.children.length === 4 && rail.scrollWidth > rail.clientWidth && getComputedStyle(rail).scrollSnapType === 'x mandatory')) {
        throw Error(`${locale}/${width}: mobile steps must snap horizontally`);
      }
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
      for (const image of await page.locator('main img:visible').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate((img) => img.decode());
      }
      if (width < 768) await mobileSteps.locator('#steps-rail').evaluate((rail) => rail.scrollTo({ left: 0, behavior: 'instant' }));
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
  interactionPage.on('console', (message) => {
    if (['warning', 'error'].includes(message.type())) interactionErrors.push(message.text());
  });
  await interactionPage.goto(`${baseUrl}/en/about`, { waitUntil: 'networkidle' });
  await interactionPage.locator('[data-about-text]').evaluate((heading) => heading.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await interactionPage.waitForFunction(() => [...document.querySelectorAll('[data-about-word]')].every((word) => Number(getComputedStyle(word).opacity) > 0.95));

  const story = interactionPage.locator('section[aria-labelledby="story-title"]');
  const slider = story.getByRole('slider');
  await story.evaluate((section) => section.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await slider.focus();
  await slider.press('ArrowRight');
  if (await slider.getAttribute('aria-valuenow') !== '53'
    || await slider.evaluate((element) => getComputedStyle(element).outlineStyle) !== 'solid') {
    throw Error('The comparison slider needs keyboard movement and visible focus');
  }
  await slider.press('Home');
  await slider.press('ArrowLeft');
  if (await slider.getAttribute('aria-valuenow') !== '0') throw Error('Slider lower bound failed');
  await slider.press('End');
  await slider.press('ArrowRight');
  if (await slider.getAttribute('aria-valuenow') !== '100') throw Error('Slider upper bound failed');
  const comparison = slider.locator('..');
  const comparisonBox = await comparison.boundingBox();
  const middle = comparisonBox.y + comparisonBox.height / 2;
  await interactionPage.mouse.move(comparisonBox.x + comparisonBox.width * 0.8, middle);
  await interactionPage.mouse.down();
  await interactionPage.mouse.move(comparisonBox.x + comparisonBox.width * 0.5, middle, { steps: 5 });
  await interactionPage.mouse.up();
  if (await slider.getAttribute('aria-valuenow') !== '50') throw Error('Comparison mouse drag failed');
  const chip = story.getByRole('button', { name: 'No chemicals' });
  await chip.hover();
  const chipDetail = story.getByText('No chemical paint or rust strippers.');
  await chipDetail.waitFor({ state: 'visible' });
  await chip.focus();
  await chip.press('Escape');
  await chipDetail.waitFor({ state: 'hidden' });
  await chip.press('Enter');
  await chipDetail.waitFor({ state: 'visible' });
  await chip.press('Space');
  await chipDetail.waitFor({ state: 'hidden' });
  await comparison.evaluate((frame) => {
    const rect = frame.getBoundingClientRect();
    window.scrollBy({ top: rect.top - (innerHeight - rect.height) / 2 - 44, behavior: 'instant' });
  });
  await chip.blur();
  await interactionPage.screenshot({ path: 'artifacts/about-redesign-desktop-story.png' });

  const steps = interactionPage.locator('section[aria-labelledby="steps-desktop-title"]');
  const sticky = steps.locator('[class*="stepsSticky"]');
  const titles = ['Send a photo', 'Test a small area', 'Laser cleaning', 'Final check'];
  const fractions = [0.05, 0.35, 0.6, 1];
  for (const [index, title] of titles.entries()) {
    await steps.evaluate((section, fraction) => {
      const top = section.getBoundingClientRect().top + scrollY;
      window.scrollTo({ top: top + (section.offsetHeight - innerHeight) * fraction, behavior: 'instant' });
    }, fractions[index]);
    await steps.locator('h3', { hasText: title }).waitFor({ state: 'visible' });
    await interactionPage.waitForFunction((expected) => {
      const track = document.querySelector('[class*="stepProgress"] > div');
      return Math.abs(new DOMMatrix(getComputedStyle(track).transform).a - expected) < 0.015;
    }, fractions[index]);
    if (Math.abs((await sticky.boundingBox()).y) > 2) throw Error(`Step ${index + 1} did not stay pinned`);
    const image = steps.locator(`img[src*="steps%2F${index + 1}.jpg"]`);
    await image.evaluate((element) => element.decode());
    if (index === 0 || index === 3) {
      await interactionPage.waitForFunction(() => [...document.querySelectorAll('[class*="stepsSticky"] [class*="featureReveal"], [class*="stepSlide"], [class*="stepTitles"] > div')]
        .every((element) => Number(getComputedStyle(element).opacity) > 0.99));
      await interactionPage.screenshot({ path: `artifacts/about-redesign-desktop-step-${index + 1}.png` });
    }
  }

  await interactionPage.emulateMedia({ reducedMotion: 'reduce' });
  await interactionPage.waitForFunction(() => [...document.querySelectorAll('[data-about-word]')].every((word) => Number(getComputedStyle(word).opacity) === 1));
  const mediaTransform = await story.locator('[class*="comparisonImages"]').evaluate((element) => getComputedStyle(element).transform);
  if (mediaTransform !== 'none') throw Error('Reduced motion does not reset the photo transform');
  if (interactionErrors.length) throw Error(interactionErrors.join('\n'));
  await interactionPage.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await mobile.goto(`${baseUrl}/en/about`, { waitUntil: 'networkidle' });
  const touch = await mobile.context().newCDPSession(mobile);
  async function swipe(locator, from, to) {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    const y = Math.round(box.y + box.height / 2);
    const points = (fraction) => [{ x: Math.round(box.x + box.width * fraction), y }];
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(from) });
    for (let step = 1; step <= 8; step++) {
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(from + (to - from) * step / 8) });
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  const touchChip = mobile.getByRole('button', { name: 'Test first' });
  await touchChip.tap();
  await mobile.getByText('We check a small area before the main work.').waitFor({ state: 'visible' });
  const rail = mobile.locator('#steps-rail');
  await mobile.getByRole('button', { name: '04 · Final check' }).tap();
  await mobile.locator('[aria-controls="steps-rail"][aria-current="step"][aria-label^="04"]').waitFor();
  await rail.locator('img').last().evaluate((image) => image.decode());
  await rail.scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: 'artifacts/about-redesign-mobile-step.png' });
  await swipe(rail, 0.07, 0.9);
  await mobile.locator('[aria-controls="steps-rail"][aria-current="step"]:not([aria-label^="04"])').waitFor();
  const touchSlider = mobile.getByRole('slider');
  await swipe(touchSlider.locator('..'), 0.25, 0.75);
  if (Number(await touchSlider.getAttribute('aria-valuenow')) < 70) throw Error('Comparison touch drag failed');
  await mobile.locator('#story-title').evaluate((heading) => {
    window.scrollBy({ top: heading.getBoundingClientRect().top - 142, behavior: 'instant' });
  });
  await mobile.screenshot({ path: 'artifacts/about-redesign-mobile-story.png' });
  await touch.detach();
  await mobile.close();
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
