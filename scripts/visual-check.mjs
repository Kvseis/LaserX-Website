import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = path.resolve('artifacts');

await mkdir(artifactDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true,
});

async function verifyHeroWipe(page, name) {
  const visual = page.locator('.hero-visual');
  await page.waitForFunction(() => document.querySelector('.hero-visual').style.getPropertyValue('--hero-reveal') !== '');
  await page.waitForFunction(() => [...document.querySelectorAll('.hero-visual img')].every((image) => image.complete && image.naturalWidth > 0));

  const measureWipe = () => visual.evaluate((frame) => {
    const [rusty, clean] = frame.querySelectorAll('img');
    const laser = frame.querySelector('.hero-laser');
    const frameRect = frame.getBoundingClientRect();
    const rustyRect = rusty.getBoundingClientRect();
    const cleanRect = clean.getBoundingClientRect();
    const laserRect = laser.getBoundingClientRect();
    return {
      reveal: parseFloat(getComputedStyle(frame).getPropertyValue('--hero-reveal')),
      hiddenPercent: parseFloat(getComputedStyle(clean).clipPath.split(' ')[1]) || 0,
      differingGeometry: ['left', 'top', 'width', 'height'].some((key) => rustyRect[key] !== cleanRect[key]),
      linePercent: 100 * (laserRect.left + laserRect.width / 2 - frameRect.left) / frameRect.width,
      lineWidth: laserRect.width,
      frameTop: frameRect.top,
    };
  });

  const verifyBoundary = ({ reveal, hiddenPercent, differingGeometry, linePercent, lineWidth }, expected) => {
    if (differingGeometry || lineWidth !== 2 || Math.abs(reveal - expected) > 0.2
      || Math.abs(reveal + hiddenPercent - 100) > 0.05 || Math.abs(linePercent - reveal) > 0.1) {
      throw new Error(`${name}: flanş şəkilləri və lazer xətti ${expected}% nöqtəsində uyğun gəlmir`);
    }
  };

  verifyBoundary(await measureWipe(), 35);
  const { start, travel } = await page.locator('.hero').evaluate((section) => {
    const stage = section.querySelector('.hero-stage');
    return { start: Math.max(0, stage.offsetHeight - window.innerHeight), travel: section.offsetHeight - stage.offsetHeight };
  });
  if (Math.abs(travel - await page.evaluate(() => window.innerHeight * 1.2)) > 2) {
    throw new Error(`${name}: lazer keçidinin scroll məsafəsi yanlışdır`);
  }

  const scrollTo = (top) => page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
  await scrollTo(start + travel / 2);
  await page.waitForFunction(() => parseFloat(document.querySelector('.hero-visual').style.getPropertyValue('--hero-reveal')) > 67);
  const halfway = await measureWipe();
  verifyBoundary(halfway, 67.5);

  await scrollTo(start + travel * 0.75);
  await page.waitForFunction(() => parseFloat(document.querySelector('.hero-visual').style.getPropertyValue('--hero-reveal')) > 83);
  const threeQuarters = await measureWipe();
  verifyBoundary(threeQuarters, 83.75);
  if (Math.abs(halfway.frameTop - threeQuarters.frameTop) > 1) throw new Error(`${name}: hero vizualı sticky qalmır`);

  await scrollTo(start + travel + 2);
  await visual.locator('.hero-laser').waitFor({ state: 'hidden' });
  verifyBoundary(await measureWipe(), 100);

  await scrollTo(0);
  const booking = page.locator('.hero-book');
  const results = page.locator('.hero-results');
  await booking.focus();
  await page.keyboard.press('Tab');
  if (!await results.evaluate((link) => link.matches(':focus-visible'))) throw new Error(`${name}: nəticələr linkinin klaviatura fokusu görünmür`);
  await page.keyboard.press('Enter');
  await page.waitForURL('**/#neticeler');
  await page.waitForFunction(() => {
    const top = document.getElementById('neticeler').getBoundingClientRect().top;
    return Math.abs(top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)) < 2;
  });
  if (!await page.locator('#neticeler h2').evaluate((heading) => heading === document.activeElement)) {
    throw new Error(`${name}: nəticələr bölməsi fokusu qəbul etmir`);
  }
  await page.evaluate(() => window.history.replaceState(null, '', window.location.pathname));
  await scrollTo(0);
}

