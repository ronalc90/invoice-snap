# Arquitectura de InvoiceSnap

## Vision General

InvoiceSnap esta construido sobre **Next.js 14 App Router**, aprovechando Server Components y Server Actions para una arquitectura fullstack con tipado end-to-end.

## Diagrama de Capas

```
┌─────────────────────────────────────────────────┐
│                   CLIENTE                        │
│  ┌─────────────┐  ┌──────────────┐              │
│  │ Paginas      │  │ Componentes  │              │
│  │ (Server)     │  │ (Client)     │              │
│  │ Dashboard    │  │ InvoiceForm  │              │
│  │ Invoices     │  │ ClientForm   │              │
│  │ Clients      │  │ SearchInput  │              │
│  └──────┬───────┘  └──────┬───────┘              │
│         │                 │                      │
│         ▼                 ▼                      │
│  ┌──────────────────────────────────┐            │
│  │        SERVER ACTIONS             │            │
│  │  invoices.ts  clients.ts          │            │
│  │  dashboard.ts                     │            │
│  │  (validacion + logica de negocio) │            │
│  └──────────────┬───────────────────┘            │
│                 │                                │
│  ┌──────────────▼───────────────────┐            │
│  │         API ROUTES (publicas)     │            │
│  │  /api/invoices/[id]/view          │            │
│  │  /api/auth/[...nextauth]          │            │
│  └──────────────┬───────────────────┘            │
└─────────────────┼───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              INFRAESTRUCTURA                     │
│  ┌──────────┐  ┌────────┐  ┌─────────┐         │
│  │ Prisma   │  │ Resend │  │NextAuth │         │
│  │ ORM      │  │ Email  │  │ Auth    │         │
│  └────┬─────┘  └────────┘  └─────────┘         │
│       │                                          │
│  ┌────▼─────┐                                    │
│  │SQLite/   │                                    │
│  │PostgreSQL│                                    │
│  └──────────┘                                    │
└──────────────────────────────────────────────────┘
```

## App Router: Estructura de Rutas

Next.js App Router utiliza el sistema de archivos para definir rutas. Cada carpeta dentro de `src/app/` representa un segmento de URL.

```
src/app/
├── layout.tsx              # Layout raiz (Sidebar + contenido)
├── page.tsx                # / (Dashboard)
├── globals.css             # Estilos globales
├── login/
│   └── page.tsx            # /login
├── invoices/
│   ├── page.tsx            # /invoices (lista)
│   ├── new/
│   │   └── page.tsx        # /invoices/new
│   └── [id]/
│       ├── page.tsx        # /invoices/:id (detalle)
│       ├── InvoiceActions.tsx  # Componente client para acciones
│       └── preview/
│           └── page.tsx    # /invoices/:id/preview (vista publica)
├── clients/
│   ├── page.tsx            # /clients (lista)
│   ├── new/
│   │   └── page.tsx        # /clients/new
│   └── [id]/
│       └── page.tsx        # /clients/:id (detalle)
├── actions/
│   ├── invoices.ts         # Server Actions de facturas
│   ├── clients.ts          # Server Actions de clientes
│   └── dashboard.ts        # Server Actions del dashboard
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts    # NextAuth endpoints
    └── invoices/
        └── [id]/
            └── view/
                └── route.ts  # Vista publica + tracking
```

## Server Actions vs API Routes

### Server Actions (autenticadas)

Las Server Actions son funciones marcadas con `'use server'` que se ejecutan en el servidor y pueden ser invocadas directamente desde componentes React.

**Ventajas:**
- Tipado end-to-end sin serializacion manual
- No requieren fetch/axios
- `revalidatePath()` integrado para actualizar cache
- La autenticacion se verifica con `auth()` de NextAuth

**Se usan para:**
- CRUD de facturas (`createInvoice`, `updateInvoice`, `deleteInvoice`)
- CRUD de clientes (`createClient`, `updateClient`, `deleteClient`)
- Operaciones de estado (`sendInvoice`, `markAsPaid`)
- Consultas del dashboard (`getDashboardStats`)

### API Routes (publicas)

Las API Routes solo se usan cuando se necesita un endpoint HTTP accesible sin autenticacion.

**Se usan para:**
- `/api/invoices/[id]/view` -- Los clientes acceden a sus facturas via link en el email
- `/api/auth/[...nextauth]` -- Endpoints de autenticacion de NextAuth

## Esquema de Base de Datos (Prisma)

