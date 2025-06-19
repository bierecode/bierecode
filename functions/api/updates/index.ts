/**
 * Community updates API.
 *
 * Deployed as a Cloudflare Pages Function and backed by Workers KV.
 * Provides JSON endpoints:
 *   - GET  /api/updates  -> list stored updates with optional filters
 *   - POST /api/updates  -> create a new update, authenticated via HTTP Basic
 *
 * The KV namespace binding is named `UPDATES_KV` and is provisioned by Terraform.
 * Build and deployment are handled automatically by GitHub Actions.
 */
// Cloudflare Pages Function: Manage community updates
//
// This handler provides a simple JSON API backed by a KV namespace. It supports
// GET requests for listing updates and POST requests for creating new updates.
//
// Updates are stored as JSON objects keyed by a generated UUID. Basic
// authentication protects write operations. Provide credentials using the
// environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
//
// Expected JSON for POST requests:
// {
//   title: string,
//   content: string,
//   language: 'en' | 'fr' | string,
//   type: 'post' | 'event',
//   tags?: string[],
//   event?: { date?: string; time?: string; location?: string; duration?: string }
// }
//
// Query params for GET:
//   language - filter by language
//   type     - filter by 'post' or 'event'
//   tag      - filter where tags contain this value
//
// The KV binding is configured as `UPDATES_KV` in wrangler.toml.
// Compatibility date must be defined in wrangler.toml as well.

interface Update {
  id: string;
  title: string;
  content: string;
  language: string;
  type: 'post' | 'event';
  tags?: string[];
  event?: {
    date?: string;
    time?: string;
    location?: string;
    duration?: string;
  };
  created: string;
}

/** Helper to parse basic auth credentials */
function parseBasicAuth(authHeader: string | null): [string, string] | null {
  if (!authHeader?.startsWith('Basic ')) return null;
  const [, encoded] = authHeader.split(' ');
  try {
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(':');
    return [user, pass];
  } catch {
    return null;
  }
}

/** Simple constant-time comparison */
function safeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  const viewA = a.padEnd(len);
  const viewB = b.padEnd(len);
  let result = 0;
  for (let i = 0; i < len; i++) {
    result |= viewA.charCodeAt(i) ^ viewB.charCodeAt(i);
  }
  return result === 0;
}

async function handleGet(env: Env, url: URL): Promise<Response> {
  const language = url.searchParams.get('language');
  const type = url.searchParams.get('type');
  const tag = url.searchParams.get('tag');

  const { keys } = await env.UPDATES_KV.list();
  const items: Update[] = [];
  for (const key of keys) {
    const stored = await env.UPDATES_KV.get(key.name, 'json') as Update | null;
    if (!stored) continue;
    if (language && stored.language !== language) continue;
    if (type && stored.type !== type) continue;
    if (tag && !(stored.tags?.includes(tag))) continue;
    items.push(stored);
  }

  items.sort((a, b) => b.created.localeCompare(a.created));
  return new Response(JSON.stringify(items), {
    headers: { 'content-type': 'application/json' },
  });
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  const auth = parseBasicAuth(request.headers.get('Authorization'));
  if (!auth ||
      !safeEqual(auth[0], env.ADMIN_USERNAME) ||
      !safeEqual(auth[1], env.ADMIN_PASSWORD)) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: Partial<Update>;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.title || !body.content || !body.language || !body.type) {
    return new Response('Missing required fields', { status: 400 });
  }

  const id = crypto.randomUUID();
  const update: Update = {
    id,
    title: String(body.title),
    content: String(body.content),
    language: String(body.language),
    type: body.type as 'post' | 'event',
    tags: body.tags || [],
    event: body.event,
    created: new Date().toISOString(),
  };

  await env.UPDATES_KV.put(`update:${id}`, JSON.stringify(update));
  return new Response(JSON.stringify(update), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
}

interface Env {
  UPDATES_KV: KVNamespace;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    return handleGet(env, url);
  }

  if (request.method === 'POST') {
    return handlePost(request, env);
  }

  return new Response('Method Not Allowed', { status: 405 });
};


