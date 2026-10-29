import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { readArchive, readLuma, localImage } from '../src/lib/meetup-archive.mjs';

const archive = readArchive();
const meetupEvents = archive.events.filter((event) => event.source === 'meetup');
test('complete 55-record public event census, including cancellations', () => {
  assert.equal(meetupEvents.length, 55);
  assert.equal(new Set(meetupEvents.map((event) => event.id)).size, 55);
  assert.equal(meetupEvents.filter((event) => event.status === 'cancelled').length, 3);
  assert.equal(meetupEvents.filter((event) => event.status === 'past').length, 52);
  assert.ok(archive.events.some((event) => event.id === '305841188'));
  assert.ok(archive.events.some((event) => event.id === '315053424'));
});
test('original descriptions, URLs and timezones exist for every event', () => {
  for (const event of archive.events) {
    assert.match(event.id, event.source === 'luma' ? /^[a-z0-9]+$/ : /^\d+$/);
    assert.equal(event.url, event.source === 'luma' ? `https://luma.com/${event.id}` : `https://www.meetup.com/biere-code-beer-paris/events/${event.id}/`);
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
test('every displayed source image has optimized local variants', () => {
  const urls = [archive.group.cover, ...archive.events.map((event) => event.cover), ...archive.albums.flatMap((album) => album.photos.map((photo) => photo.url))].filter(Boolean);
  for (const url of new Set(urls)) {
    const image = localImage(url);
    assert.ok(image?.src.startsWith('/meetup-archive/optimized/'), `Missing image: ${url}`);
    for (const [path] of image.srcset.split(', ').map((entry) => entry.split(' '))) {
      assert.ok(existsSync(`public${path}`), `Missing variant: ${path}`);
      assert.ok(statSync(`public${path}`).size < 400_000, `Variant too large: ${path}`);
    }
  }
});
test('albums are linked to their events', () => {
  assert.equal(archive.albums.filter((album) => album.eventId).length, 7);
  assert.equal(archive.albums.find((album) => album.title.includes('Demo Night')).eventId, '313615740');
});
test('Luma events are merged without duplicates or guest data', () => {
  const luma = readLuma();
  assert.equal(luma.events.length, 15);
  assert.equal(archive.events.filter((event) => event.source === 'luma').length, 9);
  assert.equal(archive.events.filter((event) => event.luma).length, 6);
  assert.equal(archive.events.find((event) => event.id === '313615740').luma.url, 'https://luma.com/ypyzfm7e');
  assert.equal(archive.events.length, 64);
  const raw = JSON.stringify(luma);
  for (const key of ['guest_data', 'featured_guests', 'email', 'avatar_url']) assert.ok(!raw.includes(key), `Luma snapshot leaks ${key}`);
});
test('French and English interface translations have identical keys', () => {
  const en = JSON.parse(readFileSync('src/locales/meetup-archive/en.json', 'utf8'));
  const fr = JSON.parse(readFileSync('src/locales/meetup-archive/fr.json', 'utf8'));
  assert.deepEqual(Object.keys(en).sort(), Object.keys(fr).sort());
  for (const value of [...Object.values(en), ...Object.values(fr)]) assert.ok(value.length > 0);
});
