import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let source;
let images;
let archive;

/** Load the immutable public-source snapshot at build time, never from Meetup at runtime. */
export function readSource() {
  source ??= JSON.parse(readFileSync(resolve('public/meetup-archive/source.json'), 'utf8'));
  return source;
}

const normaliseTitle = (title) => title.toLowerCase().replace(/\bbcb\b/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * Meetup's export leaves album.eventId empty. Albums are created alongside their event,
 * so link each one to the first event with the same title starting within a week of it.
 */
function linkAlbum(album, events) {
  if (album.eventId) return album;
  const created = Date.parse(album.createdAt);
  const match = events
    .filter((event) => normaliseTitle(event.title) === normaliseTitle(album.title))
    .filter((event) => Date.parse(event.start) >= created - 86_400_000 && Date.parse(event.start) - created <= 7 * 86_400_000)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
  return { ...album, eventId: match?.id ?? null };
}

/** Return the presentation schema while retaining all captured fields in the source export. */
export function readArchive() {
  if (!archive) {
    const raw = readSource().archive;
    archive = { ...raw, albums: raw.albums.map((album) => linkAlbum(album, raw.events)) };
  }
  return archive;
}

/**
 * Only return verified, locally preserved optimized images; never silently hotlink the old host.
 * Returns { src, srcset, width, height } for use in <img>.
 */
export function localImage(url) {
  if (!url) return null;
  images ??= JSON.parse(readFileSync(resolve('public/meetup-archive/images.json'), 'utf8')).images;
  const optimized = images[url]?.optimized;
  if (!optimized) return null;
  const { variants, width, height } = optimized;
  return {
    src: variants[variants.length - 1].path,
    srcset: variants.map((variant) => `${variant.path} ${variant.width}w`).join(', '),
    width,
    height,
  };
}
