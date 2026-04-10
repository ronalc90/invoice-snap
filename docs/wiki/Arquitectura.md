# Arquitectura

## Vision General

InvoiceSnap usa **Next.js 14 App Router** como framework fullstack. La arquitectura se basa en tres capas principales:

1. **Presentacion** -- Server Components (paginas) y Client Components (formularios, interacciones)
2. **Logica de negocio** -- Server Actions en `src/app/actions/`
3. **Datos** -- Prisma ORM con SQLite (desarrollo) o PostgreSQL (produccion)

## Server Actions vs API Routes

### Server Actions (acciones autenticadas)

Son funciones marcadas con `'use server'` que se ejecutan en el servidor. Se importan directamente en los componentes React.

**Ubicacion:** `src/app/actions/`

**Ventajas:**
- Tipado end-to-end sin serializacion manual
- `revalidatePath()` para invalidar cache
- No necesitan fetch/axios
- Autenticacion con una llamada a `auth()`

**Se usan para:**
- CRUD de facturas y clientes
- Operaciones de estado (enviar, marcar pagada)
- Consultas del dashboard

### API Routes (endpoints publicos)

Solo se usan para endpoints que no requieren autenticacion.

**Ubicacion:** `src/app/api/`

**Se usan para:**
- Vista publica de facturas (`/api/invoices/[id]/view`)
- Endpoints de NextAuth (`/api/auth/[...nextauth]`)

## Estructura de Carpetas

```
src/
├── app/
│   ├── actions/        # Server Actions (logica de negocio)
│   │   ├── invoices.ts # CRUD + envio + pago de facturas
│   │   ├── clients.ts  # CRUD de clientes
│   │   └── dashboard.ts# Metricas y estadisticas
│   ├── api/            # API Routes publicas
│   ├── invoices/       # Paginas de facturas
│   ├── clients/        # Paginas de clientes
│   ├── login/          # Login
│   ├── layout.tsx      # Layout raiz con Sidebar
│   └── page.tsx        # Dashboard
├── components/         # Componentes reutilizables
├── lib/                # Configuraciones y utilidades
│   ├── auth.ts         # NextAuth v5
│   ├── db.ts           # Prisma Client singleton
│   ├── email.ts        # Servicio de email (Resend)
│   ├── pdf-template.tsx# Plantilla PDF
│   ├── utils.ts        # Utilidades generales
│   └── validations.ts  # Schemas Zod
├── types/              # TypeScript types
└── middleware.ts       # Proteccion de rutas
```

## Modelo de Datos

El esquema de Prisma define 6 modelos principales:

- **User** -- Usuario autenticado con datos de negocio
- **Account / Session** -- Gestionados por NextAuth
- **Client** -- Clientes del usuario
- **Invoice** -- Facturas con estado y timestamps de trazabilidad
- **InvoiceItem** -- Items de cada factura
- **Payment** -- Registros de pago

## Flujo de una Factura

```
1. Usuario crea factura (InvoiceForm -> createInvoice Server Action)
2. Se valida con Zod, se genera numero, se calculan totales
3. Se guarda en BD con items via Prisma
4. Usuario envia (InvoiceActions -> sendInvoice Server Action)
5. Se envia email con link via Resend
6. Cliente abre link -> markInvoiceAsViewed -> status: VIEWED
7. Usuario registra pago -> markAsPaid -> status: PAID + Payment record
```

## Patron de Componentes

- **Server Components** (por defecto) para paginas que hacen fetch de datos
- **Client Components** (`'use client'`) para formularios y interacciones
- **Composicion**: las paginas (Server) renderizan componentes interactivos (Client) pasando datos como props

## Base de Datos

- **Desarrollo:** SQLite (archivo local, zero-config)
- **Produccion:** PostgreSQL (Supabase, Neon, Railway)
- **Prisma** abstrae las diferencias entre motores
- **Singleton pattern** en `db.ts` para hot-reload en desarrollo
