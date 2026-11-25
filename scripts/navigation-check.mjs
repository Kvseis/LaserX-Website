import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
await mkdir('artifacts', { recursive: true });

const cases = [
  { name: 'az-home-keyboard', start: '/', home: '/', keyboard: true },
  { name: 'en-technology', start: '/en/technology', home: '/en' },
  { name: 'ru-about', start: '/ru/about', home: '/ru' },
  { name: 'tr-technology', start: '/tr/technology', home: '/tr' },
  { name: 'en-mobile', start: '/en', home: '/en', mobile: true },
  { name: 'az-mobile-reduced', start: '/technology', home: '/', mobile: true, reduced: true },
  { name: 'en-direct', start: '/en#ustunlukler', home: '/en', direct: true },
];

try {
  for (const scenario of cases) {
    const page = await browser.newPage({ viewport: scenario.mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, reducedMotion: scenario.reduced ? 'reduce' : 'no-preference' });
    await page.goto(`${baseUrl}${scenario.start}`, { waitUntil: 'networkidle' });
    if (!scenario.direct) {
      if (scenario.mobile) await page.locator('.menu-button').click();
      const benefits = page.locator('.site-header nav a[href$="#ustunlukler"]');
      if (scenario.keyboard) {
        await benefits.focus();
        await benefits.press('Enter');
      } else await benefits.click();
      await page.waitForURL(`${baseUrl}${scenario.home}#ustunlukler`, { waitUntil: 'networkidle' });
    }
    await page.waitForFunction(() => {
      const target = document.getElementById('ustunlukler');
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      return target && Math.abs(target.getBoundingClientRect().top - offset) < 3;
    });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const visible = await page.locator('#ustunlukler h2').evaluate((heading) => {
      const box = heading.getBoundingClientRect();
      return box.top >= document.querySelector('.site-header').getBoundingClientRect().bottom && box.bottom <= innerHeight;
    });
    if (!visible) throw new Error(`${scenario.name}: comparison heading is not visible`);
    if (scenario.mobile && await page.locator('.menu-button').getAttribute('aria-expanded') !== 'false') throw new Error(`${scenario.name}: menu stayed open`);
    if (scenario.name === 'en-technology' || scenario.name === 'en-mobile') await page.screenshot({ path: `artifacts/benefits-${scenario.name}.png` });
    const brand = page.locator('.site-header .nav-brand');
    for (let click = 0; click < 2; click++) {
      if (click) await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
      await brand.click();
      await page.waitForFunction(() => window.scrollY < 3);
      if (new URL(page.url()).pathname !== scenario.home) throw new Error(`${scenario.name}: logo did not return home`);
    }
    await page.close();
  }
  console.log(JSON.stringify({ ok: true, cases: cases.map(({ name }) => name) }));
} finally {
  await browser.close();
}
