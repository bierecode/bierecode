// Snapshot past events from the public Bière & Code Luma calendar into public/meetup-archive/luma.json
// and preserve their cover images alongside the Meetup ones (run optimize-meetup-images.mjs afterwards).
// Only public event fields are kept; guest lists and attendee profiles are never stored.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const CALENDAR = 'cal-eY4yTc8unz1fs1b';
const API = 'https://api.lu.ma';
const OUT = 'public/meetup-archive/luma.json';
const MANIFEST = 'public/meetup-archive/images.json';

const get = async (path) => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`${API}${path}`, { headers: { 'User-Agent': 'bierecode-archive' }, signal: AbortSignal.timeout(30000) });
    if (response.ok) return response.json();
    if (attempt === 4 || response.status < 500) throw new Error(`${path}: HTTP ${response.status}`);
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
  }
};

/** Flatten Luma's ProseMirror description into the same lightly-Markdown text Meetup uses. */
const toText = (node) => {
  if (!node) return '';
  if (node.type === 'text') {
    const link = node.marks?.find((mark) => mark.type === 'link');
    return link ? `[${node.text}](${link.attrs.href})` : node.text;
  }
  if (node.type === 'hard_break') return '\n';
  const inner = (node.content || []).map(toText);
  if (node.type === 'list_item') return `• ${inner.join('').trim()}`;
  if (['doc', 'bullet_list', 'ordered_list'].includes(node.type)) return inner.join(node.type === 'doc' ? '\n\n' : '\n');
  return inner.join('');
};

const entries = [];
for (let cursor; ;) {
  const page = await get(`/calendar/get-items?calendar_api_id=${CALENDAR}&period=past&pagination_limit=50${cursor ? `&pagination_cursor=${cursor}` : ''}`);
  entries.push(...page.entries);
  if (!page.has_more) break;
  cursor = page.next_cursor;
}

const events = [];
for (const { event: { api_id: apiId } } of entries) {
  const detail = await get(`/event/get?event_api_id=${apiId}`);
  const { event } = detail;
  const geo = event.geo_address_info;
  events.push({
    id: event.url,
    source: 'luma',
    lumaApiId: event.api_id,
    url: `https://luma.com/${event.url}`,
    title: event.name,
    start: event.start_at,
    end: event.end_at,
    timezone: event.timezone,
    status: 'past',
    description: toText(detail.description_mirror).replace(/\n{3,}/g, '\n\n').trim(),
    venue: geo?.mode === 'shown' ? { name: geo.address, address: geo.full_address?.replace(`${geo.address}, `, '').replace(/, France$/, '') ?? null, city: geo.city } : null,
    hosts: detail.hosts.map((host) => host.name),
    rsvpCount: detail.guest_count ?? null,
    cover: event.cover_url,
  });
}
events.sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
writeFileSync(OUT, `${JSON.stringify({ schemaVersion: 1, capturedAt: new Date().toISOString(), calendar: { apiId: CALENDAR, url: 'https://luma.com/bierecode' }, events }, null, 2)}\n`);
console.log(`Captured ${events.length} past Luma events.`);

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
for (const { cover } of events) {
  if (!cover || manifest.images[cover]) continue;
  if (new URL(cover).hostname !== 'images.lumacdn.com') throw new Error(`Unexpected image origin: ${cover}`);
  const response = await fetch(cover, { signal: AbortSignal.timeout(30000) });
  const contentType = (response.headers.get('content-type') || '').split(';')[0];
  const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[contentType];
  if (!response.ok || !extension) throw new Error(`${cover}: HTTP ${response.status} ${contentType}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const path = `/meetup-archive/images/${createHash('sha256').update(cover).digest('hex').slice(0, 24)}.${extension}`;
  writeFileSync(`public${path}`, bytes);
  manifest.images[cover] = { path, source: cover, contentType, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), capturedAt: new Date().toISOString() };
}
manifest.totalImages = Object.keys(manifest.images).length;
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
