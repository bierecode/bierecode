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
const fieldsAllowed = new Set(['id','title','description','caption','photoCount','highResUrl','source','standardUrl','thumbUrl','baseUrl','url','link','eventId','event','photoSample','photos','photo','photoInfo','album','data','payload','edges','node','totalCount','pageInfo','hasNextPage','endCursor','cursor','createdAt','createdTime','updatedAt','updatedTime','dateTime']);
async function selection(typeName, depth = 5, seen = []) {
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
  const listField = root.fields.find(field => field.name === 'photoAlbums');
  const listSelection = await selection(unwrap(listField.type).name);
  console.log('Album selection:', listSelection);
  const listing = await query(`query { photoAlbums(chapterId:"37879641") { ${listSelection} } }`);
  const rows = listing.photoAlbums;
  assert.ok(Array.isArray(rows), 'Public album listing returned an array');
  console.log('Public album listing:', JSON.stringify(rows).slice(0,5000));
  const payloadType = unwrap(root.fields.find(field => field.name === 'photoAlbum').type).name;
  const payloadSelection = await selection(payloadType, 7);
  console.log('Album payload selection:', payloadSelection);
  const albums = [];
  const originalAlbums = [];
  for (const row of rows) {
    const result = await query(`query { photoAlbum(albumId:${JSON.stringify(String(row.id))}) { ${payloadSelection} } }`);
    originalAlbums.push({ id: String(row.id), result });
    const objects = allObjects(result);
    const photoMap = new Map();
    // Photo payloads may wrap the immutable PhotoInfo in a caption-bearing parent.
    for (const item of objects) {
      const info = item.photoInfo || item.photo || item;
      const url = info.highResUrl || info.source || info.standardUrl;
      if (info.id && url && /meetupstatic\.com/.test(url)) {
        const id = String(info.id);
        const previous = photoMap.get(id);
        photoMap.set(id, { id, url, caption: item.caption || item.description || previous?.caption || '', original: { ...previous?.original, ...item } });
      }
    }
    for (const photo of allObjects(row)) {
      const url = photo.highResUrl || photo.source || photo.standardUrl;
      if (photo.id && url && !photoMap.has(String(photo.id))) photoMap.set(String(photo.id), { id: String(photo.id), url, caption: photo.caption || '', original: photo });
    }
    const previous = source.archive.albums.find(album => album.id === String(row.id));
    const linkedEvent = objects.find(item => item.event?.id)?.event;
    albums.push({ id: String(row.id), title: row.title || objects.find(item => item.title)?.title || '', eventId: previous?.eventId || (linkedEvent ? String(linkedEvent.id) : null), photos: [...photoMap.values()] });
    console.log(`Album ${row.id}: ${photoMap.size} photos; ${albums.at(-1).title}`);
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
