/**
 * RegisterForm component
 * ----------------------
 * Provides a stylish registration form for creating a Better Auth account.
 * The design mirrors the login and admin forms so the site feels cohesive.
 * It uses the Better Auth client to create a new email/password account.
 *
 * On successful registration the user is redirected directly to the admin page.
 */
import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { authClient } from '../../../../../lib/auth-client';

export function RegisterForm(): JSX.Element {
  const [status, setStatus] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.name.value as string;
    const email = form.email.value as string;
    const password = form.password.value as string;
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setStatus(error.message || 'Registration failed');
    } else {
      window.location.href = '/admin';
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white">
      <form class="w-full max-w-md space-y-5 bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
        <h1 class="text-3xl font-bold text-center">Create Account</h1>
        <div>
          <label for="name" class="block text-sm font-medium">Name</label>
          <input id="name" name="name" type="text" required class="w-full border rounded-md p-2" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required class="w-full border rounded-md p-2" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium">Password</label>
          <input id="password" name="password" type="password" required class="w-full border rounded-md p-2" />
        </div>
        <button type="submit" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md w-full">Register</button>
        <p class="text-sm text-center">{status()}</p>
        <p class="text-sm text-center">Already have an account? <a href="/login" class="text-blue-700 underline">Login</a></p>
      </form>
    </div>
  );
}
