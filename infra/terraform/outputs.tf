# ─────────────────────────────────────────────────────────
# Outputs
# ─────────────────────────────────────────────────────────

output "vercel_project_id" {
  description = "ID del proyecto en Vercel"
  value       = vercel_project.invoicesnap.id
}

output "vercel_url" {
  description = "URL del deploy en Vercel"
  value       = "https://invoicesnap.vercel.app"
}

output "supabase_project_id" {
  description = "ID del proyecto en Supabase"
  value       = supabase_project.invoicesnap.id
}

output "supabase_url" {
  description = "URL de la API de Supabase"
  value       = supabase_project.invoicesnap.endpoint
}
