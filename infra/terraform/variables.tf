# ─────────────────────────────────────────────────────────
# Variables de configuracion
# ─────────────────────────────────────────────────────────

variable "vercel_api_token" {
  description = "Token de API de Vercel"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "ID del equipo en Vercel (opcional para cuentas personales)"
  type        = string
  default     = null
}

variable "supabase_access_token" {
  description = "Token de acceso de Supabase"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "ID de la organizacion en Supabase"
  type        = string
}

variable "supabase_db_password" {
  description = "Password de la base de datos Supabase"
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "URL de conexion a PostgreSQL"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "Secret para NextAuth.js"
  type        = string
  sensitive   = true
}

variable "nextauth_url" {
  description = "URL base de la aplicacion"
  type        = string
  default     = "https://invoicesnap.vercel.app"
}

variable "resend_api_key" {
  description = "API key de Resend para envio de emails"
  type        = string
  sensitive   = true
}

variable "custom_domain" {
  description = "Dominio personalizado (opcional)"
  type        = string
  default     = ""
}
