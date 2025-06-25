# Bière Code Site

This project hosts the Bière Code website built with [Astro](https://astro.build). Community updates and events are managed through Cloudflare Pages Functions and a KV store.

## Features
- **Community Updates API**: `/api/updates` backed by Cloudflare KV.
- **Admin UI**: [`/admin`](docs/admin-ui.md) page to submit new posts or events.
- **Demo Days Submissions**: `/demo-days` page lets developers propose live demos.
- **Public Updates List**: `/updates` page shows all posts and events.
- **Infrastructure as Code**: Terraform script in `infra/` sets up the KV namespace.
- **Automated Deployment**: GitHub Actions runs Terraform and deploys to Cloudflare Pages.

Follow the sections below for development commands from the original Astro template.

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Admin Authentication
The `/api/updates` endpoint uses HTTP Basic authentication. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the Cloudflare environment variables or modify `wrangler.toml` for local development.

## Continuous Deployment
The repository includes a GitHub Actions workflow that builds the site, provisions the KV namespace with Terraform, and deploys everything to Cloudflare Pages. Configure these repository secrets:
- `CLOUDFLARE_API_TOKEN` – API token with permissions for Pages and Workers KV
- `CLOUDFLARE_ACCOUNT_ID` – your Cloudflare account ID
The Terraform state file is stored in the same KV namespace between deployments. This allows Terraform to remember the namespace ID without relying on an additional backend.
The workflow runs whenever you push to `main` or update a pull request targeting `main` so you can preview infrastructure changes before merging.
On each run the workflow downloads this file before `terraform init`. If the file is missing but the namespace already exists, the workflow imports that namespace into the new state so `terraform apply` can proceed. After the run the updated state file is uploaded back to KV.
The import step uses the format `<account_id>/<namespace_id>` required by the Cloudflare provider.
If the Cloudflare Pages project `bierecode-site` does not exist, the workflow creates it automatically before deploying.
Custom domains `www.bierecode.com` and `bierecode.com` are managed via the Cloudflare API. The workflow checks the current domain list and adds missing entries before deploying.

## Domains and Redirects
The site uses custom domains `www.bierecode.com` and `bierecode.com`.
A Cloudflare Pages middleware in `functions/_middleware.ts` redirects
all requests for `bierecode.com` to the `www` subdomain to keep a
single canonical hostname.

## Cloudflare Pages Functions
The `functions/` directory is deployed as [Pages Functions](https://developers.cloudflare.com/pages/functions/). Any file inside this directory becomes an endpoint matching its path. For example, `functions/api/demo-days/index.ts` is served at `/api/demo-days`.

During development run `wrangler pages dev ./dist` after building to test these functions locally. When deploying through GitHub Actions the same directory is automatically compiled and uploaded to Cloudflare.

Terraform provisions the Pages project and attaches the `UPDATES_KV` namespace automatically. No manual configuration is required.
