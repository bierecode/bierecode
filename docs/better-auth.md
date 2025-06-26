# Better Auth Integration

This project now uses [Better Auth](https://www.better-auth.com/docs/introduction) for the admin interface.
Authentication data is stored in a Cloudflare D1 database provisioned via Terraform.

## Server Setup

`src/lib/auth-server.ts` creates the Better Auth instance using a Kysely client
backed by the D1 database. The Cloudflare `DB` binding is passed to the dialect
which allows Better Auth to execute queries.

The auth server reads `BETTER_AUTH_SECRET` (or `AUTH_SECRET`) from the
environment so session cookies can be validated across requests. Terraform
defines this variable on the Pages project and it is also configured in
`wrangler.toml` for local development.

## Client Usage

`src/lib/auth-client.ts` exposes a SolidJS auth client. Components can call
`authClient.signIn.email` or `authClient.useSession` to manage user sessions.

The admin page (`/admin`) now checks for a valid session before displaying the
form. Unauthenticated users are redirected to `/login`.
Users without an account can visit `/register` to create one.

All `/api/auth/*` requests are handled by `functions/api/auth/[[path]].ts`, which
forwards the incoming request to the Better Auth handler.

## Database Schema

Terraform provisions the D1 database and attaches it to the Pages project.
The initial schema is located at `infra/d1.sql`. You can regenerate this schema
with the Better Auth CLI if needed. The deployment workflow automatically runs
`wrangler d1 execute bierecode-auth --file infra/d1.sql` after Terraform
creates the database so the tables exist before any authentication requests are
processed.

## Debugging and Logs

To help troubleshoot authentication issues the `/api/updates` function logs the
result of each session lookup. Failed logins print a warning that includes the
request method and URL so you can quickly identify unauthorized attempts. The
catch-all handler for `/api/auth/*` also logs every request path and the
resulting HTTP status code returned by Better Auth.
