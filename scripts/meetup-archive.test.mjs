import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readArchive, localImage } from '../src/lib/meetup-archive.mjs';

const archive = readArchive();
test('complete 55-record public event census, including cancellations', () => {
  assert.equal(archive.events.length, 55);
  assert.equal(new Set(archive.events.map((event) => event.id)).size, 55);
  assert.equal(archive.events.filter((event) => event.status === 'cancelled').length, 3);
  assert.equal(archive.events.filter((event) => event.status === 'past').length, 52);
  assert.ok(archive.events.some((event) => event.id === '305841188'));
  assert.ok(archive.events.some((event) => event.id === '315053424'));
});
test('original descriptions, URLs and timezones exist for every event', () => {
  for (const event of archive.events) {
    assert.match(event.id, /^\d+$/);
    assert.equal(event.url, `https://www.meetup.com/biere-code-beer-paris/events/${event.id}/`);
    assert.ok(event.title.length > 0);
    assert.ok(event.description.length > 50, `Missing full description: ${event.id}`);
    assert.ok(Number.isFinite(Date.parse(event.start)), `Invalid date: ${event.id}`);
    if (event.end) assert.ok(Date.parse(event.end) >= Date.parse(event.start));
    assert.doesNotThrow(() => new Intl.DateTimeFormat('en', { timeZone: event.timezone }));
    assert.ok(event.rsvpCount === null || Number.isInteger(event.rsvpCount));
  }
});
test('group snapshot and all public album photographs are retained', () => {
  assert.equal(archive.group.memberCount, 237);
  assert.equal(archive.group.founded, '2025-01-24');
  assert.ok(archive.group.description.includes('English Below'));
  assert.equal(archive.albums.length, 9);
  const photos = new Map(archive.albums.flatMap((album) => album.photos).map((photo) => [photo.id || photo.url, photo]));
  assert.equal(photos.size, 27);
  for (const album of archive.albums) if (album.eventId) assert.ok(archive.events.some((event) => event.id === album.eventId));
});
test('every displayed source image has a verified local file', () => {
  const manifest = JSON.parse(readFileSync('public/meetup-archive/images.json', 'utf8'));
  const urls = [archive.group.cover, ...archive.events.map((event) => event.cover), ...archive.albums.flatMap((album) => album.photos.map((photo) => photo.url))].filter(Boolean);
  for (const url of new Set(urls)) {
    const path = localImage(url);
    assert.ok(path?.startsWith('/meetup-archive/images/'), `Missing image: ${url}`);
    const bytes = readFileSync(`public${path}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.images[url].sha256);
  }
});
test('French and English interface translations have identical keys', () => {
  const en = JSON.parse(readFileSync('src/locales/meetup-archive/en.json', 'utf8'));
  const fr = JSON.parse(readFileSync('src/locales/meetup-archive/fr.json', 'utf8'));
  assert.deepEqual(Object.keys(en).sort(), Object.keys(fr).sort());
  for (const value of [...Object.values(en), ...Object.values(fr)]) assert.ok(value.length > 0);
});
