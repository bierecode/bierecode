import { chromium } from '@playwright/test';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// This is a one-time, anonymous public-content capture. No login or account mutation.
const groupUrl = 'https://www.meetup.com/biere-code-beer-paris/';
const ids = '315053424,314857841,314753476,314575264,314521858,314264117,314162859,313931564,313615740,313724902,313615151,313521998,313383248,313174428,313077818,312969666,312844146,312730743,312212837,312114619,312010351,312116411,312011577,311978139,311852906,311735196,311630458,311189850,311053721,310957938,310693185,310354473,310144648,310100529,309649068,309101756,308777881,308613590,308528141,308229480,308060722,307877947,307524130,307416841,307253301,307108239,307022894,306845199,306768453,306629164,306511347,306347087,306201414,306048346,305841188'.split(',');
const output = 'public/meetup-archive/source.json';
try { await access(output); throw new Error('Snapshot already exists. Refusing to overwrite archival source.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir('public/meetup-archive', { recursive: true });
await mkdir('test-results/meetup-archive', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ locale: 'en-GB' });
await context.route('**/*', route => ['image', 'font', 'media'].includes(route.request().resourceType()) ? route.abort() : route.continue());
const page = await context.newPage();
const errors = [];
const rawEvents = [];
const albumPayloads = [];
const groupQueries = [];
const sourceRequests = [];
const pick = (value, keys) => Object.fromEntries(keys.filter(key => value?.[key] !== undefined).map(key => [key, value[key]]));
function resolveReferences(value, state, seen = new Set()) {
  if (!value || typeof value !== 'object') return value;
  if (value.__ref) {
    if (seen.has(value.__ref)) return null;
    return resolveReferences(state[value.__ref], state, new Set([...seen, value.__ref]));
  }
  if (Array.isArray(value)) return value.map(item => resolveReferences(item, state, seen));
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(__typename|member|memberPhoto|attendees|rsvps|password|email|gender)$/.test(key)).map(([key, item]) => [key, resolveReferences(item, state, seen)]));
}
function redact(value) {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(redact);
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/^(member|memberPhoto|attendees|rsvps|password|email|gender|uploader|uploadedBy)$/.test(key)).map(([key, item]) => [key, redact(item)]));
}
async function propsAt(target, url, expectedId) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await target.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
      const data = await target.locator('#__NEXT_DATA__').textContent({ timeout: 12000 });
      const props = JSON.parse(data).props.pageProps;
      if (expectedId && String(props.event?.id) !== expectedId) throw new Error(`Expected public event ${expectedId}; got ${target.url()}`);
      return props;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}
