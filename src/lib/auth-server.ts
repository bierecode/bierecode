import { betterAuth } from 'better-auth';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

/**
 * createAuth
 * ----------
 * Factory function that instantiates a Better Auth server bound to a
 * Cloudflare D1 database. The Pages runtime exposes the database via the `DB`
 * binding. We construct a Kysely instance using the `kysely-d1` dialect and
 * pass that into Better Auth. Email/password authentication is enabled out of
 * the box which means the admin UI can perform sign in and session lookups
 * without any additional configuration. The returned object provides both an
 * Express-style handler for requests and a client API for server-side usage.
 */
export function createAuth(env: { DB: D1Database }) {
  const db = new Kysely<any>({ dialect: new D1Dialect({ database: env.DB }) });
  return betterAuth({
    database: { db, type: 'sqlite' },
    emailAndPassword: { enabled: true },
  });
}
