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
const metalFrames = '#proses > div > canvas:not([class*="dustCloud"])';
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
    if (scrollScreens < (mobile ? 3.3 : 3.85)) throw new Error(`${name}: film üçün sürüşdürmə məsafəsi qısadır`);
    const seekTo = async (progress) => {
      await page.evaluate((fraction) => {
        const section = document.getElementById('proses');
        const travel = section.offsetHeight - section.firstElementChild.offsetHeight;
        window.scrollTo({ top: section.offsetTop + travel * fraction, behavior: 'instant' });
      }, progress);
    };

    const entry = await film.evaluate((section) => {
      const hero = document.querySelector('.hero');
      const stage = section.firstElementChild;
      const heroStart = hero.getBoundingClientRect().top;
      const scrollStart = window.scrollY;
      window.scrollTo({ top: scrollStart + section.getBoundingClientRect().top - innerHeight / 2, behavior: 'instant' });
      const heroBox = hero.getBoundingClientRect();
      const stageBox = stage.getBoundingClientRect();
      return {
        scrollDelta: window.scrollY - scrollStart,
        heroDelta: heroStart - heroBox.top,
        gap: stageBox.top - heroBox.bottom,
        copyOpacity: getComputedStyle(hero.querySelector('.hero-copy')).opacity,
        stageOpacity: getComputedStyle(stage).opacity,
        stageMask: getComputedStyle(stage).maskImage,
      };
    });
    if (entry.scrollDelta <= 0 || Math.abs(entry.heroDelta - entry.scrollDelta) > 1
      || entry.gap < 0 || entry.gap > 16 || entry.copyOpacity !== '1'
      || entry.stageOpacity !== '1' || entry.stageMask !== 'none') {
      throw new Error(`${name}: hero and film should scroll into view without overlapping or fading: ${JSON.stringify(entry)}`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-hero-transition.png`) });

    await page.evaluate(() => window.scrollBy({ top: -innerHeight / 4, behavior: 'instant' }));
    await page.locator('.hero-equipment').focus();
    await page.keyboard.press('Shift+Tab');
    const focusedHeroButton = await page.locator('.hero-book').evaluate((button) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const hit = document.elementFromPoint(left + width / 2, top + height / 2);
      return button.matches(':focus-visible') && button.contains(hit);
    });
    if (!focusedHeroButton) throw new Error(`${name}: keyboard focus did not return to the visible hero booking button`);
    await page.locator('.hero-book').blur();

    await seekTo(.18);
    const waitForFrame = (selector, min, max) => page.waitForFunction(({ selector, min, max }) => {
      const frame = Number(document.querySelector(selector)?.dataset.frame);
      return frame >= min && frame <= max;
    }, { selector, min, max });
    const waitForScene = (selector, progress, tolerance = .018) => page.waitForFunction(({ selector, progress, tolerance }) => {
      const canvas = document.querySelector(selector);
      const frame = Number(canvas?.dataset.frame);
      const lastFrame = Number(canvas?.dataset.frameCount) - 1;
      return lastFrame > 0 && Math.abs(frame / lastFrame - progress) <= tolerance;
    }, { selector, progress, tolerance });
    const waitForTime = (selector, min, max) => page.waitForFunction(({ selector, min, max }) => {
      const video = document.querySelector(selector);
      return video?.readyState >= 2 && video.currentTime >= min && video.currentTime <= max;
    }, { selector, min, max });
    if (mobile) {
      await waitForScene(metalFrames, .18 / .396);
      if (await page.locator('#proses video[src]').count()) throw new Error('Mobile transition downloaded video');
    } else {
      await waitForTime(metalSelector, 3.3, 3.9);
    }
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

    if (mobile) {
      // These metal frames previously showed lines at the top of the image.
      await seekTo(.26);
      await waitForScene(metalFrames, .26 / .396);
      await page.screenshot({ path: path.join(artifactDir, 'laserx-mobile-metal-edge.png') });
    }

    const dustStats = () => page.locator(dustFrames).evaluate((canvas) => {
      const { width, height } = canvas;
      const pixels = canvas.getContext('2d').getImageData(0, 0, width, height).data;
      let dense = 0;
      let dustPixels = 0;
      let ySum = 0;
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] > 202) dense++;
        if (pixels[index] > 20) {
          dustPixels++;
          ySum += Math.floor(index / (4 * width));
        }
      }
      return { coverage: dense / (width * height), area: dustPixels / (width * height), centerY: ySum / (dustPixels * height) };
    });
    await seekTo(.371);
    await waitForFrame(dustFrames, 6, 8);
    if (mobile) await waitForScene(metalFrames, .371 / .396);
    else await waitForTime(metalSelector, 7.3, 7.8);
    const initialDust = await dustStats();
    if (initialDust.area <= 0 || initialDust.area > .2 || initialDust.centerY < .5) {
      throw new Error(`${name}: toz əvvəl səthə yaxın yaranmalıdır`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-dust-rise.png`) });

    // The expanding cloud must never expose the rectangular canvas boundary.
    for (const progress of [.40, .42, .44]) {
      await seekTo(progress);
      const frame = Math.round((progress - .32) / (.60 - .32) * 39);
      await waitForFrame(dustFrames, frame, frame);
      const coversStage = await page.locator(dustFrames).evaluate((canvas) => {
        const cloud = canvas.getBoundingClientRect();
        const stage = canvas.parentElement.getBoundingClientRect();
        return cloud.left <= stage.left && cloud.top <= stage.top
          && cloud.right >= stage.right && cloud.bottom >= stage.bottom;
      });
      if (!coversStage) throw new Error(`${name}: expanding dust exposes its canvas edge at ${progress}`);
      await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-dust-expand-${Math.round(progress * 100)}.png`) });
    }

    await seekTo(.473);
    await page.waitForFunction(() => {
      const opacity = Number(document.getElementById('proses').style.getPropertyValue('--wood-opacity'));
      return opacity > .35 && opacity < .65;
    });
    if (mobile) {
      await waitForScene(metalFrames, 1, 0);
      await waitForFrame(woodFrames, 0, 0);
    }
    const stageTop = await page.locator('#proses > div').evaluate((stage) => stage.getBoundingClientRect().top);
    if (Math.abs(stageTop) > 2) throw new Error(`${name}: video paneli sürüşdürmədə sabit qalmır (${stageTop}px)`);
    await waitForFrame(dustFrames, 20, 22);
    const coversStage = await page.locator(dustFrames).evaluate((canvas) => {
      const dust = canvas.getBoundingClientRect();
      const stage = canvas.parentElement.getBoundingClientRect();
      return Math.abs(dust.left - stage.left) <= 1 && Math.abs(dust.top - stage.top) <= 1
        && Math.abs(dust.right - stage.right) <= 1 && Math.abs(dust.bottom - stage.bottom) <= 1;
    });
    if (!coversStage || (await dustStats()).coverage < .94) {
      throw new Error(`${name}: səhnə dəyişərkən toz ekranı örtmür`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-film-transition.png`) });

    await seekTo(.575);
    await waitForFrame(dustFrames, 34, 36);
    if (mobile) await waitForScene(woodFrames, (.575 - .55) / .45);
    else await waitForTime(woodSelector, .15, .4);
    const clearingDust = await dustStats();
    if (clearingDust.area > .32 || clearingDust.centerY >= initialDust.centerY) {
      throw new Error(`${name}: taxta səhnəsi başlayanda toz yuxarı çəkilmir`);
    }
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-dust-clear.png`) });

    await seekTo(.756);
    if (mobile) await waitForScene(woodFrames, (.756 - .55) / .45);
    else await waitForTime(woodSelector, 2.05, 2.4);
    await page.screenshot({ path: path.join(artifactDir, `laserx-${name}-wood-film.png`) });

    await seekTo(.98);
    if (mobile) await waitForScene(woodFrames, (.98 - .55) / .45);
    else await waitForTime(woodSelector, 4.45, 4.85);

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
    if (mobile) await waitForScene(woodFrames, (.59 - .55) / .45);
    else await waitForTime(woodSelector, .3, .8);
    await seekTo(.05);
    if (mobile) await waitForScene(metalFrames, .05 / .396);
    else await waitForTime(metalSelector, .75, 1.25);

    if (mobile && !useWebKit) {
      await seekTo(.59);
      await waitForScene(woodFrames, (.59 - .55) / .45);
      const touch = await page.context().newCDPSession(page);
      const x = viewport.width / 2;
      const y = viewport.height * .72;
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let distance = 20; distance <= 180; distance += 20) {
        await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - distance }] });
      }
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await waitForFrame(woodFrames, 15, 116);
      await touch.detach();
    }
    console.log(`${name}: ${scrollScreens.toFixed(2)} screens of scroll with eased progress; dust covers and clears in both directions`);
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
