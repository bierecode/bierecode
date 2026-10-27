import { readArchive, readSource } from '../../../lib/meetup-archive.mjs';
export const prerender = true;
export function GET() {
  return new Response(JSON.stringify({ archive: readArchive(), source: readSource() }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
