import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const artifactDir = path.resolve('artifacts');
const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const woodSelector = '#proses video[poster*="wood-poster"]';
const metalSelector = '#proses video[poster*="scroll-poster"]';
await mkdir(artifactDir, { recursive: true });

try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('#proses[data-static="false"]').waitFor();
    const wood = page.locator(woodSelector);
    const metal = page.locator(metalSelector);

    const seekTo = async (progress) => {
      await page.evaluate((fraction) => {
        const section = document.getElementById('proses');
        const travel = section.offsetHeight - section.firstElementChild.offsetHeight;
        window.scrollTo({ top: section.offsetTop + travel * fraction, behavior: 'instant' });
      }, progress);
    };

    await seekTo(.16);
    await page.waitForFunction((selector) => {
      const video = document.querySelector(selector);
      return video?.readyState >= 2 && video.currentTime > 1;
    }, woodSelector);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-wood-film.png`) });

    await seekTo(.4);
    await page.waitForFunction(() => {
      const wipe = parseFloat(document.getElementById('proses').style.getPropertyValue('--wipe-position'));
      return wipe > 48 && wipe < 52;
    });
    const stageTop = await page.locator('#proses > div').evaluate((stage) => stage.getBoundingClientRect().top);
    if (Math.abs(stageTop) > 2) throw new Error(`${name}: video paneli sürüşdürmədə sabit qalmır (${stageTop}px)`);
    const line = await page.locator('#proses [class*="laserLine"]').evaluate((element) => ({
      color: getComputedStyle(element).backgroundColor,
      height: element.getBoundingClientRect().height,
      middle: element.getBoundingClientRect().top + 1,
      cut: parseFloat(getComputedStyle(element.parentElement.querySelector('[class*="woodScene"]')).clipPath.match(/[\d.]+/)[0]),
    }));
    if (line.color !== 'rgb(229, 35, 27)' || line.height !== 2
      || Math.abs(line.middle - line.cut * viewport.height / 100) > 2) {
      throw new Error(`${name}: qırmızı xətt keçid sərhədinə uyğun gəlmir`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-film-transition.png`) });

    await seekTo(.75);
    await page.waitForFunction((selector) => document.querySelector(selector)?.currentTime > 3.5, metalSelector);
    const middle = await metal.evaluate((video) => video.currentTime);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-scroll-film.png`) });

    await seekTo(.98);
    await page.waitForFunction((selector) => document.querySelector(selector)?.currentTime > 7, metalSelector);
    const end = await metal.evaluate((video) => video.currentTime);

    await seekTo(.05);
    await page.waitForFunction((selector) => document.querySelector(selector)?.currentTime < 1.5, woodSelector);
    const reverse = await wood.evaluate((video) => video.currentTime);
    console.log(`${name}: red wipe aligned, metal middle=${middle.toFixed(2)}s, metal end=${end.toFixed(2)}s, wood reverse=${reverse.toFixed(2)}s`);
    await page.close();
  }

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'networkidle' });
  const fallback = await reduced.locator('#proses').evaluate((section) => ({
    position: getComputedStyle(section.firstElementChild).position,
    videoLoaded: [...section.querySelectorAll('video')].some((video) => video.hasAttribute('src')),
    lineVisible: getComputedStyle(section.querySelector('[class*="laserLine"]')).display !== 'none',
  }));
  if (fallback.position !== 'relative' || fallback.videoLoaded || fallback.lineVisible) {
    throw new Error(`Reduced-motion fallback failed: ${JSON.stringify(fallback)}`);
  }
  console.log('Reduced-motion fallback: poster visible, video hidden, no sticky scroll');
  await reduced.close();
} finally {
  await browser.close();
}
