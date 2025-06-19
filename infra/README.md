# Infrastructure Setup

Terraform in this directory provisions the KV namespace used by the updates API.
The deployment workflow runs `terraform apply` automatically so you do not need
any manual steps.

The workflow expects these secrets:
- `CLOUDFLARE_API_TOKEN` – API token with access to manage KV and Pages
- `CLOUDFLARE_ACCOUNT_ID` – your Cloudflare account identifier
