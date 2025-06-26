/**
 * Client-side updates list used on the `/updates` page.
 *
 * This Solid component fetches a JSON array from the `/api/updates` API route
 * and displays each entry. The component runs in the browser so that builds
 * remain fully static – no data needs to be fetched during the Astro build
 * step. Cloudflare's worker runtime throws an error when `fetch` is given a
 * relative URL server-side, so fetching is deferred until the component mounts
 * in the client. The initial HTML rendered by Astro therefore contains only a
 * loading message which is replaced once the client finishes fetching data.
 *
 * During development use `wrangler pages dev ./dist` after running
 * `npm run build` to test this API locally. The standard `astro dev`
 * server does not include Pages Functions, so requests to `/api/updates`
 * would return 404s.
 */
import { createSignal, Show, For, onMount } from 'solid-js';
import type { JSX } from 'solid-js';

interface Update {
  id: string;
  title: string;
  content: string;
  language: string;
  type: 'post' | 'event';
  tags?: string[];
  event?: { date?: string; time?: string; location?: string; duration?: string };
  created: string;
}

/**
 * Fetch updates from the API. This helper only runs in the browser because
 * Cloudflare's server runtime does not support relative URLs with `fetch`.
 */
async function fetchUpdates(): Promise<Update[]> {
  // The API lives in a Pages Function. Requests use a relative path so they
  // automatically resolve against the same domain the site is served from.
  // Browsers handle this just fine, but the Cloudflare workers runtime will
  // throw `TypeError: Failed to parse URL` during server-side rendering if we
  // attempt to call `fetch` with a relative path. By only calling this helper
  // after the component mounts we ensure it never runs in that environment.
  //
  // Construct an absolute URL from the current page's origin so `fetch` never
  // receives a relative path even in strict environments.
  const endpoint = new URL('/api/updates', window.location.origin);
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

/** Component showing a list of updates */
export function Updates(): JSX.Element {
  const [updates, setUpdates] = createSignal<Update[] | null>(null);

  // Load updates after the component mounts in the browser.
  onMount(async () => {
    // Since this code runs only in the browser, `fetch` can safely use the
    // relative `/api/updates` URL. Any network or parsing errors are logged
    // but not rethrown so the page continues to render.
    try {
      setUpdates(await fetchUpdates());
    } catch (err) {
      console.error('Failed to load updates', err);
    }
  });

  // Once updates are loaded, render them in a simple list. During the initial
  // render the list shows a small loading message which is replaced as soon as
  // `updates()` resolves to an array.
  return (
    <div class="p-8 space-y-6">
      <h1 class="text-3xl font-bold">Community Updates</h1>
      <Show when={updates()} fallback={<p>Loading...</p>}>
        <For each={updates() ?? []}>
          {(item) => (
            <article class="border-b pb-4 mb-4">
              <h2 class="text-xl font-semibold">{item.title}</h2>
              <p class="text-sm text-gray-600">{new Date(item.created).toLocaleString()}</p>
              <p class="mt-2 whitespace-pre-line">{item.content}</p>
              <Show when={item.type === 'event' && item.event}>
                {(ev) => (
                  <div class="mt-2 text-sm text-gray-700">
                    <p><strong>When:</strong> {ev().date} {ev().time}</p>
                    <p><strong>Where:</strong> {ev().location}</p>
                    <Show when={ev().duration}>
                      <p><strong>Duration:</strong> {ev().duration}</p>
                    </Show>
                  </div>
                )}
              </Show>
            </article>
          )}
        </For>
      </Show>
    </div>
  );
}