async function gql(body) {
  sourceRequests.push(body);
  const response = await context.request.post('https://www.meetup.com/gql2', { data: body, timeout: 30000 });
  return { status: response.status(), body: await response.json() };
}
let group;
let groupSource;
try {
  const props = await propsAt(page, groupUrl);
  const state = props.__APOLLO_STATE__;
  const rawGroup = Object.values(state).find(value => value?.__typename === 'Group' && value.urlname === 'biere-code-beer-paris');
  if (!rawGroup || rawGroup.isPrivate) throw new Error('Public source group not found');
  groupSource = resolveReferences(pick(rawGroup, ['id','name','description','timezone','urlname','city','state','country','foundedDate','stats','keyGroupPhoto','organizer','activeTopics','socialNetworks','welcomeBlurb','video','sponsors']), state);
  group = {
    name: groupSource.name, url: groupUrl, description: groupSource.description,
    founded: groupSource.foundedDate.slice(0,10), city: groupSource.city,
    timezone: groupSource.timezone, memberCount: groupSource.stats.memberCounts.all,
    rating: groupSource.stats.eventRatings.average, ratingCount: groupSource.stats.eventRatings.total,
    organizers: [groupSource.organizer?.name].filter(Boolean),
    topics: groupSource.activeTopics.map(topic => topic.name),
    cover: groupSource.keyGroupPhoto?.source || null,
  };
  // Public album connection. Errors are retained for reproducible schema diagnostics.
  for (const query of [
    'query { groupByUrlname(urlname:"biere-code-beer-paris") { id photoAlbums(first:100) { totalCount edges { node { id title photoCount } } } } }',
    'query { groupByUrlname(urlname:"biere-code-beer-paris") { id photoAlbums(first:100) { totalCount edges { node { id title } } } } }'
  ]) {
    const result = await gql({ query });
    groupQueries.push({ query, result });
    console.log('Group album query:', JSON.stringify(result).slice(0,5000));
    if (!result.body.errors) break;
  }
  let index = 0;
  async function worker() {
    const tab = await context.newPage();
    while (index < ids.length) {
      const id = ids[index++];
      try {
        const props = await propsAt(tab, `${groupUrl}events/${id}/`, id);
        const raw = props.event;
        const event = pick(raw, ['id','title','description','eventUrl','status','eventType','dateTime','endTime','timezone','createdTime','featuredEventPhoto','displayPhoto','eventHosts','hosts','host','venue','goingCount','waitingCount','maxTickets','guestsAllowed','numberOfAllowedGuests','feeSettings','topics','covidPrecautions','externalChat','speakerDetails','komootUrl','howToFindUs']);
        event.eventHosts = (event.eventHosts || event.hosts || []).map(host => ({ name: host.name }));
        delete event.hosts;
        delete event.host;
        const album = await gql({ operationName: 'getEventByIdPhotoAlbum', variables: { eventId: id, number: 100 }, extensions: { persistedQuery: { version: 1, sha256Hash: 'f5b434f7d81e585e5661afaa72fe6c5df898a9f9089441273831d79d751d2df9' } } });
        albumPayloads.push({ eventId: id, ...redact(album) });
        rawEvents.push(event);
        console.log(`Captured event ${id}: ${event.dateTime}; ${event.description.length} description characters; album ${JSON.stringify(album).slice(0,160)}`);
      } catch (error) { errors.push({ eventId: id, error: String(error) }); console.error(`Event ${id}:`, error); }
    }
    await tab.close();
  }
  await Promise.all([worker(), worker()]);
} finally {
  await browser.close();
}
function findAlbums(value) {
  if (!value || typeof value !== 'object') return [];
  if (value.__typename?.includes('PhotoAlbum') && value.id) return [value];
  return Object.values(value).flatMap(findAlbums);
}
function findPhotos(value) {
  if (!value || typeof value !== 'object') return [];
  if (value.id && (value.__typename === 'PhotoInfo' || value.__typename === 'Photo') && (value.source || value.photoUrl || value.highResUrl)) return [value];
  return Object.values(value).flatMap(findPhotos);
}
const albumsById = new Map();
for (const payload of albumPayloads) {
  for (const raw of findAlbums(payload.body)) {
    const photos = [...new Map(findPhotos(raw.photos || raw).map(photo => [String(photo.id), { id: String(photo.id), url: photo.source || photo.photoUrl || photo.highResUrl, caption: photo.caption || '', original: redact(photo) }])).values()];
    albumsById.set(String(raw.id), { id: String(raw.id), title: raw.title || '', eventId: payload.eventId, photos });
  }
}
const events = rawEvents.map(raw => ({
  id: String(raw.id), url: raw.eventUrl, title: raw.title,
  start: raw.dateTime, end: raw.endTime || null, timezone: raw.timezone || group.timezone,
  status: /CANCEL/i.test(raw.status) ? 'cancelled' : 'past', description: raw.description,
  venue: raw.venue || null, hosts: raw.eventHosts.map(host => host.name).filter(Boolean),
  rsvpCount: raw.goingCount?.totalCount ?? null,
  cover: raw.featuredEventPhoto?.source || raw.displayPhoto?.source || null,
})).sort((a,b) => Date.parse(b.start) - Date.parse(a.start));
const source = {
  schemaVersion: 1,
  archive: { capturedAt: new Date().toISOString(), group, events, albums: [...albumsById.values()] },
  provenance: { source: groupUrl, method: 'Anonymous Playwright browser capture of public page structured data and public photo-album queries', expectedEventIds: ids, rosterExcluded: true, comments: 'No public event comments were exposed during capture.', errors },
  original: { group: groupSource, events: rawEvents, albums: albumPayloads, groupAlbumQueries: groupQueries, requests: sourceRequests },
};
const json = `${JSON.stringify(source, null, 2)}\n`;
await writeFile(output, json);
await writeFile('test-results/meetup-archive/capture-summary.json', JSON.stringify({ events: events.length, cancelled: events.filter(event => event.status === 'cancelled').length, albums: source.archive.albums.length, photos: source.archive.albums.reduce((sum,album)=>sum+album.photos.length,0), errors, sha256: createHash('sha256').update(json).digest('hex') },null,2));
console.log(`Snapshot: ${events.length} events, ${source.archive.albums.length} albums, ${source.archive.albums.reduce((sum,album)=>sum+album.photos.length,0)} photos.`);
if (errors.length || events.length !== 55) throw new Error(`Incomplete public event capture: ${JSON.stringify(errors)}`);