async function verifyViewport(name, viewport) {
  const mobile = name === 'mobile';
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile, reducedMotion: 'no-preference' });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    window.heroLayoutShift = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (!entry.hadRecentInput) window.heroLayoutShift += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const title = await page.title();
  if (!title.includes('LaserX')) throw new Error(`${name}: səhifə başlığı yanlışdır`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) throw new Error(`${name}: ${overflow}px üfüqi daşma var`);

  const headerStyle = await page.locator('.site-header').evaluate((header) => {
    const style = getComputedStyle(header);
    const linkStyle = getComputedStyle(header.querySelector('nav a'));
    return { position: style.position, top: header.getBoundingClientRect().top, linkColor: linkStyle.color, linkSize: parseFloat(linkStyle.fontSize) };
  });
  if (headerStyle.position !== 'fixed' || Math.abs(headerStyle.top) > 1) {
    throw new Error(`${name}: navbar viewport-un yuxarısında sabit deyil`);
  }
  if (headerStyle.linkColor !== 'rgb(255, 255, 255)' || headerStyle.linkSize < 13) {
    throw new Error(`${name}: navbar linklərinin rəng və ya ölçüsü yanlışdır`);
  }

  if ((await page.locator('a[href="tel:+994553900028"]').count()) < 1) {
    throw new Error(`${name}: telefon keçidi tapılmadı`);
  }
  if ((await page.locator('a[href^="https://wa.me/994553900028"]').count()) < 1) {
    throw new Error(`${name}: WhatsApp keçidi tapılmadı`);
  }
  if ((await page.locator('.comparison-row').count()) !== 7) {
    throw new Error(`${name}: müqayisə matrisinin sətirləri natamamdır`);
  }
  if ((await page.getByRole('cell', { name: 'Səthə zərər vermir', exact: true }).count()) !== 1
    || (await page.getByRole('cell', { name: 'Daha yüksək uzunmüddətli xərc', exact: true }).count()) !== 1) {
    throw new Error(`${name}: müqayisə mətni natamamdır`);
  }
  if ((await page.locator('.results-contact').count()) !== 0) {
    throw new Error(`${name}: Before/After əlaqə düyməsi silinməyib`);
  }
  const heroActions = page.locator('.hero-actions');
  const equipmentLink = page.locator('.hero').getByRole('link', { name: 'Lazer cihazları al', exact: true });
  if (await heroActions.getByRole('link').count() !== 2
    || await heroActions.locator('.hero-book').getAttribute('href') !== '#sifaris'
    || await heroActions.getByRole('link', { name: 'Nəticələrə bax', exact: true }).getAttribute('href') !== '#neticeler'
    || !(await equipmentLink.getAttribute('href'))?.startsWith('https://wa.me/994553900028?text=')) {
    throw new Error(`${name}: hero əlaqə düymələri natamamdır`);
  }
  const services = page.getByRole('region', { name: 'Lazer təmizləmə xidmətləri' });
  const serviceCards = services.locator('article');
  if ((await serviceCards.count()) !== 8
    || (await serviceCards.locator('svg').count()) !== 8
    || (await serviceCards.locator('p').count()) !== 8
    || (await serviceCards.locator('img').count()) !== 8) {
    throw new Error(`${name}: xidmətlərin şəkilləri, ikonları və ya izahları natamamdır`);
  }
  const serviceRail = serviceCards.first().locator('..');
  const scrollRange = await serviceRail.evaluate((rail) => rail.scrollWidth - rail.clientWidth);
  if (scrollRange < 100) {
    throw new Error(`${name}: xidmət kartları üfüqi sürüşmür`);
  }
  if ((await page.getByRole('heading', { level: 1, name: 'Təmiz səth. Yeni başlanğıc.', exact: true }).count()) !== 1
    || (await page.locator('footer').getByRole('link', { name: 'Xidmət sifariş et' }).count()) !== 1) {
    throw new Error(`${name}: ilk ekran başlığı və ya WhatsApp düymələri natamamdır`);
  }
  if ((await page.locator('.technology-preview').count()) !== 1 || (await page.locator('.steps').count()) !== 0) {
    throw new Error(`${name}: köhnə texnologiya bölməsi düzgün əvəz edilməyib`);
  }
  if ((await page.getByRole('heading', { name: 'Səthinizə yeni başlanğıc verin.' }).count()) !== 1
    || (await page.locator('main > .contact').count()) !== 0
    || (await page.locator('footer').getByRole('link', { name: 'Xidmət sifariş et' }).getAttribute('href')) !== '/#sifaris') {
    throw new Error(`${name}: son əlaqə bölməsi natamamdır`);
  }
  if ((await page.locator('.nav-actions .nav-call').count()) !== 1 || (await page.locator('.nav-actions .nav-whatsapp').count()) !== 1) {
    throw new Error(`${name}: navbar əlaqə düymələri natamamdır`);
  }
  const resultGrid = page.locator('.result-grid');
  const resultColumns = await resultGrid.evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length);
  const expectedResultColumns = mobile ? 1 : name === 'tablet' ? 2 : 4;
  if (resultColumns !== expectedResultColumns) {
    throw new Error(`${name}: Before/After grid ${resultColumns} sütundur, ${expectedResultColumns} olmalıdır`);
  }
  if ((await page.getByText('Sənaye lazer təmizləmə · Bakı', { exact: true }).count()) > 0
    || (await page.getByText('Bakı · lazer təmizləmə', { exact: true }).count()) > 0) {
    throw new Error(`${name}: silinməli mətn etiketləri hələ görünür`);
  }

  await verifyHeroWipe(page, name);
  const cls = await page.evaluate(() => window.heroLayoutShift);
  if (cls > 0.1) throw new Error(`${name}: hero açılarkən CLS ${cls}`);
  if (pageErrors.length) throw new Error(`${name}: ${pageErrors.join(', ')}`);
  await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-hero.png`) });
  if (name === 'desktop-wide') {
    await page.close();
    return { name, viewport, overflow, cls };
  }

  const faq = page.locator('#suallar');
  if (await faq.locator('details').count() !== 6) throw new Error(`${name}: suallar bölməsi natamamdır`);
  const firstQuestion = faq.locator('summary').first();
  await firstQuestion.focus();
  await firstQuestion.press('Enter');
  if (!await faq.locator('details').first().locator('p').isVisible()) throw new Error(`${name}: sual klaviatura ilə açılmır`);
  await faq.screenshot({ path: path.join(artifactDir, `laserx-${name}-faq.png`) });
  await firstQuestion.press('Space');
  if (await faq.locator('details').first().getAttribute('open') !== null) throw new Error(`${name}: sual klaviatura ilə bağlanmır`);

  if ((await page.locator('img[src*="images.jpg"]').count()) < 2) {
    throw new Error(`${name}: images.jpg WhatsApp loqoları tam inteqrasiya edilməyib`);
  }

  if ((await resultGrid.locator('article').count()) !== 8) {
    throw new Error(`${name}: səkkiz müqayisə kartı görünməlidir`);
  }

  const rustSlider = page.getByRole('slider', { name: 'Pas və oksid əvvəl və sonra müqayisəsi' });
  const rustForward = page.getByRole('button', { name: 'Pas və oksid: sonranı daha çox göstər' });
  const rustBack = page.getByRole('button', { name: 'Pas və oksid: əvvəli daha çox göstər' });
  await (mobile ? rustForward.tap() : rustForward.click());
  if ((await rustSlider.inputValue()) !== '35') throw new Error(`${name}: sol ox Sonra şəklini genişləndirmədi`);
  await (mobile ? rustBack.tap() : rustBack.click());
  if ((await rustSlider.inputValue()) !== '50') throw new Error(`${name}: sağ ox Əvvəl şəklini genişləndirmədi`);

  if (!mobile) {
    const woodSlider = page.getByRole('slider', { name: 'Ağac bərpası əvvəl və sonra müqayisəsi' });
    await woodSlider.fill('70');
    await woodSlider.press('ArrowLeft');
    if ((await woodSlider.inputValue()) !== '69') throw new Error(`${name}: klaviatura ilə müqayisə işləmədi`);
  } else {
    await rustSlider.scrollIntoViewIfNeeded();
    const box = await rustSlider.boundingBox();
    const x = Math.round(box.x + box.width * .22);
    const y = Math.round(box.y + box.height / 2);
    const touch = await page.context().newCDPSession(page);
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (const offset of [16, 55, 105]) {
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + offset, y }] });
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.detach();
    if (Number(await rustSlider.inputValue()) <= 55) throw new Error('mobile: şəkil xətti sürüşmür');

    const menuButton = page.locator('button[aria-controls="main-navigation"]');
    await menuButton.click();
    if ((await menuButton.getAttribute('aria-expanded')) !== 'true') {
      throw new Error('mobile: menyu açılmadı');
    }
    await page.locator('#main-navigation').waitFor({ state: 'visible', timeout: 1000 });
    await page.getByRole('button', { name: 'Menyunu bağla' }).click();
  }

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < pageHeight; y += viewport.height * 0.8) {
    await page.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: 'instant' }), y);
    await page.waitForTimeout(100);
  }
  await page.locator('img').evaluateAll((images) => Promise.all(
    images.filter((image) => !image.closest('#xidmetler') || image.complete).map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })),
  ));

  await page.locator('.results').screenshot({ path: path.join(artifactDir, `laserx-${name}-results.png`) });
  await page.locator('#xidmetler').screenshot({ path: path.join(artifactDir, `laserx-${name}-services.png`) });
  await page.locator('.technology-preview').screenshot({ path: path.join(artifactDir, `laserx-${name}-technology.png`) });
  await page.locator('#ustunlukler').screenshot({ path: path.join(artifactDir, `laserx-${name}-comparison.png`) });
  await page.locator('footer').screenshot({ path: path.join(artifactDir, `laserx-${name}-footer.png`) });

  if (name !== 'desktop') {
    const alignment = await page.locator('.methods-copy h2').evaluate((heading) => {
      const headingBox = heading.getBoundingClientRect();
      const sectionBox = heading.closest('.methods-layout').getBoundingClientRect();
      return Math.abs((headingBox.left + headingBox.width / 2) - (sectionBox.left + sectionBox.width / 2));
    });
    if (alignment > 1) throw new Error(`${name}: müqayisə başlığı mərkəzdə deyil (${alignment}px)`);
  }

  await page.screenshot({
    path: path.join(artifactDir, `laserx-${name}.png`),
    fullPage: true,
  });
  if (mobile) {
    await services.getByRole('link', { name: 'Bütün tətbiq sahələrinə bax' }).tap();
    await page.waitForURL('**/technology#tetbiqler');
    if ((await page.locator('#tetbiqler article').count()) !== 12) {
      throw new Error('mobile: tətbiq sahələrinə keçid işləmədi');
    }
  }
  await page.close();
  return { name, viewport, overflow, cls };
}

async function verifyLanguages() {
  const variants = [
    { locale: 'ru', name: 'Русский', services: 'Услуги лазерной очистки', technology: 'Лазерная технология' },
    { locale: 'en', name: 'English', services: 'Laser cleaning services', technology: 'Laser Technology' },
    { locale: 'tr', name: 'Türkçe', services: 'Lazer temizleme hizmetleri', technology: 'Lazer Teknolojisi' },
  ];
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const switcher = page.locator('.language-switch');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const readReducedHero = () => page.locator('.hero-visual').evaluate((visual) => {
    const laser = visual.querySelector('.hero-laser');
    const stage = visual.closest('.hero-stage');
    return [
      getComputedStyle(visual).getPropertyValue('--hero-reveal').trim(),
      getComputedStyle(laser).left,
      getComputedStyle(stage).position,
      visual.parentElement.closest('.hero').offsetHeight - stage.offsetHeight,
    ];
  });
  const reducedHero = await readReducedHero();
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
  if (reducedHero[0] !== '50%' || reducedHero[2] !== 'relative' || reducedHero[3] !== 0
    || JSON.stringify(reducedHero) !== JSON.stringify(await readReducedHero())) {
    throw new Error('az: azaldılmış hərəkət rejimində hero 50/50 statik qalmır');
  }
  for (const { locale, name, services, technology } of variants) {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await switcher.locator('summary').tap();
    await switcher.getByRole('link', { name, exact: true }).tap();
    await page.waitForURL(`**/${locale}`, { waitUntil: 'networkidle' });
    if ((await page.locator('html').getAttribute('lang')) !== locale
      || (await page.getByRole('heading', { name: services, exact: true }).count()) !== 1) {
      throw new Error(`${locale}: ana səhifənin dil versiyası natamamdır`);
    }
    const serviceLink = page.locator('#xidmetler a').first();
    if ((await serviceLink.getAttribute('href')) !== `/${locale}/technology#tetbiqler`) {
      throw new Error(`${locale}: xidmətlərdən keçid seçilmiş dili saxlamır`);
    }
    await page.locator('.technology-preview-cta').tap();
    await page.waitForURL(`**/${locale}/technology`, { waitUntil: 'networkidle' });
    const heading = page.getByRole('heading', { level: 1, name: technology, exact: true });
    if ((await page.locator('html').getAttribute('lang')) !== locale
      || (await heading.count()) !== 1
      || !(await page.title()).includes('LaserX')
      || (await heading.evaluate((element) => element.scrollWidth > element.clientWidth + 1))) {
      throw new Error(`${locale}: texnologiya səhifəsinin dil versiyası natamamdır`);
    }
    await switcher.locator('summary').tap();
    await switcher.getByRole('link', { name: 'Azərbaycan dili', exact: true }).tap();
    await page.waitForURL(new URL('/technology', baseUrl).href);
    if ((await page.locator('html').getAttribute('lang')) !== 'az') {
      throw new Error(`${locale}: Texnologiya səhifəsində Azərbaycan dilinə keçid işləmədi`);
    }
  }
  await page.close();
  return variants.map(({ locale }) => locale);
}

try {
  const results = [];
  results.push(await verifyViewport('desktop', { width: 1280, height: 800 }));
  results.push(await verifyViewport('tablet', { width: 768, height: 1024 }));
  results.push(await verifyViewport('mobile', { width: 360, height: 740 }));
  results.push(await verifyViewport('desktop-wide', { width: 1920, height: 1080 }));
  const languages = await verifyLanguages();
  console.log(JSON.stringify({ ok: true, results, languages }, null, 2));
} finally {
  await browser.close();
}
