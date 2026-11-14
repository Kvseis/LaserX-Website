import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const artifactDir = path.resolve('artifacts');
await mkdir(artifactDir, { recursive: true });

try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });

    const seekTo = async (progress) => {
      await page.evaluate((fraction) => {
        const section = document.getElementById('proses');
        const travel = section.offsetHeight - window.innerHeight;
        window.scrollTo({ top: section.offsetTop + travel * fraction, behavior: 'instant' });
      }, progress);
    };

    await seekTo(0);
    await page.waitForFunction(() => document.querySelector('#proses video')?.readyState >= 1);
    await seekTo(.55);
    await page.waitForFunction(() => document.querySelector('#proses video')?.currentTime > 3.5);
    const stageTop = await page.locator('#proses > div').evaluate((stage) => stage.getBoundingClientRect().top);
    if (Math.abs(stageTop) > 2) throw new Error(`${name}: video paneli sürüşdürmədə sabit qalmır (${stageTop}px)`);
    const middle = await page.locator('#proses video').evaluate((video) => video.currentTime);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-scroll-film.png`) });

    await seekTo(.98);
    await page.waitForFunction(() => document.querySelector('#proses video')?.currentTime > 7);
    const end = await page.locator('#proses video').evaluate((video) => video.currentTime);

    await seekTo(.05);
    await page.waitForFunction(() => document.querySelector('#proses video')?.currentTime < 1);
    const reverse = await page.locator('#proses video').evaluate((video) => video.currentTime);
    console.log(`${name}: middle=${middle.toFixed(2)}s, end=${end.toFixed(2)}s, reverse=${reverse.toFixed(2)}s`);
    await page.close();
  }

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
  const fallback = await reduced.locator('#proses').evaluate((section) => ({
    position: getComputedStyle(section.firstElementChild).position,
    videoVisible: getComputedStyle(section.querySelector('video')).display !== 'none',
  }));
  if (fallback.position !== 'relative' || fallback.videoVisible) {
    throw new Error(`Reduced-motion fallback failed: ${JSON.stringify(fallback)}`);
  }
  console.log('Reduced-motion fallback: poster visible, video hidden, no sticky scroll');
  await reduced.close();
} finally {
  await browser.close();
}
