/**
 * Demo Days submissions API.
 *
 * Handles simple JSON submissions from the website's /demo-days page.
 * Data is persisted in the existing KV namespace using the `demo:` key prefix.
 */

interface DemoSubmission {
  id: string;
  name: string;
  email: string;
  project: string;
  description: string;
  link?: string;
  created: string;
}

interface Env {
  UPDATES_KV: KVNamespace;
}

/** Retrieve stored submissions */
async function handleGet(env: Env): Promise<Response> {
  const { keys } = await env.UPDATES_KV.list({ prefix: 'demo:' });
  const items: DemoSubmission[] = [];
  for (const key of keys) {
    const stored = await env.UPDATES_KV.get(key.name, 'json') as DemoSubmission | null;
    if (stored) items.push(stored);
  }
  items.sort((a, b) => b.created.localeCompare(a.created));
  return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json' } });
}

/** Store a new submission */
async function handlePost(request: Request, env: Env): Promise<Response> {
  let body: Partial<DemoSubmission>;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.name || !body.email || !body.project || !body.description) {
    return new Response('Missing required fields', { status: 400 });
  }

  const id = crypto.randomUUID();
  const submission: DemoSubmission = {
    id,
    name: String(body.name),
    email: String(body.email),
    project: String(body.project),
    description: String(body.description),
    link: body.link ? String(body.link) : undefined,
    created: new Date().toISOString(),
  };

  await env.UPDATES_KV.put(`demo:${id}`, JSON.stringify(submission));
  return new Response(JSON.stringify(submission), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === 'GET') {
    return handleGet(env);
  }

  if (request.method === 'POST') {
    return handlePost(request, env);
  }

  return new Response('Method Not Allowed', { status: 405 });
};
