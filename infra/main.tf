# Terraform configuration for Cloudflare resources used by the site
#
# This module ensures a single Workers KV namespace exists for storing
# community updates. The workflow supplies the Cloudflare API token and
# account ID, so running Terraform manually is unnecessary.
#
# The workflow persists the Terraform state file in a Workers KV namespace. This
# means Terraform always knows whether the namespace has already been created on
# previous runs. Because state is preserved, the configuration can simply create
# the namespace and Terraform will see it already exists in state on subsequent
# executions.
#
# GitHub Actions uploads the generated `terraform.tfstate` file into the
# `bierecode-updates` KV namespace after each deployment. At the start of a
# run the workflow attempts to download this file so Terraform knows about
# previously created resources. If no state file exists yet Terraform simply
# begins with an empty state. The workflow automatically imports the existing
# namespace into state so Terraform can manage it and then uploads the new
# state file when the run completes.

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  # The provider requires an API token for authentication so it can create
  # or query resources in your Cloudflare account. Terraform itself does not
  # store state in Cloudflare; the token simply authorizes API requests.
  api_token = var.api_token
}

variable "api_token" {
  # The token must have permission to manage Workers KV. It is provided by the
  # workflow through the `CLOUDFLARE_API_TOKEN` secret.
  description = "Cloudflare API token with permissions for KV"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

resource "cloudflare_workers_kv_namespace" "updates" {
  account_id = var.account_id
  title      = "bierecode-updates"
}

resource "cloudflare_pages_project" "site" {
  account_id       = var.account_id
  name             = "bierecode-site"
  production_branch = "main"

  deployment_configs {
    preview {
      kv_namespaces = [
        {
          binding = "UPDATES_KV"
          id      = cloudflare_workers_kv_namespace.updates.id
        }
      ]
    }

    production {
      kv_namespaces = [
        {
          binding = "UPDATES_KV"
          id      = cloudflare_workers_kv_namespace.updates.id
        }
      ]
    }
  }
}

output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.updates.id
}
