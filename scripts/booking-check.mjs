import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
await mkdir('artifacts', { recursive: true });

try {
  for (const [name, width, height] of [['desktop', 1440, 1100], ['mobile', 390, 1300]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const form = page.locator('#sifaris form');
    if (await form.evaluate((element) => element.checkValidity())) throw new Error(`${name}: empty form accepted`);
    await form.locator('[name="name"]').focus();
    if (!await form.locator('[name="name"]').evaluate((element) => element.matches(':focus-visible'))) throw new Error(`${name}: keyboard focus missing`);
    await page.locator('#booking-title').click();
    await page.locator('#sifaris').screenshot({ path: `artifacts/booking-${name}.png` });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error(`${name}: horizontal overflow`);
    await form.locator('[name="name"]').fill('Test User');
    if (await form.locator('[name="phone"], input[type="tel"]').count()) throw new Error(`${name}: redundant phone field remains`);
    if (await form.evaluate((element) => element.checkValidity())) throw new Error(`${name}: surface selection is not required`);
    await form.locator('[name="surface"]').selectOption({ index: 1 });
    if (!await form.evaluate((element) => element.checkValidity())) throw new Error(`${name}: optional fields are required`);
    await form.locator('[name="area"]').fill('12 m²');
    await form.locator('[name="date"]').fill('2027-01-20');
    await form.locator('[name="notes"]').fill('Sınaq: pas & boya\nBakı');
    // Block the external navigation: these test details must never be sent.
    await page.route('https://wa.me/**', (route) => route.abort());
    const request = page.waitForRequest((item) => item.url().startsWith('https://wa.me/'));
    await form.getByRole('button').click();
    const url = new URL((await request).url());
    const message = url.searchParams.get('text');
    if (message?.includes('Telefon nömrəsi:')) throw new Error(`${name}: phone included in draft`);
    if (url.pathname !== '/994553900028') throw new Error(`${name}: wrong WhatsApp destination`);
    for (const value of ['Test User', '12 m²', '2027-01-20', 'Sınaq: pas & boya\nBakı']) {
      if (!message?.includes(value)) throw new Error(`${name}: missing draft field ${value}`);
    }
    await page.close();
  }
  for (const locale of ['ru', 'en', 'tr']) {
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/${locale}`, { waitUntil: 'networkidle' });
    if (await page.locator('#sifaris form').count() !== 1) throw new Error(`${locale}: translated form missing`);
    await page.close();
  }
  console.log(JSON.stringify({ ok: true, viewports: ['desktop', 'mobile'], languages: ['az', 'ru', 'en', 'tr'], externalNavigationBlocked: true }));
} finally {
  await browser.close();
}
