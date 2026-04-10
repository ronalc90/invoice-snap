# DevOps - InvoiceSnap

Documentacion de la infraestructura, CI/CD y despliegue de InvoiceSnap.

## Arquitectura General

```
GitHub (push/PR)
    |
    v
GitHub Actions (CI/CD)
    |
    +---> Lint + Tests + Build
    +---> npm audit (seguridad)
    +---> Docker build + push (GHCR)
    +---> Deploy Vercel (preview/produccion)
    +---> Security scan (Trivy, CodeQL, TruffleHog)
```

## Stack Tecnologico

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| ORM | Prisma |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| Hosting | Vercel |
| Contenedor | Docker (multi-stage, Alpine) |
| Registry | GitHub Container Registry (ghcr.io) |
| Orquestacion | Kubernetes (manifiestos incluidos) |
| IaC | Terraform (Vercel + Supabase) |
| Monitoreo | Prometheus + Grafana |
| Email | Resend |

## CI/CD Pipeline

### Workflow Principal (`.github/workflows/ci.yml`)

Se ejecuta en cada push a `main` y en cada Pull Request.

**Jobs:**

1. **build-and-test**: Instala dependencias, genera Prisma, verifica tipos, ejecuta lint, corre los 49 tests y hace build de produccion.
2. **security-audit**: Ejecuta `npm audit` para detectar vulnerabilidades en dependencias.
3. **docker**: Construye imagen Docker y la sube a GHCR (solo en push a main).
4. **deploy-preview**: Despliega preview en Vercel (solo en PRs).
5. **deploy-production**: Despliega a produccion en Vercel (solo en push a main).

### Workflow de Seguridad (`.github/workflows/security.yml`)

Se ejecuta en push/PR y semanalmente (lunes 6:00 AM UTC).

**Jobs:**

1. **dependency-audit**: Auditoria npm con reporte JSON como artefacto.
2. **secret-scan**: TruffleHog para detectar secretos expuestos.
3. **container-scan**: Trivy escanea la imagen Docker.
4. **codeql**: Analisis estatico con CodeQL de GitHub.

## Docker

### Build Local

```bash
# Construir imagen
docker build -t invoicesnap:latest .

# Ejecutar contenedor
docker run -p 3003:3003 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  invoicesnap:latest
```

### Docker Compose (Stack Completo)

```bash
# Levantar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f app

# Detener todo
docker compose down
```

**Servicios incluidos:**

| Servicio | Puerto | Descripcion |
|---|---|---|
| app | 3003 | InvoiceSnap (Next.js) |
| postgres | 5432 | Base de datos PostgreSQL 16 |
| prometheus | 9090 | Recolector de metricas |
| grafana | 3001 | Dashboards de monitoreo |

## Vercel

### Configuracion

El archivo `vercel.json` configura:

- **Build**: `npx prisma generate && npm run build`
- **Region**: `iad1` (US East)
- **Headers de seguridad**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Variables de entorno**: Referenciadas como secretos de Vercel

### Secretos Requeridos en GitHub

Para que el pipeline funcione, configurar estos secretos en el repositorio:

| Secreto | Descripcion |
|---|---|
| `VERCEL_TOKEN` | Token de API de Vercel |
| `VERCEL_ORG_ID` | ID de la organizacion en Vercel |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel |

## Kubernetes

Los manifiestos estan en `infra/kubernetes/`.

### Despliegue

```bash
# Aplicar todos los manifiestos
kubectl apply -f infra/kubernetes/

# Verificar estado
kubectl get pods -n invoicesnap
kubectl get svc -n invoicesnap
kubectl get hpa -n invoicesnap
```

### Manifiestos Disponibles

| Archivo | Descripcion |
|---|---|
| `namespace.yml` | Namespace `invoicesnap` |
| `configmap.yml` | Variables de entorno no sensibles |
| `secret.yml` | Template de secretos (cambiar valores) |
| `deployment.yml` | Deployment con 2 replicas, health checks |
| `service.yml` | Service ClusterIP |
| `ingress.yml` | Ingress con TLS (cert-manager) |
| `hpa.yml` | Autoscaling (2-10 pods, CPU 70%, MEM 80%) |

## Terraform

Los archivos estan en `infra/terraform/`.

### Uso

```bash
cd infra/terraform

# Copiar variables de ejemplo
cp terraform.tfvars.example terraform.tfvars
# Editar terraform.tfvars con valores reales

# Inicializar
terraform init

# Ver plan de cambios
terraform plan

# Aplicar cambios
terraform apply
```

### Recursos Gestionados

- **Vercel Project**: Configuracion del proyecto con variables de entorno
- **Supabase Project**: Base de datos PostgreSQL gestionada

## Variables de Entorno

### Desarrollo

```bash
cp .env.example .env
# Editar .env con valores locales
```

### Produccion

Configurar en Vercel Dashboard o via Terraform:

| Variable | Requerida | Descripcion |
|---|---|---|
| `DATABASE_URL` | Si | URL de PostgreSQL |
| `NEXTAUTH_SECRET` | Si | Secret de NextAuth (min 32 chars) |
| `NEXTAUTH_URL` | Si | URL publica de la app |
| `RESEND_API_KEY` | Si | API key de Resend |
| `NEXT_PUBLIC_APP_URL` | Si | URL publica (cliente) |

## Contacto

- **Autor**: Ronald
- **Repositorio**: https://github.com/ronalc90/invoice-snap
