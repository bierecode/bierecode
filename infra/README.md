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

The workflow saves the Terraform state file to Workers KV so Terraform knows the namespace ID across runs. There is no additional backend configuration required.

## Terraform State

The workflow does not rely on a remote backend. Instead, the Terraform state
file `terraform.tfstate` is uploaded to the `bierecode-updates` KV namespace at
the end of each deployment and downloaded at the start. If the file is missing
but the namespace already exists, the workflow imports that namespace into the
fresh state before running `terraform apply`. The `terraform import` command
uses the `<account_id>/<namespace_id>` format expected by the Cloudflare
provider. The resulting state file is then
stored back in KV. This approach keeps state between GitHub Action runs without
introducing another storage service.

