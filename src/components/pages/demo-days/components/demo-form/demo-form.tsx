/**
 * DemoForm
 * --------
 * Provides a small submission form for the monthly Demo Days event.
 * Users can quickly tell us about the project they want to showcase.
 *
 * The component runs entirely on the client using SolidJS. Submitted
 * entries are POSTed as JSON to `/api/demo-days` where they are stored
 * in Workers KV. A simple status message lets the user know if the
 * submission succeeded.
 */
import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

interface DemoPayload {
  name: string;
  email: string;
  project: string;
  description: string;
  link?: string;
}

/** Read values from the form element into a payload object */
function readForm(form: HTMLFormElement): DemoPayload {
  const data = new FormData(form);
  return {
    name: data.get('name') as string,
    email: data.get('email') as string,
    project: data.get('project') as string,
    description: data.get('description') as string,
    link: data.get('link') as string,
  };
}

/** POST the payload to the API endpoint */
async function submitPayload(payload: DemoPayload): Promise<Response> {
  return fetch('/api/demo-days', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** Form component used on the /demo-days page */
export function DemoForm(): JSX.Element {
  const [status, setStatus] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const payload = readForm(form);
    const res = await submitPayload(payload);
    if (res.ok) {
      setStatus('Thanks for submitting!');
      form.reset();
    } else {
      setStatus(`Error: ${res.status}`);
    }
  };

  return (
    <form class="w-full max-w-md space-y-4 bg-white/70 backdrop-blur p-6 rounded-lg shadow" onSubmit={handleSubmit}>
      <div class="space-y-1">
        <label class="block text-sm font-medium" for="name">Your Name</label>
        <input id="name" name="name" type="text" class="w-full border rounded-md p-2" required />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium" for="email">Email</label>
        <input id="email" name="email" type="email" class="w-full border rounded-md p-2" required />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium" for="project">Project Name</label>
        <input id="project" name="project" type="text" class="w-full border rounded-md p-2" required />
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium" for="description">Description</label>
        <textarea id="description" name="description" rows="4" class="w-full border rounded-md p-2" required></textarea>
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium" for="link">Demo Link</label>
        <input id="link" name="link" type="url" class="w-full border rounded-md p-2" placeholder="https://" />
      </div>
      <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Submit</button>
      <p class="text-sm text-center">{status()}</p>
    </form>
  );
}
