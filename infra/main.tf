# Terraform configuration for Cloudflare resources used by the site
#
# This module ensures a single Workers KV namespace exists for storing
# community updates. The workflow supplies the Cloudflare API token and
# account ID, so running Terraform manually is unnecessary.
#
# The configuration first lists existing namespaces and reuses one if it
# already exists. Otherwise a new namespace is created.

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.api_token
}

variable "api_token" {
  description = "Cloudflare API token with permissions for KV"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
}

# Fetch all existing namespaces to check if one already matches the desired title
# This avoids errors when the workflow runs multiple times.
data "cloudflare_workers_kv_namespaces" "all" {
  account_id = var.account_id
}

locals {
  existing_ids = [for ns in data.cloudflare_workers_kv_namespaces.all.result : ns.id if ns.title == "bierecode-updates"]
  existing_id  = length(local.existing_ids) > 0 ? local.existing_ids[0] : null
}

# Only create the namespace if it doesn't already exist
resource "cloudflare_workers_kv_namespace" "updates" {
  count      = local.existing_id == null ? 1 : 0
  account_id = var.account_id
  title      = "bierecode-updates"
}

# Export the namespace ID, using the existing one if found
output "kv_namespace_id" {
  value = local.existing_id != null ? local.existing_id : cloudflare_workers_kv_namespace.updates[0].id
}