```
┌──────────────┐      ┌──────────────┐
│     User     │      │   Account    │
│──────────────│      │──────────────│
│ id           │──┐   │ id           │
│ email        │  │   │ userId    ───│──┐
│ name         │  │   │ provider     │  │
│ businessName │  │   │ type         │  │
│ businessAddr │  │   └──────────────┘  │
│ phone        │  │                     │
│ logoUrl      │  │   ┌──────────────┐  │
└──────┬───────┘  └───│──  Session   │  │
       │              │──────────────│  │
       │              │ sessionToken │  │
       │              │ userId    ───│──┘
       │              └──────────────┘
       │
       ├──────────────────────────┐
       │                          │
       ▼                          ▼
┌──────────────┐         ┌──────────────┐
│   Client     │         │   Invoice    │
│──────────────│         │──────────────│
│ id           │◄───────┐│ id           │
│ userId       │        ││ userId       │
│ name         │        ││ clientId  ───│
│ email        │        ││ invoiceNumber│
│ phone        │        ││ status       │
│ address      │        ││ issueDate    │
│ company      │        ││ dueDate      │
└──────────────┘        ││ subtotal     │
                        ││ taxRate      │
                        ││ taxAmount    │
                        ││ total        │
                        ││ currency     │
                        ││ notes        │
                        ││ sentAt       │
                        ││ viewedAt     │
                        ││ paidAt       │
                        │└──────┬───────┘
                        │       │
                        │       ├───────────────┐
                        │       │               │
                        │       ▼               ▼
                        │┌──────────────┐ ┌──────────────┐
                        ││ InvoiceItem  │ │   Payment    │
                        ││──────────────│ │──────────────│
                        ││ id           │ │ id           │
                        ││ invoiceId    │ │ invoiceId    │
                        ││ description  │ │ amount       │
                        ││ quantity     │ │ paymentDate  │
                        ││ unitPrice    │ │ paymentMethod│
                        ││ amount       │ │ reference    │
                        │└──────────────┘ └──────────────┘
                        │
                        └── Indices en: userId, clientId,
                            status, invoiceNumber
```

## Middleware de Autenticacion

El middleware (`src/middleware.ts`) intercepta todas las peticiones y:

1. Permite acceso libre a rutas publicas (`/login`, `/api/auth`, `/invoices/[id]/preview`)
2. Redirige a `/login` si el usuario no esta autenticado
3. Usa el matcher de Next.js para excluir archivos estaticos

## Flujo de Datos

### Crear Factura

```
InvoiceForm (Client Component)
    │
    ├── Estado local: items[], taxRate, subtotal, total
    │
    └── handleSubmit()
         │
         ▼
    createInvoice(data) [Server Action]
         │
         ├── auth() → obtener userId
         ├── invoiceSchema.parse(data) → validar con Zod
         ├── generateInvoiceNumber() → INV-2024-0001
         ├── calcular subtotal, taxAmount, total
         ├── prisma.invoice.create() → guardar en DB
         ├── revalidatePath('/invoices')
         │
         └── return { success: true, data: { id } }
```

### Enviar Factura

```
InvoiceActions (Client Component)
    │
    └── handleSend()
         │
         ▼
    sendInvoice(id) [Server Action]
         │
         ├── auth() → verificar usuario
         ├── prisma.invoice.findFirst() → obtener factura
         ├── sendInvoiceEmail() → enviar via Resend
         ├── prisma.invoice.update() → status: SENT, sentAt: now()
         ├── revalidatePath()
         │
         └── return { success: true }
```

### Vista Publica (Tracking)

```
Cliente recibe email con link
    │
    └── /invoices/[id]/preview
         │
         ▼
    getInvoiceForPublicView(id) [Server Action]
         │  (sin verificar auth - ruta publica)
         │
    markInvoiceAsViewed(id) [Server Action]
         │
         ├── Si status === 'SENT':
         │   └── update status → 'VIEWED', viewedAt: now()
         │
         └── Renderizar InvoicePreview
```

## Patron de Componentes

### Server Components (por defecto)

Las paginas principales son Server Components que hacen fetch de datos directamente:

- `page.tsx` (Dashboard) -- llama `getDashboardStats()` y `getInvoices()`
- `invoices/page.tsx` -- llama `getInvoices(filters)`
- `clients/page.tsx` -- llama `getClients(search)`

### Client Components ('use client')

Se usan solo cuando hay interactividad:

- `InvoiceForm` -- formulario con estado local (items dinamicos)
- `ClientForm` -- formulario con estado
- `InvoiceActions` -- botones de accion (send, markPaid, delete)
- `SearchInput` -- input con debounce que actualiza URL params
- `Sidebar` -- navegacion con pathname activo
- `RevenueChart` -- grafico interactivo

## Generacion de PDF

InvoiceSnap utiliza `@react-pdf/renderer` para generar PDFs en el servidor:

- Plantilla definida en `src/lib/pdf-template.tsx`
- Componente `InvoicePDF` con layout A4, tabla de items y totales
- Estilos definidos con `StyleSheet.create()` (no Tailwind)
- `serverComponentsExternalPackages` en `next.config.js` para soporte en Server Components
