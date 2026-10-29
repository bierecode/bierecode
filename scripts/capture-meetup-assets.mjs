import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { readArchive } from '../src/lib/meetup-archive.mjs';

const root = resolve('public/meetup-archive');
await mkdir(resolve(root, 'images'), { recursive: true });
const archive = readArchive();
const urls = [...new Set([archive.group.cover, ...archive.events.map((event) => event.cover), ...archive.albums.flatMap((album) => album.photos.map((photo) => photo.url)), ...(archive.extraImageUrls || [])].filter(Boolean))].sort();
let manifest = { schemaVersion: 1, images: {} };
try { manifest = JSON.parse(await readFile(resolve(root, 'images.json'), 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const errors = [];
for (const source of urls) {
  const url = new URL(source);
  if (url.protocol !== 'https:' || !/(^|\.)meetupstatic\.com$/.test(url.hostname)) throw new Error(`Unexpected image origin: ${url.origin}`);
  const previous = manifest.images[source];
  if (previous) {
    try {
      const bytes = await readFile(resolve('public', previous.path.replace(/^\//, '')));
      if (sha256(bytes) === previous.sha256 && bytes.length === previous.bytes) continue;
    } catch {}
  }
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), redirect: 'error' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = (response.headers.get('content-type') || '').split(';')[0];
      const extension = extensions[contentType];
      if (!extension) throw new Error(`Unexpected image MIME type ${contentType}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 32 || bytes.length > 25 * 1024 * 1024) throw new Error(`Invalid image size ${bytes.length}`);
      const magicOk = contentType === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 : contentType === 'image/png' ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : contentType === 'image/webp' ? bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP' : bytes.toString('ascii',0,3) === 'GIF';
      if (!magicOk) throw new Error('Image signature does not match MIME type');
      const path = `/meetup-archive/images/${sha256(source).slice(0,24)}.${extension}`;
      await writeFile(resolve('public', path.slice(1)), bytes);
      manifest.images[source] = { path, source, contentType, bytes: bytes.length, sha256: sha256(bytes), capturedAt: new Date().toISOString() };
      console.log(`Preserved ${source}: ${bytes.length} bytes`);
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  if (lastError) errors.push({ source, error: String(lastError) });
}
manifest.errors = errors;
manifest.totalImages = Object.keys(manifest.images).length;
await writeFile(resolve(root, 'images.json'), `${JSON.stringify(manifest, null, 2)}\n`);
if (errors.length) throw new Error(`Failed to preserve ${errors.length} images: ${JSON.stringify(errors)}`);
console.log(`Verified ${urls.length} image URLs. All image bytes are stored locally.`);
