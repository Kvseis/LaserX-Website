import { chromium, webkit } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const useWebKit = process.env.LASERX_WEBKIT === '1';
const browser = useWebKit ? await webkit.launch() : await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});
const artifactDir = path.resolve('artifacts');
const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const woodSelector = '#proses video[poster*="wood-poster"]';
const metalSelector = '#proses video[poster*="scroll-poster"]';
const woodFrames = '#proses [class*="woodScene"] canvas';
const metalFrames = '#proses > div > canvas';
await mkdir(artifactDir, { recursive: true });

try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const mobile = name === 'mobile';
    const page = await browser.newPage({ viewport, hasTouch: mobile, isMobile: mobile, reducedMotion: 'no-preference' });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.locator('#proses[data-static="false"]').waitFor();
    const seekTo = async (progress) => {
      await page.evaluate((fraction) => {
        const section = document.getElementById('proses');
        const travel = section.offsetHeight - section.firstElementChild.offsetHeight;
        window.scrollTo({ top: section.offsetTop + travel * fraction, behavior: 'instant' });
      }, progress);
    };

    await seekTo(.18);
    const waitForFrame = (selector, min, max) => page.waitForFunction(({ selector, min, max }) => {
      const frame = Number(document.querySelector(selector)?.dataset.frame);
      return frame >= min && frame <= max;
    }, { selector, min, max });
    const waitForTime = (selector, min, max) => page.waitForFunction(({ selector, min, max }) => {
      const video = document.querySelector(selector);
      return video?.readyState >= 2 && video.currentTime >= min && video.currentTime <= max;
    }, { selector, min, max });
    if (mobile) {
      await waitForFrame(metalFrames, 34, 38);
      if (await page.locator('#proses video[src]').count()) throw new Error('Mobile transition downloaded video');
    } else {
      await waitForTime(metalSelector, 3.3, 3.9);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-scroll-film.png`) });

    await seekTo(.46);
    await page.waitForFunction(() => {
      const wipe = parseFloat(document.getElementById('proses').style.getPropertyValue('--wipe-position'));
      return wipe > 48 && wipe < 52;
    });
    if (mobile) {
      await waitForFrame(metalFrames, 79, 79);
      await waitForFrame(woodFrames, 0, 0);
    }
    const stageTop = await page.locator('#proses > div').evaluate((stage) => stage.getBoundingClientRect().top);
    if (Math.abs(stageTop) > 2) throw new Error(`${name}: video paneli sürüşdürmədə sabit qalmır (${stageTop}px)`);
    const line = await page.locator('#proses [class*="laserLine"]').evaluate((element) => ({
      color: getComputedStyle(element).backgroundColor,
      height: element.getBoundingClientRect().height,
      middle: element.getBoundingClientRect().top + 1,
      cut: element.parentElement.querySelector('[class*="woodScene"]').getBoundingClientRect().bottom,
    }));
    if (line.color !== 'rgb(229, 35, 27)' || line.height !== 2
      || Math.abs(line.middle - line.cut) > 2) {
      throw new Error(`${name}: qırmızı xətt keçid sərhədinə uyğun gəlmir`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-film-transition.png`) });

    await seekTo(.74);
    if (mobile) await waitForFrame(woodFrames, 26, 28);
    else await waitForTime(woodSelector, 2.5, 3);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-wood-film.png`) });

    await seekTo(.98);
    if (mobile) await waitForFrame(woodFrames, 56, 58);
    else await waitForTime(woodSelector, 5.5, 6);

    if (mobile) {
      for (const height of [740, viewport.height]) {
        await page.setViewportSize({ ...viewport, height });
        await seekTo(.98);
        await page.waitForFunction(() => {
          const section = document.getElementById('proses');
          const stage = section.firstElementChild.getBoundingClientRect();
          const results = document.getElementById('neticeler').getBoundingClientRect();
          return Math.abs(stage.top) <= 1
            && Math.abs(stage.bottom - (visualViewport?.height ?? innerHeight)) <= 1
            && Math.abs(section.getBoundingClientRect().bottom - results.top) <= 1;
        });
      }
    }

    await seekTo(1.12);
    await page.waitForFunction(() => {
      const stage = document.getElementById('proses').firstElementChild.getBoundingClientRect();
      const results = document.getElementById('neticeler').getBoundingClientRect();
      return results.top >= 0 && results.top < innerHeight && Math.abs(stage.bottom - results.top) <= 1;
    });

    await seekTo(.56);
    if (mobile) await waitForFrame(woodFrames, 4, 6);
    else await waitForTime(woodSelector, .3, .8);

    if (mobile && !useWebKit) {
      const touch = await page.context().newCDPSession(page);
      const x = viewport.width / 2;
      const y = viewport.height * .72;
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let distance = 20; distance <= 180; distance += 20) {
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - distance }] });
      }
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await waitForFrame(woodFrames, 8, 59);
      await touch.detach();
    }
    await seekTo(.05);
    if (mobile) await waitForFrame(metalFrames, 8, 11);
    else await waitForTime(metalSelector, .75, 1.25);
    console.log(`${name}: metal first, red wipe aligned, wood moves forward and backward, results reached`);
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
