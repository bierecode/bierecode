// Convert the preserved Meetup originals into small responsive WebP variants.
// Originals stay in git history; the manifest keeps their source URL and sha256.
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const MANIFEST = 'public/meetup-archive/images.json';
const OUT = 'public/meetup-archive/optimized';
const WIDTHS = [640, 1280];

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
mkdirSync(OUT, { recursive: true });

for (const entry of Object.values(manifest.images)) {
  if (entry.optimized) continue;
  const original = `public${entry.path}`;
  if (!existsSync(original)) throw new Error(`Missing original: ${original}`);
  const name = entry.path.split('/').pop().replace(/\.\w+$/, '');
  // EXIF orientations 5-8 swap the displayed width and height.
  const meta = await sharp(original).metadata();
  const [width, height] = (meta.orientation ?? 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
  const variants = [];
  for (const target of WIDTHS) {
    const w = Math.min(target, width);
    const file = `${OUT}/${name}-${target}.webp`;
    const info = await sharp(original).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 75 }).toFile(file);
    variants.push({ path: file.replace(/^public/, ''), width: info.width, height: info.height, bytes: info.size });
  }
  entry.optimized = { width, height, variants };
  rmSync(original);
  console.log(`${name}: ${entry.bytes} → ${variants.map((v) => v.bytes).join(' / ')} bytes`);
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
