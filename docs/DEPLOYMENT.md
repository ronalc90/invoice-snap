# Guia de Despliegue

## Vercel (Recomendado)

### 1. Preparar el repositorio

Asegurate de que el repositorio este en GitHub:

```bash
git remote -v
# origin  https://github.com/ronalc90/invoice-snap.git
```

### 2. Conectar con Vercel

1. Ir a [vercel.com](https://vercel.com) e iniciar sesion con GitHub
2. Click en "New Project"
3. Seleccionar el repositorio `ronalc90/invoice-snap`
4. Framework Preset: **Next.js** (se detecta automaticamente)
5. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### 3. Configurar Base de Datos PostgreSQL

InvoiceSnap usa SQLite en desarrollo pero requiere PostgreSQL en produccion.

#### Opcion A: Supabase (gratuito)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings > Database > Connection string (URI)
4. Copiar la URL y usarla como `DATABASE_URL`

#### Opcion B: Neon (gratuito)

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar la connection string

#### Opcion C: Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Nuevo proyecto > PostgreSQL
3. Variables > copiar `DATABASE_URL`

### 4. Configurar Variables de Entorno en Vercel

En el panel de Vercel, ir a Settings > Environment Variables y agregar:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/invoicesnap?sslmode=require` |
| `NEXTAUTH_SECRET` | (generar con `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` |
| `RESEND_API_KEY` | `re_xxxxxxxxxxxx` |
| `NEXT_PUBLIC_APP_URL` | `https://tu-dominio.vercel.app` |

### 5. Actualizar esquema Prisma para PostgreSQL

Cambiar el provider en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 6. Inicializar la base de datos

Desde tu maquina local con la `DATABASE_URL` de produccion:

```bash
DATABASE_URL="postgresql://..." npx prisma db push
```

### 7. Deploy

```bash
git push origin main
```

Vercel detecta el push y ejecuta el build automaticamente. Los deploys posteriores se activan con cada push a `main`.

---

## Configurar Resend (Email)

### 1. Crear cuenta en Resend

1. Ir a [resend.com](https://resend.com)
2. Crear cuenta gratuita
3. Ir a API Keys > Create API Key

### 2. Verificar dominio (opcional pero recomendado)

1. En Resend, ir a Domains > Add Domain
2. Agregar los registros DNS indicados
3. Esperar verificacion (puede tomar hasta 24 horas)

### 3. Sin dominio verificado

El plan gratuito permite enviar emails de prueba a tu propia direccion usando el dominio `onboarding@resend.dev`.

Para produccion, se necesita un dominio verificado para enviar a cualquier direccion.

---

## Docker (Auto-hospedado)

### docker-compose.yml completo

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: 'postgresql://invoicesnap:invoicesnap@postgres:5432/invoicesnap'
      NEXTAUTH_SECRET: 'cambiar-en-produccion'
      NEXTAUTH_URL: 'http://localhost:3000'
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
    depends_on:
      - postgres

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: invoicesnap
      POSTGRES_PASSWORD: invoicesnap
      POSTGRES_DB: invoicesnap
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Produccion
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Ejecutar

```bash
docker-compose up -d
docker-compose exec app npx prisma db push
```

---

## Checklist de Produccion

- [ ] `NEXTAUTH_SECRET` generado de forma segura (`openssl rand -base64 32`)
- [ ] `DATABASE_URL` apuntando a PostgreSQL (no SQLite)
- [ ] `RESEND_API_KEY` configurada con dominio verificado
- [ ] `NEXT_PUBLIC_APP_URL` con el dominio correcto (HTTPS)
- [ ] `NEXTAUTH_URL` con el dominio correcto (HTTPS)
- [ ] Prisma schema con `provider = "postgresql"`
- [ ] Base de datos inicializada con `prisma db push`
- [ ] HTTPS habilitado (Vercel lo incluye automaticamente)
- [ ] Backups de base de datos configurados
