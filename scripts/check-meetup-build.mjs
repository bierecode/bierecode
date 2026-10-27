import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readArchive } from '../src/lib/meetup-archive.mjs';
const archive = readArchive();
for (const prefix of ['archive/meetup', 'fr/archive/meetup']) {
  const index = readFileSync(`dist/${prefix}/index.html`, 'utf8');
  assert.equal((index.match(/data-event-id=/g) || []).length, 55);
  assert.ok(index.includes('https://luma.com/bierecode'));
  for (const event of archive.events) {
    const html = readFileSync(`dist/${prefix}/${event.id}/index.html`, 'utf8');
    assert.ok(html.includes(event.id));
    assert.ok(html.includes('https://luma.com/bierecode'));
    assert.ok(!/<img[^>]+src="https?:\/\/[^\"]*meetupstatic\.com/i.test(html), 'No hotlinked Meetup images');
    for (const [, src] of html.matchAll(/<img[^>]+src="(\/[^\"]+)"/g)) assert.ok(existsSync(`dist${src}`), `Missing static image ${src}`);
    for (const [, href] of html.matchAll(/href="(\/(?:fr\/)?archive\/meetup\/[^"?#]*)"/g)) {
      const path = href.endsWith('/') ? `${href}index.html` : href;
      assert.ok(existsSync(`dist${path}`), `Broken archive link: ${href}`);
    }
  }
}
const exported = JSON.parse(readFileSync('dist/archive/meetup/data.json', 'utf8'));
assert.ok(exported);
console.log('112 archive HTML pages, data export, local image references and internal links verified.');
