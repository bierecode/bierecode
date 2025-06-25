# Cloudflare Pages Functions

Cloudflare automatically builds any code in the `functions/` directory when you deploy through Pages. Each subdirectory corresponds to a route on your site. For example `functions/api/demo-days/index.ts` is available at `/api/demo-days`.

Use `wrangler pages dev ./dist` to run the built site locally with these functions enabled. The command compiles the TypeScript files and emulates the Pages runtime so you can send requests to your APIs without deploying first.

Terraform configures the Pages project and attaches the `UPDATES_KV` namespace automatically. Deployments reference this binding without any manual setup.
