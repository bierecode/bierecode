# Bière Code Site

This project hosts the Bière Code website built with [Astro](https://astro.build). Community updates and events are managed through Cloudflare Pages Functions and a KV store.

## Features
- **Community Updates API**: `/api/updates` backed by Cloudflare KV.
- **Admin UI**: `/admin` page to submit new posts or events.
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
The Terraform module detects whether the namespace already exists and will reuse it on subsequent deployments. This prevents failures when redeploying the workflow.
