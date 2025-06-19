/**
 * Client-side component used on the updates page.
 *
 * Fetches update entries from the `/api/updates` endpoint and renders
 * them in a basic list.
 */
import { createResource, Show, For } from 'solid-js';
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
 * Fetch updates from the API with optional query parameters.
 */
async function fetchUpdates(): Promise<Update[]> {
  const res = await fetch('/api/updates');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

/** Component showing a list of updates */
export function Updates(): JSX.Element {
  const [updates] = createResource(fetchUpdates);

  return (
    <div class="p-8 space-y-6">
      <h1 class="text-3xl font-bold">Community Updates</h1>
      <Show when={updates()} fallback={<p>Loading...</p>}>
        <For each={updates()}>
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
