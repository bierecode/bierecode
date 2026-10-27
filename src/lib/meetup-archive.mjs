import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let source;
let images;

/** Load the immutable public-source snapshot at build time, never from Meetup at runtime. */
export function readSource() {
  source ??= JSON.parse(readFileSync(resolve('public/meetup-archive/source.json'), 'utf8'));
  return source;
}

/** Return the presentation schema while retaining all captured fields in the source export. */
export function readArchive() {
  return readSource().archive;
}

/** Only return verified, locally preserved image paths; never silently hotlink the old host. */
export function localImage(url) {
  if (!url) return null;
  images ??= JSON.parse(readFileSync(resolve('public/meetup-archive/images.json'), 'utf8')).images;
  return images[url]?.path ?? null;
}
