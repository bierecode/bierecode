import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Supplement the public event snapshot with all non-empty group albums.
const path = 'public/meetup-archive/source.json';
const source = JSON.parse(await readFile(path, 'utf8'));
source.archive.group.cover ||= source.original.group.keyGroupPhoto.highResUrl;
const browser = await chromium.launch();
const context = await browser.newContext();
const diagnostics = [];
async function query(query) {
  const response = await context.request.post('https://www.meetup.com/gql2', { data: { query }, timeout: 30000 });
  const result = await response.json();
  diagnostics.push({ query, status: response.status(), result });
  if (!response.ok() || result.errors) throw new Error(JSON.stringify(result));
  return result.data;
}
try {
  const listing = await query('query { photoAlbums(chapterId:"37879641") { id title photoCount eventId creationDate recentActivity type } }');
  assert.ok(Array.isArray(listing.photoAlbums), 'Public album listing returned an array');
  const rows = listing.photoAlbums.filter(album => album.photoCount > 0);
  const albums = [];
  const originalAlbums = [];
  for (const row of rows) {
    const result = await query(`query { photoAlbum(albumId:${JSON.stringify(String(row.id))}) { albumPhotos { edges { cursor node { caption id url } } pageInfo { endCursor hasNextPage } totalCount } creationDate eventId id photoCount recentActivity title type } }`);
    originalAlbums.push({ id: String(row.id), result });
    const connection = result.photoAlbum.albumPhotos;
    assert.equal(connection.pageInfo.hasNextPage, false, `All pages captured for album ${row.id}`);
    const photos = connection.edges.map(({ node }) => ({ id: String(node.id), url: node.url, caption: node.caption || '', original: node }));
    assert.equal(new Set(photos.map(photo => photo.id)).size, row.photoCount, `All photos captured for album ${row.id}`);
    for (const photo of photos) {
      const url = new URL(photo.url);
      assert.equal(url.protocol, 'https:');
      assert.ok(/(^|\.)meetupstatic\.com$/.test(url.hostname));
    }
    // The group listing returns eventId "0" even for event albums; the detail is authoritative.
    const linkedId = String(result.photoAlbum.eventId || '');
    const eventId = source.archive.events.some(event => event.id === linkedId) ? linkedId : null;
    albums.push({ id: String(row.id), title: result.photoAlbum.title || row.title, eventId, createdAt: row.creationDate, updatedAt: row.recentActivity, photos });
    console.log(`Album ${row.id}: ${photos.length} photos; event ${eventId || 'group-level'}`);
  }
  assert.equal(albums.filter(album => album.eventId).length, 7, 'All seven event galleries are linked');
  assert.equal(albums.find(album => album.id === '35885824').eventId, '313615740');
  source.archive.albums = albums;
  source.original.groupAlbums = { listing, details: originalAlbums };
  source.provenance.albumCaptureCompletedAt = new Date().toISOString();
  source.provenance.albumQueries = diagnostics.map(({ query }) => query);
  const photoCount = new Set(albums.flatMap(album => album.photos.map(photo => photo.id))).size;
  assert.equal(albums.length, 9);
  assert.equal(photoCount, 27);
  assert.ok(source.archive.group.cover);
  await writeFile(path, `${JSON.stringify(source, null, 2)}\n`);
  console.log(`Complete: ${source.archive.events.length} events, ${albums.length} albums, ${photoCount} photographs, seven linked event galleries.`);
} finally {
  await writeFile('test-results/meetup-archive/photo-schema.json', JSON.stringify(diagnostics, null, 2));
  await browser.close();
}
