/**
 * Community updates API.
 *
 * Deployed as a Cloudflare Pages Function and backed by Workers KV.
 * Provides JSON endpoints:
 *   - GET  /api/updates  -> list stored updates with optional filters
 *   - POST /api/updates  -> create a new update, authenticated via Better Auth
 *
 * The KV namespace binding is named `UPDATES_KV` and is provisioned by Terraform.
 * Build and deployment are handled automatically by GitHub Actions.
 *
 * Session lookups are logged so 401 errors can be diagnosed from the
 * Cloudflare dashboard.
 */
import { createAuth } from '../../../src/lib/auth-server';
// Cloudflare Pages Function: Manage community updates
//
// This handler provides a simple JSON API backed by a KV namespace. It supports
// GET requests for listing updates and POST requests for creating new updates.
//
// Updates are stored as JSON objects keyed by a generated UUID.
// Write operations require a valid Better Auth session.
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
  const auth = createAuth(env);
  // Pass the original Request so Better Auth can read the session cookie
  const { data, error } = await auth.api.getSession(request);
  console.log('[updates] session lookup', { session: data?.session?.id, error });
  if (!data?.session) {
    console.warn('[updates] unauthorized', request.method, request.url);
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
  DB: D1Database;
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


