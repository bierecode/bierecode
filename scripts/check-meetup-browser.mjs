import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { readArchive } from '../src/lib/meetup-archive.mjs';
const archive = readArchive();
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4321'], { stdio: 'inherit' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch('http://127.0.0.1:4321/archive/meetup/')).ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  assert.ok(ready, 'Preview server started');
  browser = await chromium.launch();
  await mkdir('test-results/meetup-archive', { recursive: true });
  const errors = [];
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.route('**/*', (route) => route.request().url().startsWith('http://127.0.0.1:4321/') ? route.continue() : route.abort());
    await page.goto('http://127.0.0.1:4321/archive/meetup/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('[data-event-id]').count(), 55);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
    await page.screenshot({ path: `test-results/meetup-archive/${name}-index.png`, fullPage: true });
    await page.selectOption('#archive-status', 'cancelled');
    assert.equal(await page.locator('[data-event-id]:visible').count(), 3);
    await page.selectOption('#archive-status', '');
    await page.fill('#archive-search', 'no-such-meetup-query-98h382');
    assert.equal(await page.locator('[data-event-id]:visible').count(), 0);
    assert.ok(await page.locator('#archive-empty').isVisible());
    await page.fill('#archive-search', '');
    assert.equal(await page.locator('[data-event-id]:visible').count(), 55);
    await page.locator('.lang').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    assert.equal(await page.locator('[data-event-id]').count(), 55);
    const event = archive.events.find((event) => archive.albums.some((album) => album.eventId === event.id)) || archive.events[0];
    await page.goto(`http://127.0.0.1:4321/archive/meetup/${event.id}/`, { waitUntil: 'networkidle' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Event has no horizontal overflow');
    await page.screenshot({ path: `test-results/meetup-archive/${name}-event.png`, fullPage: true });
    const broken = await page.locator('img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
    assert.deepEqual(broken, []);
    await page.close();
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const page = await noJs.newPage();
  await page.goto('http://127.0.0.1:4321/archive/meetup/');
  assert.equal(await page.locator('[data-event-id]').count(), 55);
  assert.ok(await page.locator('[data-archive-filters]').isHidden());
  assert.deepEqual(errors, []);
  console.log('Desktop/mobile, English/French, search, cancelled filter, images and no-JavaScript checks passed.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
