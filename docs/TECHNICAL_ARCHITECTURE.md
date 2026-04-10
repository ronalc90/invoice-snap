# InvoiceSnap -- Arquitectura Tecnica

Autor: Ronald

---

## Indice

1. [Arquitectura de Next.js App Router](#arquitectura-de-nextjs-app-router)
2. [Esquema de Prisma](#esquema-de-prisma)
3. [Generacion de PDF](#generacion-de-pdf)
4. [Pipeline de Email](#pipeline-de-email)
5. [Flujo de Rastreo de Pagos](#flujo-de-rastreo-de-pagos)
6. [Integracion Stripe Connect](#integracion-stripe-connect)
7. [Arquitectura Multi-tenant](#arquitectura-multi-tenant)
8. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
9. [Despliegue en Vercel + Supabase](#despliegue-en-vercel--supabase)

---

## Arquitectura de Next.js App Router

### Estructura de Carpetas

```
src/
  app/
    (marketing)/
      page.tsx                    # Landing page (SSG)
      pricing/page.tsx            # Pagina de precios (SSG)
      layout.tsx                  # Layout publico
    (auth)/
      login/page.tsx
      register/page.tsx
      forgot-password/page.tsx
      layout.tsx                  # Layout de auth (centrado, sin sidebar)
    (dashboard)/
      dashboard/page.tsx          # Dashboard principal (RSC)
      invoices/
        page.tsx                  # Lista de facturas (RSC + Client Component para filtros)
        new/page.tsx              # Crear factura (Client Component)
        [id]/
          page.tsx                # Detalle factura (RSC)
          edit/page.tsx           # Editar factura (Client Component)
      clients/
        page.tsx                  # Lista de clientes (RSC)
        [id]/page.tsx             # Detalle cliente (RSC)
      settings/
        page.tsx                  # Configuracion general
        profile/page.tsx
        company/page.tsx
        plan/page.tsx
      layout.tsx                  # Layout del dashboard (sidebar + header)
    invoice/
      [token]/page.tsx            # Vista publica de factura (SSR)
    api/
      auth/[...nextauth]/route.ts # NextAuth handlers
      clients/route.ts            # GET (listar), POST (crear)
      clients/[id]/route.ts       # GET, PUT, DELETE
      invoices/route.ts
      invoices/[id]/route.ts
      invoices/[id]/send/route.ts
      invoices/[id]/payments/route.ts
      invoices/public/[token]/route.ts
      dashboard/summary/route.ts
      settings/route.ts
      webhooks/stripe/route.ts
      webhooks/email-open/[id]/route.ts
  components/
    ui/                           # shadcn/ui components
      button.tsx
      input.tsx
      dialog.tsx
      table.tsx
      badge.tsx
      select.tsx
      ...
    layout/
      sidebar.tsx
      header.tsx
      mobile-nav.tsx
    invoices/
      invoice-form.tsx            # Formulario completo (Client Component)
      invoice-items-table.tsx     # Tabla de items editable
      invoice-preview.tsx         # Vista previa en tiempo real
      invoice-status-badge.tsx    # Badge con color por estado
      invoice-actions.tsx         # Botones de accion (enviar, duplicar, etc.)
      template-selector.tsx       # Selector de plantilla
    templates/
      minimal-template.tsx        # Plantilla minimalista
      corporate-template.tsx      # Plantilla corporativa
      creative-template.tsx       # Plantilla creativa
    clients/
      client-form.tsx
      client-list.tsx
      client-select.tsx           # Combobox para seleccionar cliente
    dashboard/
      summary-cards.tsx
      revenue-chart.tsx
      recent-invoices.tsx
      overdue-list.tsx
    payments/
      payment-form.tsx
      payment-history.tsx
  lib/
    prisma.ts                     # Singleton de Prisma Client
    auth.ts                       # Configuracion de NextAuth
    resend.ts                     # Cliente de Resend
    stripe.ts                     # Cliente de Stripe
    utils.ts                      # Utilidades generales
    validations/
      client.ts                   # Schemas de Zod para clientes
      invoice.ts                  # Schemas de Zod para facturas
      payment.ts                  # Schemas de Zod para pagos
  services/
    client.service.ts             # Logica de negocio de clientes
    invoice.service.ts            # Logica de negocio de facturas
    payment.service.ts            # Logica de negocio de pagos
    reminder.service.ts           # Logica de recordatorios
    email.service.ts              # Logica de envio de emails
    pdf.service.ts                # Logica de generacion de PDF
    dashboard.service.ts          # Calculos del dashboard
  types/
    index.ts                      # Tipos globales
    invoice.ts                    # Tipos de factura
    client.ts                     # Tipos de cliente
  hooks/
    use-invoice-form.ts           # Hook para el formulario de factura
    use-debounce.ts               # Debounce para busquedas
  middleware.ts                   # Middleware de autenticacion y rate limiting
```

### Patron de Renderizado

| Tipo de Pagina | Estrategia | Justificacion |
|---|---|---|
| Landing page | SSG (Static Site Generation) | Contenido estatico, maximo rendimiento |
| Pagina de precios | SSG | Contenido raramente cambia |
| Login/Registro | SSR | Redireccion si ya esta autenticado |
| Dashboard | RSC (React Server Components) | Datos dinamicos, sin estado de cliente |
| Lista de facturas | RSC + Client Component | RSC para datos, Client para filtros interactivos |
| Crear/Editar factura | Client Component | Formulario interactivo con estado complejo |
| Vista previa de factura | Client Component | Actualizacion en tiempo real |
| Factura publica | SSR con cache | Renderizado en servidor, cache por token |

### Server Actions vs API Routes

| Operacion | Metodo | Justificacion |
|---|---|---|
| Mutaciones simples (CRUD) | Server Actions | Menos boilerplate, tipado automatico |
| Queries con paginacion/filtros | API Routes (GET) | Necesitan query params y caching |
| Webhooks externos | API Routes | Requieren endpoints HTTP estandar |
| Operaciones complejas (enviar factura) | Server Actions | Encadenan multiples operaciones |
| Tracking pixel | API Route (GET) | El email necesita una URL directa |

---

## Esquema de Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum Plan {
  free
  pro
  business
}

enum InvoiceStatus {
  draft
  sent
  viewed
  paid
  partially_paid
  overdue
  cancelled
}

enum InvoiceTemplate {
  minimal
  corporate
  creative
}

enum PaymentMethod {
  bank_transfer
  cash
  check
  credit_card
  paypal
  stripe
  other
}

enum ReminderType {
  before_due
  on_due
  after_due
}

enum ReminderStatus {
  pending
  sent
  failed
}

enum SendChannel {
  email
  whatsapp
  link
}

enum SendStatus {
  sent
  delivered
  opened
  failed
}

model User {
  id              String    @id @default(uuid()) @db.Uuid
  email           String    @unique @db.VarChar(255)
  passwordHash    String?   @map("password_hash") @db.VarChar(255)
  name            String    @db.VarChar(255)
  companyName     String?   @map("company_name") @db.VarChar(255)
  companyAddress  String?   @map("company_address")
  taxId           String?   @map("tax_id") @db.VarChar(50)
  phone           String?   @db.VarChar(20)
  logoUrl         String?   @map("logo_url") @db.VarChar(500)
  primaryColor    String    @default("#2563EB") @map("primary_color") @db.VarChar(7)
  currency        String    @default("USD") @db.VarChar(3)
  invoicePrefix   String    @default("INV") @map("invoice_prefix") @db.VarChar(10)
  nextInvoiceNum  Int       @default(1) @map("next_invoice_num")
  plan            Plan      @default(free)
  stripeCustomerId String?  @map("stripe_customer_id") @db.VarChar(255)
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  clients         Client[]
  invoices        Invoice[]
  accounts        Account[]
  sessions        Session[]

  @@map("users")
}

model Account {
  id                String  @id @default(uuid()) @db.Uuid
  userId            String  @map("user_id") @db.Uuid
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refreshToken      String? @map("refresh_token")
  accessToken       String? @map("access_token")
  expiresAt         Int?    @map("expires_at")
  tokenType         String? @map("token_type")
  scope             String?
  idToken           String? @map("id_token")
  sessionState      String? @map("session_state")

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(uuid()) @db.Uuid
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id") @db.Uuid
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Client {
  id           String    @id @default(uuid()) @db.Uuid
  userId       String    @map("user_id") @db.Uuid
  name         String    @db.VarChar(255)
  email        String    @db.VarChar(255)
  companyName  String?   @map("company_name") @db.VarChar(255)
  phone        String?   @db.VarChar(20)
  address      String?
  city         String?   @db.VarChar(100)
  state        String?   @db.VarChar(100)
  country      String?   @db.VarChar(100)
  zipCode      String?   @map("zip_code") @db.VarChar(20)
  taxId        String?   @map("tax_id") @db.VarChar(50)
  notes        String?
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  invoices     Invoice[]

  @@unique([userId, email])
  @@index([userId])
  @@map("clients")
}

model Invoice {
  id              String          @id @default(uuid()) @db.Uuid
  userId          String          @map("user_id") @db.Uuid
  clientId        String          @map("client_id") @db.Uuid
  invoiceNumber   String          @map("invoice_number") @db.VarChar(50)
  status          InvoiceStatus   @default(draft)
  template        InvoiceTemplate @default(minimal)
  issueDate       DateTime        @default(now()) @map("issue_date") @db.Date
  dueDate         DateTime        @map("due_date") @db.Date
  currency        String          @default("USD") @db.VarChar(3)
  subtotal        Decimal         @default(0) @db.Decimal(12, 2)
  taxRate         Decimal         @default(0) @map("tax_rate") @db.Decimal(5, 2)
  taxAmount       Decimal         @default(0) @map("tax_amount") @db.Decimal(12, 2)
  discountRate    Decimal         @default(0) @map("discount_rate") @db.Decimal(5, 2)
  discountAmount  Decimal         @default(0) @map("discount_amount") @db.Decimal(12, 2)
  total           Decimal         @default(0) @db.Decimal(12, 2)
  amountPaid      Decimal         @default(0) @map("amount_paid") @db.Decimal(12, 2)
  amountDue       Decimal         @default(0) @map("amount_due") @db.Decimal(12, 2)
  notes           String?
  terms           String?
  publicToken     String?         @unique @map("public_token") @db.VarChar(64)
  sentAt          DateTime?       @map("sent_at") @db.Timestamptz
  viewedAt        DateTime?       @map("viewed_at") @db.Timestamptz
  paidAt          DateTime?       @map("paid_at") @db.Timestamptz
  createdAt       DateTime        @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime        @updatedAt @map("updated_at") @db.Timestamptz

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  client          Client          @relation(fields: [clientId], references: [id], onDelete: Restrict)
  items           InvoiceItem[]
  payments        Payment[]
  reminders       Reminder[]
  sendHistory     SendHistory[]

  @@unique([userId, invoiceNumber])
  @@index([userId])
  @@index([clientId])
  @@index([status])
  @@index([dueDate])
  @@index([publicToken])
  @@map("invoices")
}

model InvoiceItem {
  id          String   @id @default(uuid()) @db.Uuid
  invoiceId   String   @map("invoice_id") @db.Uuid
  description String   @db.VarChar(500)
  quantity    Decimal  @default(1) @db.Decimal(10, 2)
  unitPrice   Decimal  @map("unit_price") @db.Decimal(12, 2)
  amount      Decimal  @db.Decimal(12, 2)
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
  @@map("invoice_items")
}

model Payment {
  id            String        @id @default(uuid()) @db.Uuid
  invoiceId     String        @map("invoice_id") @db.Uuid
  amount        Decimal       @db.Decimal(12, 2)
  paymentMethod PaymentMethod @map("payment_method")
  paymentDate   DateTime      @default(now()) @map("payment_date") @db.Date
  reference     String?       @db.VarChar(255)
  notes         String?
  createdAt     DateTime      @default(now()) @map("created_at") @db.Timestamptz

  invoice       Invoice       @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
  @@map("payments")
}

model Reminder {
  id           String         @id @default(uuid()) @db.Uuid
  invoiceId    String         @map("invoice_id") @db.Uuid
  type         ReminderType
  daysOffset   Int            @map("days_offset")
  status       ReminderStatus @default(pending)
  scheduledFor DateTime       @map("scheduled_for") @db.Timestamptz
  sentAt       DateTime?      @map("sent_at") @db.Timestamptz
  createdAt    DateTime       @default(now()) @map("created_at") @db.Timestamptz

  invoice      Invoice        @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
  @@index([scheduledFor])
  @@map("reminders")
}

model SendHistory {
  id        String     @id @default(uuid()) @db.Uuid
  invoiceId String     @map("invoice_id") @db.Uuid
  channel   SendChannel
  recipient String?    @db.VarChar(255)
  status    SendStatus @default(sent)
  sentAt    DateTime   @default(now()) @map("sent_at") @db.Timestamptz

  invoice   Invoice    @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@index([invoiceId])
  @@map("send_history")
}
```

---

## Generacion de PDF

### Estrategia: React-PDF (@react-pdf/renderer)

Se elige React-PDF sobre Puppeteer por las siguientes razones:

| Factor | React-PDF | Puppeteer |
|---|---|---|
| Peso en bundle | Ligero (~500KB) | Pesado (~300MB con Chromium) |
| Serverless compatible | Si (Vercel Functions) | Requiere configuracion especial |
| Rendimiento | Rapido (~200ms por PDF) | Lento (~2-5s por PDF) |
| Complejidad | Media | Alta |
| Fidelidad visual | Alta (suficiente para facturas) | Perfecta (renderiza HTML real) |
| Costo en Vercel | Bajo (dentro del plan gratuito) | Alto (funciones grandes) |

### Arquitectura del Pipeline de PDF

```
+-------------------+
| Datos de Factura  |  (Prisma query con relaciones)
+-------------------+
         |
         v
+-------------------+
| Template Engine   |  (Seleccionar plantilla: minimal/corporate/creative)
+-------------------+
         |
         v
+-------------------+
| React-PDF Doc     |  (Componentes React -> Document/Page/View/Text)
+-------------------+
         |
         v
+-------------------+
| renderToBuffer()  |  (Genera buffer de PDF en memoria)
+-------------------+
         |
         +--------+--------+
         |                 |
         v                 v
+----------------+ +------------------+
| Response       | | Supabase Storage |
| (Descarga)     | | (Persistencia)   |
+----------------+ +------------------+
```

### Ejemplo de Estructura del Componente PDF

```typescript
// services/pdf.service.ts

import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/components/templates/invoice-document";

interface GeneratePdfParams {
  invoice: InvoiceWithRelations;
  template: InvoiceTemplate;
}

export async function generateInvoicePdf(
  params: GeneratePdfParams
): Promise<Buffer> {
  const { invoice, template } = params;

  const pdfBuffer = await renderToBuffer(
    <InvoiceDocument invoice={invoice} template={template} />
  );

  return Buffer.from(pdfBuffer);
}
```

### Caching de PDFs

- Los PDFs generados se almacenan en Supabase Storage con la key: `{userId}/{invoiceId}.pdf`.
- Si la factura no ha sido modificada desde la ultima generacion, se sirve el PDF cacheado.
- Al editar una factura, se invalida el cache eliminando el archivo.

---

## Pipeline de Email

### Proveedor: Resend

Resend se elige por:
- Integracion nativa con React para templates de email.
- API simple y bien documentada.
- Plan gratuito generoso (100 emails/dia).
- Alta tasa de entrega.
- Soporte para dominios personalizados.

### Flujo de Envio de Factura

```
+-------------------+
| Usuario presiona  |
| "Enviar Factura"  |
+-------------------+
         |
         v
+-------------------+
| Server Action:    |
| sendInvoice()     |
+-------------------+
         |
         +--- Validaciones:
         |    - Factura existe y pertenece al usuario
         |    - Factura no esta cancelada
         |    - Cliente tiene email
         |    - Usuario no excede limite del plan
         |
         v
+-------------------+
| Generar Token     |  (nanoid de 32 caracteres para URL publica)
| Publico           |
+-------------------+
         |
         v
+-------------------+
| Generar PDF       |  (React-PDF -> buffer)
+-------------------+
         |
         v
+-------------------+
| Subir PDF a       |  (Supabase Storage)
| Storage           |
+-------------------+
         |
         v
+-------------------+
| Enviar Email      |  (Resend API)
| con:              |
| - Template HTML   |
| - PDF adjunto     |
| - Link publico    |
| - Tracking pixel  |
+-------------------+
         |
         v
+-------------------+
| Actualizar BD     |
| - status: sent    |
| - sent_at: now()  |
| - public_token    |
| - send_history    |
+-------------------+
```

### Template de Email (React)

```typescript
// components/emails/invoice-email.tsx

import {
  Html, Head, Body, Container, Section,
  Text, Button, Hr, Img
} from "@react-email/components";

interface InvoiceEmailProps {
  freelancerName: string;
  clientName: string;
  invoiceNumber: string;
  total: string;
  currency: string;
  dueDate: string;
  publicUrl: string;
  trackingUrl: string;
}

export function InvoiceEmail(props: InvoiceEmailProps) {
  // Template con diseno profesional
  // Incluye boton "Ver Factura" con link al publicUrl
  // Tracking pixel invisible al final del body
}
```

### Tracking de Apertura

- Se inserta un pixel transparente (1x1 GIF) en el email.
- Cuando el cliente abre el email, el navegador solicita la imagen.
- El endpoint `/api/webhooks/email-open/[id]` registra la apertura.
- Se actualiza `viewedAt` en la factura y el `status` cambia a `viewed`.

```
GET /api/webhooks/email-open/{sendHistoryId}
  -> Actualizar send_history.status = 'opened'
  -> Si invoice.status == 'sent': actualizar a 'viewed'
  -> Responder con GIF transparente de 1x1 pixel
```

---

## Flujo de Rastreo de Pagos

### Maquina de Estados

```
                  +----------+
                  |  DRAFT   |
                  | (default)|
                  +-----+----+
                        |
                   enviar factura
                        |
                  +-----v----+
                  |   SENT   |
                  +-----+----+
                        |
                  cliente abre email
                        |
                  +-----v----+
                  |  VIEWED  |
                  +-----+----+
                        |
             +----------+-----------+
             |                      |
        pago total            pago parcial
             |                      |
      +------v-----+      +--------v--------+
      |    PAID    |      | PARTIALLY_PAID  |
      +------------+      +--------+--------+
                                   |
                              pago restante
                                   |
                            +------v-----+
                            |    PAID    |
                            +------------+

  (En cualquier estado excepto PAID/CANCELLED)
             |
        fecha vence
             |
      +------v-----+
      |  OVERDUE   |
      +------+-----+
             |
        pago recibido
             |
      +------v-----+
      |    PAID    |
      +------------+

  (Desde DRAFT o SENT)
             |
        usuario cancela
             |
      +------v------+
      | CANCELLED   |
      +-------------+
```

### Transiciones Validas

| Estado Actual | Accion | Estado Siguiente | Trigger |
|---|---|---|---|
| draft | Enviar factura | sent | Usuario |
| sent | Cliente abre email | viewed | Automatico (tracking pixel) |
| sent/viewed | Pago total registrado | paid | Usuario |
| sent/viewed | Pago parcial registrado | partially_paid | Usuario |
| partially_paid | Pago restante registrado | paid | Usuario |
| sent/viewed/partially_paid | Fecha de vencimiento pasa | overdue | Cron job diario |
| overdue | Pago registrado | paid | Usuario |
| draft/sent | Usuario cancela | cancelled | Usuario |

### Job de Deteccion de Facturas Vencidas

```typescript
// Se ejecuta diariamente via Vercel Cron Jobs

// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 6 * * *"
    }
  ]
}

// app/api/cron/check-overdue/route.ts
export async function GET(request: Request) {
  // Verificar header de autorizacion de Vercel Cron
  // Buscar facturas con due_date < hoy y status IN (sent, viewed, partially_paid)
  // Actualizar status a 'overdue'
  // Crear recordatorios si el usuario tiene plan Pro
}
```

---

## Integracion Stripe Connect

### Proposito

Stripe Connect permite que los clientes paguen las facturas directamente a traves de un enlace de pago. El dinero va directo a la cuenta del freelancer, e InvoiceSnap cobra una comision del 1%.

### Flujo de Onboarding del Freelancer

```
+-------------------+
| Freelancer activa |
| "Recibir pagos    |
|  online"          |
+-------------------+
         |
         v
+-------------------+
| Crear Stripe      |  stripe.accounts.create({ type: 'express' })
| Connected Account |
+-------------------+
         |
         v
+-------------------+
| Redirigir a       |  stripe.accountLinks.create()
| Stripe Onboarding |  (KYC, datos bancarios)
+-------------------+
         |
         v
+-------------------+
| Callback URL      |  /api/stripe/callback
| Guardar account_id|
+-------------------+
```

### Flujo de Pago de Factura

```
+-------------------+
| Cliente ve factura|
| publica y presiona|
| "Pagar ahora"     |
+-------------------+
         |
         v
+-------------------+
| Crear Stripe      |  stripe.checkout.sessions.create({
| Checkout Session  |    payment_intent_data: {
|                   |      application_fee_amount: total * 0.01,
|                   |      transfer_data: { destination: freelancerStripeId }
|                   |    }
|                   |  })
+-------------------+
         |
         v
+-------------------+
| Cliente completa  |
| pago en Stripe    |
+-------------------+
         |
         v
+-------------------+
| Webhook:          |  checkout.session.completed
| payment_intent.   |
| succeeded         |
+-------------------+
         |
         v
+-------------------+
| Registrar pago    |
| en BD:            |
| - Crear Payment   |
| - Actualizar      |
|   invoice status  |
| - Notificar       |
|   freelancer      |
+-------------------+
```

### Comisiones

| Concepto | Porcentaje | Quien Paga |
|---|---|---|
| Stripe processing fee | 2.9% + $0.30 | Cliente (incluido en el monto) |
| InvoiceSnap platform fee | 1.0% | Freelancer (se descuenta del pago) |
| Total que recibe el freelancer | ~96% del total | |

---

## Arquitectura Multi-tenant

### Estrategia: Aislamiento por Fila (Row-Level Isolation)

Dado el mercado objetivo (freelancers individuales), se usa aislamiento por fila en lugar de esquemas o bases de datos separadas. Esto simplifica la arquitectura y reduce costos.

### Implementacion

Todas las queries de datos incluyen un filtro `userId` obligatorio:

```typescript
// services/invoice.service.ts

export async function getInvoices(
  userId: string,
  filters: InvoiceFilters
) {
  return prisma.invoice.findMany({
    where: {
      userId,  // SIEMPRE filtrar por usuario
      ...buildFilterConditions(filters),
    },
    include: { client: true, items: true },
    orderBy: { createdAt: "desc" },
  });
}
```

### Validacion de Propiedad

Antes de cualquier operacion de lectura, escritura o eliminacion:

```typescript
// lib/authorization.ts

export async function verifyOwnership(
  resourceType: "invoice" | "client" | "payment",
  resourceId: string,
  userId: string
): Promise<boolean> {
  const resource = await prisma[resourceType].findFirst({
    where: { id: resourceId, userId },
  });

  if (!resource) {
    throw new ForbiddenError(
      `No tienes acceso a este recurso`
    );
  }

  return true;
}
```

### Limites por Plan

```typescript
// lib/plan-limits.ts

const PLAN_LIMITS = {
  free: {
    invoicesPerMonth: 5,
    clients: 10,
    templates: ["minimal"],
    reminders: false,
    recurring: false,
    customLogo: false,
    apiAccess: false,
    teamMembers: 1,
  },
  pro: {
    invoicesPerMonth: Infinity,
    clients: Infinity,
    templates: ["minimal", "corporate", "creative"],
    reminders: true,
    recurring: true,
    customLogo: true,
    apiAccess: false,
    teamMembers: 1,
  },
  business: {
    invoicesPerMonth: Infinity,
    clients: Infinity,
    templates: ["minimal", "corporate", "creative", /* premium */],
    reminders: true,
    recurring: true,
    customLogo: true,
    apiAccess: true,
    teamMembers: 5,
  },
} as const;

export async function checkPlanLimit(
  userId: string,
  action: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const limits = PLAN_LIMITS[user.plan];

  if (action === "create_invoice") {
    const thisMonthCount = await prisma.invoice.count({
      where: {
        userId,
        createdAt: { gte: startOfMonth(new Date()) },
      },
    });

    if (thisMonthCount >= limits.invoicesPerMonth) {
      throw new PlanLimitError(
        `Has alcanzado el limite de ${limits.invoicesPerMonth} facturas/mes. Actualiza a Pro para facturas ilimitadas.`
      );
    }
  }
  // ... mas validaciones por accion
}
```

---

## Consideraciones de Seguridad

### Autenticacion y Autorizacion

| Medida | Implementacion |
|---|---|
| Hashing de passwords | bcrypt con salt rounds = 12 |
| Sesiones | JWT firmados con NextAuth, httpOnly cookies |
| OAuth | Google OAuth 2.0 via NextAuth |
| CSRF | Proteccion integrada de Next.js (Server Actions) |
| Rate limiting | Middleware personalizado (100 req/min por IP) |

### Proteccion de Datos

| Medida | Implementacion |
|---|---|
| Aislamiento de datos | Filtro userId en todas las queries |
| Validacion de inputs | Zod schemas en Server Actions y API Routes |
| SQL injection | Prisma (queries parametrizadas por defecto) |
| XSS | React (escape automatico) + CSP headers |
| Datos sensibles | Variables de entorno en Vercel (nunca en codigo) |
| HTTPS | Forzado por Vercel |

### Tokens y URLs Publicas

| Medida | Implementacion |
|---|---|
| Token de factura publica | nanoid de 32 caracteres (URL-safe) |
| Expiracion de token | Sin expiracion (la factura es el recibo) |
| Rate limiting en URL publica | 30 req/min por IP |
| Sin datos sensibles en URL | Solo token opaco, no IDs internos |

### Seguridad en Emails

| Medida | Implementacion |
|---|---|
| SPF + DKIM + DMARC | Configurados en Resend con dominio personalizado |
| No incluir datos sensibles | El email tiene link a la factura, no el contenido completo |
| Verificar destinatario | Solo enviar al email del cliente registrado |

### Seguridad de Stripe

| Medida | Implementacion |
|---|---|
| Webhook signature | Verificacion con stripe.webhooks.constructEvent() |
| Idempotency | Idempotency keys en todas las llamadas a Stripe |
| PCI compliance | Stripe Checkout (nunca tocar datos de tarjeta) |

### Headers de Seguridad

```typescript
// next.config.js

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];
```

---

## Despliegue en Vercel + Supabase

### Arquitectura de Produccion

```
+-------------------+     +-------------------+
|    Vercel CDN     |     |   Cloudflare DNS  |
| (Edge Network)    |<--->| invoicesnap.com   |
+-------------------+     +-------------------+
         |
         v
+-------------------+
| Vercel Serverless |
| Functions         |
| (Next.js App)     |
+--------+----------+
         |
    +----+----+----+
    |         |    |
    v         v    v
+------+ +------+ +--------+
|Supa- | |Resend| |Stripe  |
|base  | |(API) | |(API)   |
|  +PG | +------+ +--------+
|  +S3 |
+------+
```

### Variables de Entorno

```bash
# Base de datos (Supabase)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="random-32-char-string"
NEXTAUTH_URL="https://invoicesnap.com"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="facturas@invoicesnap.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase Storage
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# App
NEXT_PUBLIC_APP_URL="https://invoicesnap.com"

# Sentry
SENTRY_DSN="https://..."
```

### Vercel Cron Jobs

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

### Estrategia de Migraciones

1. Las migraciones de Prisma se ejecutan en el pipeline de deploy.
2. Cada PR con cambios de schema incluye la migracion generada.
3. Rollback: se mantiene un script de rollback para cada migracion.

```bash
# Generar migracion
npx prisma migrate dev --name add_recurring_invoices

# Aplicar en produccion (se ejecuta en el build de Vercel)
npx prisma migrate deploy
```

### Monitoreo y Observabilidad

| Herramienta | Proposito | Costo |
|---|---|---|
| Vercel Analytics | Metricas web (Core Web Vitals, trafico) | Incluido en Vercel Pro |
| Sentry | Captura de errores y stack traces | Free (5K eventos/mes) |
| Supabase Dashboard | Metricas de BD (queries lentas, conexiones) | Incluido |
| Resend Dashboard | Metricas de email (entregas, aperturas, rebotes) | Incluido |
| Stripe Dashboard | Metricas de pagos y suscripciones | Incluido |
| Uptime Robot | Monitoreo de disponibilidad | Free (50 monitores) |
