# ─────────────────────────────────────────────────────────
# InvoiceSnap - Infraestructura con Terraform
# Proveedor: Vercel (frontend) + Supabase (base de datos)
# ─────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }

  # Configurar backend remoto para estado compartido
  # backend "s3" {
  #   bucket = "invoicesnap-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# ─────────────────────────────────────────────────────────
# Providers
# ─────────────────────────────────────────────────────────
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

provider "supabase" {
  access_token = var.supabase_access_token
}

# ─────────────────────────────────────────────────────────
# Proyecto Vercel
# ─────────────────────────────────────────────────────────
resource "vercel_project" "invoicesnap" {
  name      = "invoicesnap"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "ronalc90/invoice-snap"
  }

  build_command    = "npx prisma generate && npm run build"
  output_directory = ".next"
  install_command  = "npm ci"

  environment = [
    {
      key    = "DATABASE_URL"
      value  = var.database_url
      target = ["production", "preview"]
    },
    {
      key    = "NEXTAUTH_SECRET"
      value  = var.nextauth_secret
      target = ["production", "preview"]
    },
    {
      key    = "NEXTAUTH_URL"
      value  = var.nextauth_url
      target = ["production"]
    },
    {
      key    = "RESEND_API_KEY"
      value  = var.resend_api_key
      target = ["production"]
    },
    {
      key    = "NEXT_PUBLIC_APP_URL"
      value  = var.nextauth_url
      target = ["production"]
    },
  ]
}

# ─────────────────────────────────────────────────────────
# Dominio personalizado (opcional)
# ─────────────────────────────────────────────────────────
# resource "vercel_project_domain" "invoicesnap" {
#   project_id = vercel_project.invoicesnap.id
#   domain     = var.custom_domain
# }

# ─────────────────────────────────────────────────────────
# Proyecto Supabase (base de datos PostgreSQL)
# ─────────────────────────────────────────────────────────
resource "supabase_project" "invoicesnap" {
  organization_id = var.supabase_org_id
  name            = "invoicesnap"
  database_password = var.supabase_db_password
  region          = "us-east-1"

  lifecycle {
    ignore_changes = [database_password]
  }
}
