import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const path = 'public/meetup-archive/source.json';
const source = JSON.parse(await readFile(path, 'utf8'));
source.archive.group.cover ||= source.original.group.keyGroupPhoto.highResUrl;
const browser = await chromium.launch();
const context = await browser.newContext();
const diagnostics = [];
const schemas = new Map();
const typeFields = 'kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } }';
const unwrap = type => type.name ? type : unwrap(type.ofType);
async function query(query) {
  const response = await context.request.post('https://www.meetup.com/gql2', { data: { query }, timeout: 30000 });
  const result = await response.json();
  diagnostics.push({ query, status: response.status(), result });
  if (!response.ok() || result.errors) throw new Error(JSON.stringify(result));
  return result.data;
}
async function schema(name) {
  if (!schemas.has(name)) {
    const data = await query(`query { __type(name:${JSON.stringify(name)}) { name kind fields { name type { ${typeFields} } args { name defaultValue type { ${typeFields} } } } inputFields { name defaultValue type { ${typeFields} } } } }`);
    schemas.set(name, data.__type);
  }
  return schemas.get(name);
}
const fieldsAllowed = new Set(['id','title','description','caption','photoCount','photoId','highResUrl','source','standardUrl','thumbUrl','baseUrl','url','link','eventId','event','photoSample','photos','photo','photoInfo','albumPhotos','album','data','payload','edges','node','totalCount','pageInfo','hasNextPage','endCursor','cursor','createdAt','createdTime','updatedAt','updatedTime','dateTime','creationDate','recentActivity','type']);
async function selection(typeName, depth = 6, seen = []) {
  const type = await schema(typeName);
  if (!type?.fields || depth < 0 || seen.includes(typeName)) return '';
  const selected = [];
  for (const field of type.fields) {
    if (!fieldsAllowed.has(field.name)) continue;
    const args = [];
    let supported = true;
    for (const arg of field.args || []) {
      if (['first','number','limit'].includes(arg.name)) args.push(`${arg.name}:100`);
      else if (arg.type.kind === 'NON_NULL' && arg.defaultValue == null) { supported = false; break; }
    }
    if (!supported) continue;
    const inner = unwrap(field.type);
    const name = `${field.name}${args.length ? `(${args.join(',')})` : ''}`;
    if (inner.kind === 'SCALAR' || inner.kind === 'ENUM') selected.push(name);
    else {
      const nested = await selection(inner.name, depth - 1, [...seen, typeName]);
      if (nested) selected.push(`${name} { ${nested} }`);
    }
  }
  return selected.join(' ');
}
function allObjects(value) {
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(allObjects)];
}
try {
  const root = await schema('Query');
  const listing = await query('query { photoAlbums(chapterId:"37879641") { id title photoCount eventId creationDate recentActivity type } }');
  assert.ok(Array.isArray(listing.photoAlbums), 'Public album listing returned an array');
  // Meetup includes virtual, empty event albums. The nine non-empty albums contain all public images.
  const rows = listing.photoAlbums.filter(album => album.photoCount > 0);
  const payloadType = unwrap(root.fields.find(field => field.name === 'photoAlbum').type).name;
  const payloadSelection = await selection(payloadType, 7);
  console.log('Album payload selection:', payloadSelection);
  const albums = [];
  const originalAlbums = [];
  for (const row of rows) {
    const result = await query(`query { photoAlbum(albumId:${JSON.stringify(String(row.id))}) { ${payloadSelection} } }`);
    originalAlbums.push({ id: String(row.id), result });
    const objects = allObjects(result.photoAlbum.albumPhotos);
    const photoMap = new Map();
    for (const item of objects) {
      const info = item.photoInfo || item.photo || item;
      const url = info.highResUrl || info.source || info.standardUrl;
      const photoId = info.id || item.photoId;
      if (photoId && url && /meetupstatic\.com/.test(url)) {
        const id = String(photoId);
        const previous = photoMap.get(id);
        photoMap.set(id, { id, url, caption: item.caption || item.description || previous?.caption || '', original: { ...previous?.original, ...item } });
      }
    }
    assert.equal(photoMap.size, row.photoCount, `All photos captured for album ${row.id}`);
    const previous = source.archive.albums.find(album => album.id === String(row.id));
    albums.push({ id: String(row.id), title: row.title, eventId: previous?.eventId || row.eventId || null, createdAt: row.creationDate, updatedAt: row.recentActivity, photos: [...photoMap.values()] });
    console.log(`Album ${row.id}: ${photoMap.size} photos; ${row.title}`);
  }
  source.archive.albums = albums;
  source.original.groupAlbums = { listing, details: originalAlbums };
  source.provenance.albumCaptureCompletedAt = new Date().toISOString();
  source.provenance.albumQueries = diagnostics.filter(item => !item.query.includes('__type')).map(({query})=>query);
  const photoCount = new Set(albums.flatMap(album => album.photos.map(photo => photo.id))).size;
  assert.equal(albums.length, 9);
  assert.equal(photoCount, 27);
  assert.ok(source.archive.group.cover);
  await writeFile(path, `${JSON.stringify(source,null,2)}\n`);
  console.log(`Complete: ${source.archive.events.length} events, ${albums.length} albums, ${photoCount} unique photographs.`);
} finally {
  await writeFile('test-results/meetup-archive/photo-schema.json', JSON.stringify(diagnostics,null,2));
  await browser.close();
}
