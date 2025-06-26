/**
 * Better Auth Endpoint Proxy
 * -------------------------
 * Cloudflare Pages does not allow the traditional `[...]` catch-all syntax
 * used by many frameworks. Instead we name this file `[[path]].ts` so that any
 * request beginning with `/api/auth/` will be routed here regardless of the
 * remaining path segments. We then create a Better Auth instance using the
 * environment's `DB` binding and simply forward the request object to Better
 * Auth. The library inspects the URL to determine which authentication action
 * to perform (login, logout, session lookup, etc.) and returns an appropriate
 * response. This keeps our function lightweight while delegating all auth logic
 * to the Better Auth library.
 */
import { createAuth } from '../../../src/lib/auth-server';

export const onRequest: PagesFunction = async ({ request, env }) => {
  const auth = createAuth(env as any);
  return auth.handler(request);
};
