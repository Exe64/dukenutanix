#!/usr/bin/env node
// Browser smoke test: loads the game in headless Chromium, plays E1M1 for a few
// seconds in each style (walking, turning, firing, opening the pause menu) and fails
// on any page error or console error. Drives the game through window.__duke.
// Usage (Playwright is not a dependency of the game, install it on the side):
//   npm install --no-save playwright && npx playwright install chromium
//   node tools/smoke-test.js
// CHROMIUM=/path/to/chrome uses another Chromium build.
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');

async function run(style) {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM || undefined,
    // no sound card on a CI runner: a fake audio output avoids WebAudio device errors
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-audio-output'],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.setDefaultTimeout(180000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript((st) => { try { localStorage.setItem('dukenutanix.style', st); } catch (e) { /* ignored */ } }, style);
  await page.goto('file://' + path.join(root, 'index.html'));
  await page.waitForFunction(() => window.__duke && window.__duke.state === 'title');
  await page.evaluate(() => window.__duke.actions.play(0));
  await page.waitForFunction(() => window.__duke.state === 'briefing');
  await page.evaluate(() => document.querySelector('#panel [data-go]').click());
  await page.waitForFunction(() => window.__duke.state === 'playing');
  const hold = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); };
  await hold('KeyW', 1500);
  await hold('ArrowLeft', 500);
  await hold('ControlLeft', 800);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => window.__duke.state === 'paused');
  const result = await page.evaluate(() => ({ state: window.__duke.state, level: window.__duke.L.def.code, time: +window.__duke.L.time.toFixed(2) }));
  await browser.close();
  return { style, ...result, errors };
}

(async () => {
  let ok = true;
  for (const style of ['modern', 'retro']) {
    const r = await run(style);
    const good = !r.errors.length && r.state === 'paused' && r.level === 'E1M1' && r.time > 0;
    console.log(`${style.padEnd(6)} ${good ? 'OK' : 'ERROR'}  ${r.level} played ${r.time} s, state ${r.state}`);
    r.errors.slice(0, 5).forEach((e) => console.log('   ' + e));
    ok = ok && good;
  }
  console.log(ok ? 'Smoke test OK' : 'Smoke test failed');
  process.exit(ok ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
