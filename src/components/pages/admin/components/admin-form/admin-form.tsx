/**
 * AdminForm
 * ----------
 * A polished form interface that allows organizers to publish updates or events
 * to the Bière Code feed. The design follows modern UI best practices:
 *
 * - **Accessible labels** so assistive technologies can correctly announce fields.
 * - **Responsive layout** that centers the form in a card-like container.
 * - **Consistent spacing** and focused color palette using Tailwind CSS.
 * - **Immediate feedback** letting the user know when a submission succeeds or fails.
 *
 * The component runs entirely on the client using SolidJS and communicates with
 * the `/api/updates` endpoint.
 * The event-specific fields are conditionally displayed when the user selects
 * the "Event" type so the form stays concise for regular posts.
 */
import { createSignal, Show } from 'solid-js';
import type { JSX } from 'solid-js';

interface UpdatePayload {
  title: string;
  content: string;
  language: string;
  type: 'post' | 'event';
  tags?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  duration?: string;
}

/** Collect form values into a payload object */
function readForm(form: HTMLFormElement): UpdatePayload {
  const formData = new FormData(form);
  return {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    language: formData.get('language') as string,
    type: formData.get('type') as 'post' | 'event',
    tags: formData.get('tags') as string,
    eventDate: formData.get('eventDate') as string,
    eventTime: formData.get('eventTime') as string,
    location: formData.get('location') as string,
    duration: formData.get('duration') as string,
  };
}

/** Build the JSON body expected by the API */
function buildBody(payload: UpdatePayload): Record<string, unknown> {
  const body: Record<string, unknown> = {
    title: payload.title,
    content: payload.content,
    language: payload.language,
    type: payload.type,
    tags: payload.tags?.split(',').map((t) => t.trim()).filter(Boolean),
  };
  if (payload.type === 'event') {
    body.event = {
      date: payload.eventDate,
      time: payload.eventTime,
      location: payload.location,
      duration: payload.duration,
    };
  }
  return body;
}

/** Form component rendered on the /admin page */
export function AdminForm(): JSX.Element {
  const [status, setStatus] = createSignal('');
  const [type, setType] = createSignal<'post' | 'event'>('post');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const payload = readForm(form);

    const res = await fetch('/api/updates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildBody(payload)),
      credentials: 'include',
    });

    if (res.ok) {
      setStatus('Posted successfully');
      form.reset();
      setType('post');
    } else {
      setStatus(`Error: ${res.status}`);
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <form class="w-full max-w-xl space-y-5 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
        <h1 class="text-3xl font-bold text-center">Publish Update</h1>
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="title">Title</label>
          <input id="title" name="title" type="text" class="w-full border rounded-md p-2" required />
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="content">Content</label>
          <textarea id="content" name="content" rows="5" class="w-full border rounded-md p-2" required></textarea>
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="language">Language</label>
          <select id="language" name="language" class="w-full border rounded-md p-2" required>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="type">Type</label>
          <select
            id="type"
            name="type"
            class="w-full border rounded-md p-2"
            required
            onInput={(e) => setType((e.target as HTMLSelectElement).value as 'post' | 'event')}
          >
            <option value="post">Post</option>
            <option value="event">Event</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="block text-sm font-medium" for="tags">Tags</label>
          <input id="tags" name="tags" type="text" placeholder="Comma separated" class="w-full border rounded-md p-2" />
        </div>
        <Show when={type() === 'event'}>
          <fieldset class="border p-4 rounded-md space-y-2">
            <legend class="font-semibold text-sm">Event details</legend>
            <input name="eventDate" type="date" class="w-full border rounded-md p-2" />
            <input name="eventTime" type="time" class="w-full border rounded-md p-2" />
            <input name="location" type="text" placeholder="Location" class="w-full border rounded-md p-2" />
            <input name="duration" type="text" placeholder="Duration" class="w-full border rounded-md p-2" />
          </fieldset>
        </Show>
        <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Submit</button>
        <p class="text-sm text-center">{status()}</p>
      </form>
    </div>
  );
}
