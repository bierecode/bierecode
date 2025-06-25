/**
 * Demo Days submissions API.
 *
<<<<<<< 7k7xo0-codex/add-/demo-days-page-with-demo-submission-form
 * This file implements a tiny REST-style endpoint used by the `/demo-days`
 * page. Visitors can send a JSON payload describing the project they want to
 * demonstrate at the next meetup. Entries are persisted in the same KV
 * namespace used for community updates under the `demo:` prefix.
 *
 * The Pages runtime injects the `UPDATES_KV` binding defined in `wrangler.toml`.
 * If that binding is missing the handler responds with a 500 error explaining
 * the misconfiguration instead of throwing an exception.
=======
 * Handles simple JSON submissions from the website's /demo-days page.
 * Data is persisted in the existing KV namespace using the `demo:` key prefix.
>>>>>>> main
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
<<<<<<< 7k7xo0-codex/add-/demo-days-page-with-demo-submission-form
  UPDATES_KV?: KVNamespace;
=======
  UPDATES_KV: KVNamespace;
>>>>>>> main
}

/** Retrieve stored submissions */
async function handleGet(env: Env): Promise<Response> {
<<<<<<< 7k7xo0-codex/add-/demo-days-page-with-demo-submission-form
  if (!env.UPDATES_KV) {
    return new Response('KV binding not configured', { status: 500 });
  }
=======
>>>>>>> main
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
<<<<<<< 7k7xo0-codex/add-/demo-days-page-with-demo-submission-form
  if (!env.UPDATES_KV) {
    return new Response('KV binding not configured', { status: 500 });
  }
=======
>>>>>>> main
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
