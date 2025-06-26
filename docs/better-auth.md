# Better Auth Integration

This project now uses [Better Auth](https://www.better-auth.com/docs/introduction) for the admin interface.
Authentication data is stored in a Cloudflare D1 database provisioned via Terraform.

## Server Setup

`src/lib/auth-server.ts` creates the Better Auth instance using a Kysely client
backed by the D1 database. The Cloudflare `DB` binding is passed to the dialect
which allows Better Auth to execute queries.

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
with the Better Auth CLI if needed.
