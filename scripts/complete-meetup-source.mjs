import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const path = 'public/meetup-archive/source.json';
const source = JSON.parse(await readFile(path, 'utf8'));
source.archive.group.cover ||= source.original.group.keyGroupPhoto.highResUrl;
const browser = await chromium.launch();
const context = await browser.newContext();
const diagnostics = [];
async function query(query) {
  const response = await context.request.post('https://www.meetup.com/gql2', { data: { query }, timeout: 30000 });
  const data = await response.json();
  diagnostics.push({ query, status: response.status(), data });
  return data;
}
try {
  for (const name of ['Group', 'Query', 'EventPhotoAlbum', 'PhotoInfo']) {
    const data = await query(`query { __type(name:"${name}") { name fields { name type { kind name ofType { kind name ofType { kind name } } } args { name type { kind name ofType { kind name } } } } } }`);
    const fields = data.data?.__type?.fields;
    console.log('PHOTO_SCHEMA', name, JSON.stringify(fields ? fields.filter(field => /photo|album|caption/i.test(field.name) || name === 'EventPhotoAlbum') : data));
  }
} finally { await browser.close(); }
await writeFile('test-results/meetup-archive/photo-schema.json', JSON.stringify(diagnostics, null, 2));
await writeFile(path, `${JSON.stringify(source,null,2)}\n`);
