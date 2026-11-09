import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const artifactDir = path.resolve('artifacts');
await mkdir(artifactDir, { recursive: true });

async function verify(name, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/technology', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`${name}: ${overflow}px üfüqi daşma var`);
  if ((await page.locator('.site-header').count()) !== 1) throw new Error(`${name}: navbar yoxdur`);
  const navigationLabels = await page.locator('.site-header nav a').allTextContents();
  if (navigationLabels.join('|') !== 'Haqqımızda|Xidmətlər|Nəticələr|Texnologiya|Üstünlüklər') {
    throw new Error(`${name}: navbar ana səhifə ilə eyni deyil`);
  }
  if ((await page.locator('main h1').count()) !== 1) throw new Error(`${name}: hero başlığı yoxdur`);
  if ((await page.locator('[class*="processGrid"] article').count()) !== 4) throw new Error(`${name}: proses kartları natamamdır`);
  if ((await page.locator('[class*="applicationGrid"] article').count()) !== 12) throw new Error(`${name}: tətbiq kartları natamamdır`);
  if ((await page.locator('a[href="tel:+994553900028"]').count()) < 2) throw new Error(`${name}: telefon CTA-ları natamamdır`);
  if ((await page.locator('a[href^="https://wa.me/994553900028"]').count()) < 2) throw new Error(`${name}: WhatsApp CTA-ları natamamdır`);
  if ((await page.locator('img[src*="images.jpg"]').count()) < 2) throw new Error(`${name}: images.jpg WhatsApp loqoları natamamdır`);

  const heroImage = page.locator('img[src*="technology-hero"]');
  const ctaImage = page.locator('img[src*="technology-cta"]');
  if ((await heroImage.count()) !== 1 || (await ctaImage.count()) !== 1) throw new Error(`${name}: yaradılmış vizuallar inteqrasiya edilməyib`);

  if (name === 'mobile') {
    const menu = page.locator('button[aria-controls="main-navigation"]');
    if (!(await menu.isVisible())) throw new Error('mobile: menyu düyməsi görünmür');
    await menu.click();
    await page.locator('#main-navigation').waitFor({ state: 'visible', timeout: 1000 });
    if ((await menu.getAttribute('aria-expanded')) !== 'true') {
      throw new Error('mobile: navbar siyahısı açılmır');
    }
  }

  await page.locator('section').first().screenshot({ path: path.join(artifactDir, `technology-${name}-hero.png`) });
  await page.screenshot({ path: path.join(artifactDir, `technology-${name}.png`), fullPage: true });
  await page.close();
  return { name, overflow };
}

try {
  const results = [];
  results.push(await verify('mobile', { width: 390, height: 844 }));
  results.push(await verify('desktop', { width: 1440, height: 900 }));
  results.push(await verify('tablet', { width: 820, height: 1180 }));
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
