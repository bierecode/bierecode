# Terraform configuration for Cloudflare resources used by the site
#
# Currently only a single Workers KV namespace is created.
# The GitHub Actions workflow supplies `api_token` and `account_id`
# so running Terraform manually is unnecessary.

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

resource "cloudflare_kv_namespace" "updates" {
  account_id = var.account_id
  title      = "bierecode-updates"
}

output "kv_namespace_id" {
  value = cloudflare_kv_namespace.updates.id
}
