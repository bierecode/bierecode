/**
 * Admin form component for publishing new updates.
 *
 * Renders a simple form that POSTs to `/api/updates` with basic-auth
 * credentials provided by the user.
 */
import { createSignal } from 'solid-js';
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

/**
 * Simple form for posting new updates using the /api/updates endpoint.
 * Requires basic auth credentials set in wrangler.toml / Cloudflare env vars.
 */
export function AdminForm(): JSX.Element {
  const [status, setStatus] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload: UpdatePayload = {
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

    const basic = btoa(`${formData.get('username')}:${formData.get('password')}`);

    const body: any = {
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

    const res = await fetch('/api/updates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${basic}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setStatus('Posted successfully');
      form.reset();
    } else {
      setStatus(`Error: ${res.status}`);
    }
  };

  return (
    <form class="p-8 space-y-4" onSubmit={handleSubmit}>
      <h1 class="text-2xl font-bold">New Update</h1>
      <input type="text" name="username" placeholder="Username" class="block border p-2" required />
      <input type="password" name="password" placeholder="Password" class="block border p-2" required />
      <input type="text" name="title" placeholder="Title" class="block border p-2" required />
      <textarea name="content" placeholder="Content" class="block border p-2" rows="5" required />
      <select name="language" class="block border p-2" required>
        <option value="en">English</option>
        <option value="fr">French</option>
      </select>
      <select name="type" class="block border p-2" required>
        <option value="post">Post</option>
        <option value="event">Event</option>
      </select>
      <input type="text" name="tags" placeholder="Comma separated tags" class="block border p-2" />
      <div class="border p-2 space-y-2">
        <p class="font-semibold">Event details (if type is event)</p>
        <input type="date" name="eventDate" class="block border p-2" />
        <input type="time" name="eventTime" class="block border p-2" />
        <input type="text" name="location" placeholder="Location" class="block border p-2" />
        <input type="text" name="duration" placeholder="Duration" class="block border p-2" />
      </div>
      <button type="submit" class="bg-yellow-500 text-white px-4 py-2">Submit</button>
      <p>{status()}</p>
    </form>
  );
}
