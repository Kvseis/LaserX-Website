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
const dustFrames = '#proses canvas[class*="dustCloud"]';
await mkdir(artifactDir, { recursive: true });

try {
  for (const [name, viewport] of [
    ['desktop', { width: 1440, height: 900 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const mobile = name === 'mobile';
    const page = await browser.newPage({ viewport, hasTouch: mobile, isMobile: mobile, reducedMotion: 'no-preference' });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    const film = page.locator('#proses[data-static="false"]');
    await film.waitFor();
    const scrollScreens = await film.evaluate((section) => {
      const height = section.firstElementChild.offsetHeight;
      return (section.offsetHeight - height) / height;
    });
    if (scrollScreens < (mobile ? 5.3 : 5.15)) throw new Error(`${name}: film üçün sürüşdürmə məsafəsi qısadır`);
    const seekTo = async (progress) => {
      await page.evaluate((fraction) => {
        const section = document.getElementById('proses');
        const travel = section.offsetHeight - section.firstElementChild.offsetHeight;
        window.scrollTo({ top: section.offsetTop + travel * fraction, behavior: 'instant' });
      }, progress);
    };

    await seekTo(.18);
    const waitForTime = (selector, min, max) => page.waitForFunction(({ selector, min, max }) => {
      const video = document.querySelector(selector);
      return video?.readyState >= 2 && video.currentTime >= min && video.currentTime <= max;
    }, { selector, min, max });
    await waitForTime(metalSelector, 3.3, 3.9);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-scroll-film.png`) });

    await page.waitForFunction(() => {
      const progress = parseFloat(document.getElementById('proses').style.getPropertyValue('--film-progress'));
      return Math.abs(progress - .18 / .396 * 100) < .25;
    });
    const { before, firstStep } = await film.evaluate(async (section) => {
      const readProgress = () => parseFloat(section.style.getPropertyValue('--film-progress'));
      const before = readProgress();
      const travel = section.offsetHeight - section.firstElementChild.offsetHeight;
      window.scrollTo({ top: section.offsetTop + travel * .3, behavior: 'instant' });
      let firstStep = before;
      for (let i = 0; i < 12 && firstStep <= before; i++) {
        await new Promise(requestAnimationFrame);
        firstStep = readProgress();
      }
      return { before, firstStep };
    });
    if (!(firstStep > before && firstStep < 70)) throw new Error(`${name}: sürətli sürüşdürmədə səhnə birdən atlanır`);

    await seekTo(.371);
    await waitForTime(metalSelector, 7.3, 7.8);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-dust-rise.png`) });

    await seekTo(.473);
    await page.waitForFunction((selector) => {
      const dust = document.querySelector(selector);
      const woodReveal = parseFloat(document.getElementById('proses').style.getPropertyValue('--wood-reveal'));
      const dustOpacity = Number(getComputedStyle(dust).opacity);
      return woodReveal > 35 && woodReveal < 65
        && dustOpacity > .2 && dustOpacity < .4
        && getComputedStyle(dust).maskImage.includes('radial-gradient');
    }, dustFrames);
    const stageTop = await page.locator('#proses > div').evaluate((stage) => stage.getBoundingClientRect().top);
    if (Math.abs(stageTop) > 2) throw new Error(`${name}: film stage leaves its pinned position`);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-film-transition.png`) });

    await seekTo(.575);
    await waitForTime(woodSelector, .15, .4);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-dust-clear.png`) });

    await seekTo(.756);
    await waitForTime(woodSelector, 2.1, 2.4);
    const woodHeight = await page.locator(woodSelector).evaluate((video) => video.videoHeight);
    if (woodHeight < 720) throw new Error(`${name}: expected HD wood video`);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-wood-film.png`) });

    await seekTo(.98);
    await waitForTime(woodSelector, 4.5, 4.85);

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

    await seekTo(.59);
    await waitForTime(woodSelector, .3, .8);
    await seekTo(.05);
    await waitForTime(metalSelector, .75, 1.25);

    if (mobile && !useWebKit) {
      await seekTo(.59);
      await waitForTime(woodSelector, .3, .8);
      const touch = await page.context().newCDPSession(page);
      const x = viewport.width / 2;
      const y = viewport.height * .72;
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let distance = 20; distance <= 180; distance += 20) {
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - distance }] });
      }
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await waitForTime(woodSelector, .85, 4.875);
      await touch.detach();
    }
    console.log(`${name}: ${scrollScreens.toFixed(2)} screens of scroll with eased progress; HD video and feathered dissolve verified in both directions`);
    await page.close();
  }

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(baseUrl, { waitUntil: 'networkidle' });
  const fallback = await reduced.locator('#proses').evaluate((section) => ({
    position: getComputedStyle(section.firstElementChild).position,
    videoLoaded: [...section.querySelectorAll('video')].some((video) => video.hasAttribute('src')),
    dustVisible: getComputedStyle(section.querySelector('[class*="dustCloud"]')).display !== 'none',
  }));
  if (fallback.position !== 'relative' || fallback.videoLoaded || fallback.dustVisible) {
    throw new Error(`Reduced-motion fallback failed: ${JSON.stringify(fallback)}`);
  }
  console.log('Reduced-motion fallback: poster visible, video hidden, no sticky scroll');
  await reduced.close();
} finally {
  await browser.close();
}
