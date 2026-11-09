import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
await mkdir('artifacts', { recursive: true });

try {
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: { width: mobile ? 390 : 1440, height: 900 },
      isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce',
    });
    const touch = mobile ? await page.context().newCDPSession(page) : null;
    await page.goto(baseUrl);
    const cards = page.locator('.result-card');
    assert.equal(await cards.count(), 8);

    async function drag(start, end, range) {
      if (touch) await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
      else { await page.mouse.move(start.x, start.y); await page.mouse.down(); }
      for (let step = 1; step <= 8; step++) {
        const point = { x: start.x + (end.x - start.x) * step / 8, y: start.y + (end.y - start.y) * step / 8 };
        if (touch) await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point] });
        else await page.mouse.move(point.x, point.y);
      }
      // Chromium may coalesce touchmove events until the next rendering frame.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const beforeRelease = Number(await range.inputValue());
      if (touch) await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      else await page.mouse.up();
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
      assert.equal(Number(await range.inputValue()), beforeRelease, 'Releasing a drag must not trigger an extra arrow click');
      return beforeRelease;
    }

    for (let index = 0; index < 8; index++) {
      const card = cards.nth(index);
      await card.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const range = card.locator('input[type=range]');
      const buttons = card.locator('.result-handle button');
      const visual = await card.locator('.result-visual').boundingBox();
      await range.fill('50');
      await (mobile ? buttons.nth(0).tap() : buttons.nth(0).click());
      await page.waitForFunction(({ index }) => document.querySelectorAll('.result-card input')[index].value === '35', { index });
      assert.equal(await range.inputValue(), '35', 'Left arrow must move the divider left');
      await (mobile ? buttons.nth(1).tap() : buttons.nth(1).click());
      await page.waitForFunction(({ index }) => document.querySelectorAll('.result-card input')[index].value === '50', { index });
      assert.equal(await range.inputValue(), '50', 'Right arrow must move the divider right');

      for (const [buttonIndex, direction] of [[1, 1], [0, -1]]) {
        await range.fill('50');
        const box = await buttons.nth(buttonIndex).boundingBox();
        const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
        const end = { x: start.x + direction * visual.width * .3, y: start.y };
        const value = await drag(start, end, range);
        assert.ok(direction > 0 ? value >= 77 : value <= 23, `${mobile ? 'touch' : 'mouse'}: card ${index} arrow drag did not follow pointer: ${value}`);
      }
      if (index === 0) {
        await range.fill('50');
        const y = visual.y + visual.height * .75;
        const value = await drag({ x: visual.x + visual.width * .2, y }, { x: visual.x + visual.width * .8, y }, range);
        assert.ok(value >= 77, 'Image area must also support dragging');
        for (const endValue of [0, 100]) {
          await range.fill('50');
          const box = await buttons.nth(endValue === 0 ? 1 : 0).boundingBox();
          const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
          await drag(start, { x: endValue === 0 ? visual.x - 10 : visual.x + visual.width + 10, y: start.y }, range);
          assert.equal(Number(await range.inputValue()), endValue, 'Pointer capture must reach the edge and clamp the value');
        }
        await range.press('Home'); assert.equal(await range.inputValue(), '0');
        await range.press('ArrowRight'); assert.equal(await range.inputValue(), '1');
        await range.press('End'); assert.equal(await range.inputValue(), '100');
        await range.press('ArrowLeft'); assert.equal(await range.inputValue(), '99');
        await range.fill('50');
      }
      await range.fill('50');
    }
    await cards.nth(0).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: `artifacts/comparison-drag-${mobile ? 'mobile' : 'desktop'}.png` });
    if (touch) {
      // Do this last: native momentum scrolling intentionally consumes a following tap.
      const range = cards.nth(0).locator('input');
      const visual = await cards.nth(0).locator('.result-visual').boundingBox();
      const y = visual.y + visual.height * .75;
      const scrollBefore = await page.evaluate(() => scrollY);
      await drag({ x: visual.x + visual.width * .2, y }, { x: visual.x + visual.width * .2, y: y - 100 }, range);
      assert.equal(await range.inputValue(), '50', 'Vertical swipes must not change the comparison');
      assert.ok(await page.evaluate(() => scrollY) > scrollBefore + 20, 'Vertical scrolling must remain available');
    }
    console.log(`${mobile ? 'Touch' : 'Mouse'}: all 8 cards passed arrow clicks, both handle drags, image dragging, release, and keyboard checks.`);
    if (touch) await touch.detach();
    await page.close();
  }
} finally { await browser.close(); }
