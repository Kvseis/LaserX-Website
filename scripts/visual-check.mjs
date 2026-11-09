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

async function verifyViewport(name, viewport) {
  const mobile = name === 'mobile';
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile, reducedMotion: 'no-preference' });
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
  if ((await page.locator('.methods-steps li').count()) !== 3
    || (await page.getByRole('cell', { name: 'Səthə zərər vermir', exact: true }).count()) !== 1
    || (await page.getByRole('cell', { name: 'Daha yüksək uzunmüddətli xərc', exact: true }).count()) !== 1) {
    throw new Error(`${name}: müqayisə mətni və ya yeni iş addımları natamamdır`);
  }
  if ((await page.locator('.results-contact').count()) !== 0) {
    throw new Error(`${name}: Before/After əlaqə düyməsi silinməyib`);
  }
  if ((await page.locator('.hero-contacts .call-rail').count()) !== 1 || (await page.locator('.hero-contacts .whatsapp-rail').count()) !== 1) {
    throw new Error(`${name}: hero əlaqə düymələri natamamdır`);
  }
  const services = page.getByRole('region', { name: 'Lazer təmizləmə xidmətləri' });
  const serviceCards = services.locator('article');
  if ((await serviceCards.count()) !== 8
    || (await serviceCards.locator('svg').count()) !== 8
    || (await serviceCards.locator('p').count()) !== 8) {
    throw new Error(`${name}: xidmətlərin ikonları və ya izahları natamamdır`);
  }
  const serviceColumns = await serviceCards.first().evaluate((card) =>
    getComputedStyle(card.parentElement).gridTemplateColumns.split(' ').length,
  );
  if (serviceColumns !== (mobile ? 2 : 4)) {
    throw new Error(`${name}: xidmətlər düzgün sütunlarda düzülməyib`);
  }
  if ((await page.getByRole('heading', { level: 1, name: /Daha təmiz\.\s*Daha dəqiq\.\s*Daha güclü\./ }).count()) !== 1
    || (await page.locator('.contact').getByRole('link', { name: 'WhatsApp-da yazın' }).count()) !== 1) {
    throw new Error(`${name}: ilk ekran başlığı və ya WhatsApp düymələri natamamdır`);
  }
  if ((await page.locator('.technology-preview').count()) !== 1 || (await page.locator('.steps').count()) !== 0) {
    throw new Error(`${name}: köhnə texnologiya bölməsi düzgün əvəz edilməyib`);
  }
  if ((await page.getByRole('heading', { name: 'Səthinizə yeni başlanğıc verin.' }).count()) !== 1
    || (await page.locator('.contact .big-phone').count()) !== 1
    || (await page.locator('.contact .contact-whatsapp').count()) !== 1) {
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

  const heroVideo = page.locator('video.hero-media');
  const expectedVideoCount = 1;
  if ((await heroVideo.count()) !== expectedVideoCount) throw new Error(`${name}: hero video strategiyası yanlışdır`);
  if (expectedVideoCount === 1) {
    await page.waitForFunction(() => {
      const video = document.querySelector('video.hero-media');
      return video?.readyState >= 2 && !video.paused && video.currentSrc.endsWith('-720p.mp4');
    });
  }

  if ((await page.locator('img[src*="images.jpg"]').count()) < 3) {
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
    images.map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    })),
  ));

  await page.locator('.hero').screenshot({ path: path.join(artifactDir, `laserx-${name}-hero.png`) });
  await page.locator('.results').screenshot({ path: path.join(artifactDir, `laserx-${name}-results.png`) });
  await page.locator('#xidmetler').screenshot({ path: path.join(artifactDir, `laserx-${name}-services.png`) });
  await page.locator('.technology-preview').screenshot({ path: path.join(artifactDir, `laserx-${name}-technology.png`) });
  await page.locator('#ustunlukler').screenshot({ path: path.join(artifactDir, `laserx-${name}-comparison.png`) });
  await page.locator('.contact').screenshot({ path: path.join(artifactDir, `laserx-${name}-contact.png`) });

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
  return { name, viewport, overflow };
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
  for (const { locale, name, services, technology } of variants) {
    await page.goto(baseUrl);
    await switcher.locator('summary').tap();
    await switcher.getByRole('link', { name, exact: true }).tap();
    await page.waitForURL(`**/${locale}`);
    if ((await page.locator('html').getAttribute('lang')) !== locale
      || (await page.getByRole('heading', { name: services, exact: true }).count()) !== 1
      || (await page.locator('.methods-steps li').count()) !== 3) {
      throw new Error(`${locale}: ana səhifənin dil versiyası natamamdır`);
    }
    const serviceLink = page.locator('#xidmetler a');
    if ((await serviceLink.getAttribute('href')) !== `/${locale}/technology#tetbiqler`) {
      throw new Error(`${locale}: xidmətlərdən keçid seçilmiş dili saxlamır`);
    }
    await page.locator('.technology-preview-cta').tap();
    await page.waitForURL(`**/${locale}/technology`);
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
  results.push(await verifyViewport('desktop', { width: 1440, height: 900 }));
  results.push(await verifyViewport('tablet', { width: 820, height: 1180 }));
  results.push(await verifyViewport('mobile', { width: 390, height: 844 }));
  const languages = await verifyLanguages();
  console.log(JSON.stringify({ ok: true, results, languages }, null, 2));
} finally {
  await browser.close();
}
