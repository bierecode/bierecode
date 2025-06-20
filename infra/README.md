# Infrastructure Setup

Terraform in this directory provisions the KV namespace used by the updates API.
The deployment workflow runs `terraform apply` automatically so you do not need
any manual steps.

The workflow expects these secrets:
- `CLOUDFLARE_API_TOKEN` – Cloudflare API token used by the Terraform provider
  to authenticate when creating the KV namespace. This token **is not** for
  storing Terraform state; it simply allows Terraform to call the Cloudflare
  API.
- `CLOUDFLARE_ACCOUNT_ID` – your Cloudflare account identifier

The configuration checks for an existing namespace titled `bierecode-updates`. If it already exists, Terraform simply outputs its ID instead of attempting to create a new one.

## Terraform State

The workflow does not rely on a remote backend. Instead, the Terraform state
file `terraform.tfstate` is uploaded to the `bierecode-updates` KV namespace at
the end of each deployment and downloaded at the start. This keeps state between
GitHub Action runs without introducing another storage service.

