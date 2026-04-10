```
 ___                 _           ____                    
|_ _|_ ____   _____ (_) ___ ___ / ___| _ __   __ _ _ __  
 | || '_ \ \ / / _ \| |/ __/ _ \\___ \| '_ \ / _` | '_ \ 
 | || | | \ V / (_) | | (_|  __/ ___) | | | | (_| | |_) |
|___|_| |_|\_/ \___/|_|\___\___|____/|_| |_|\__,_| .__/ 
                                                  |_|    
```

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-49_passing-brightgreen)](.)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

**Genera facturas profesionales en 60 segundos** - para freelancers que quieren cobrar mas rapido.

InvoiceSnap es una aplicacion web moderna que permite a freelancers y pequenos negocios crear, enviar y rastrear facturas profesionales sin complicaciones. Sin plantillas de Word, sin hojas de calculo desordenadas, sin herramientas costosas.

---

## Funcionalidades

- **Creacion rapida de facturas** - Formulario optimizado con items dinamicos, calculos automaticos de subtotal, impuestos y total
- **Gestion de clientes** - CRUD completo con busqueda, datos reutilizables en cada nueva factura
- **Ciclo de vida de facturas** - Seguimiento de estados: `DRAFT` -> `SENT` -> `VIEWED` -> `PAID` (con deteccion automatica de `OVERDUE`)
- **Generacion de PDF** - Facturas profesionales en PDF con React-PDF, listas para descargar o enviar
- **Envio por email** - Envio directo de facturas a clientes via Resend
- **Dashboard con analiticas** - Metricas de ingresos, facturas pendientes, clientes activos y graficos de tendencia mensual
- **Autenticacion segura** - NextAuth.js v5 con soporte OAuth
- **Busqueda y filtros** - Busqueda por numero de factura, cliente o estado en tiempo real

---

## Stack Tecnologico

| Capa | Tecnologia |
|---|---|
| **Framework** | Next.js 14 (App Router + Server Actions) |
| **Lenguaje** | TypeScript 5.7 |
| **Estilos** | Tailwind CSS 3.4 |
| **ORM** | Prisma 5.22 |
| **Base de datos** | SQLite (dev) / PostgreSQL (prod) |
| **Autenticacion** | NextAuth.js v5 |
| **Emails** | Resend |
| **PDF** | @react-pdf/renderer |
| **Graficos** | Recharts |
| **Validacion** | Zod |
| **Testing** | Vitest + Testing Library |
| **Iconos** | Lucide React |

---

## Como ejecutar localmente

### Requisitos previos

- Node.js 18+
- npm o pnpm

### Instalacion

```bash
# Clonar repositorio
git clone https://github.com/ronalc90/invoice-snap.git
cd invoice-snap

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Generar cliente de Prisma y crear base de datos
npx prisma db push

# (Opcional) Cargar datos de ejemplo
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3003](http://localhost:3003) en el navegador.

### Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo (puerto 3003) |
| `npm run build` | Build de produccion |
| `npm run test` | Ejecutar tests en modo watch |
| `npm run test:run` | Ejecutar tests una vez |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run db:studio` | Abrir Prisma Studio (GUI de base de datos) |
| `npm run db:seed` | Cargar datos de ejemplo |
| `npm run db:migrate` | Ejecutar migraciones de Prisma |

---

## Rutas y API

### Paginas (App Router)

| Ruta | Descripcion |
|---|---|
| `/` | Dashboard principal con metricas y graficos |
| `/invoices` | Listado de facturas con filtros por estado |
| `/invoices/new` | Crear nueva factura |
| `/invoices/[id]` | Detalle de factura con acciones |
| `/invoices/[id]/preview` | Vista previa / PDF de factura |
| `/clients` | Listado de clientes |
| `/clients/new` | Registrar nuevo cliente |
| `/clients/[id]` | Detalle y edicion de cliente |
| `/login` | Inicio de sesion |

### Server Actions

| Accion | Ubicacion |
|---|---|
| `getInvoices`, `createInvoice`, `updateInvoice`, `sendInvoice`, `markAsPaid` | `src/app/actions/invoices.ts` |
| `getClients`, `createClient`, `updateClient`, `deleteClient` | `src/app/actions/clients.ts` |
| `getDashboardStats`, `getMonthlyRevenue` | `src/app/actions/dashboard.ts` |

### API Routes

| Endpoint | Metodo | Descripcion |
|---|---|---|
| `/api/invoices/[id]/view` | `GET` | Registra visualizacion de factura (tracking) |
| `/api/auth/[...nextauth]` | `*` | Endpoints de autenticacion NextAuth |

---

## Estructura del proyecto

```
invoice-snap/
├── prisma/
│   ├── schema.prisma          # Modelos: User, Client, Invoice, InvoiceItem, Payment
│   └── seed.ts                # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── layout.tsx         # Layout con Sidebar
│   │   ├── login/             # Pagina de login
│   │   ├── invoices/          # CRUD de facturas
│   │   ├── clients/           # CRUD de clientes
│   │   ├── actions/           # Server Actions (invoices, clients, dashboard)
│   │   └── api/               # API routes (view tracking, auth)
│   ├── components/
│   │   ├── InvoiceForm.tsx    # Formulario de factura con items dinamicos
│   │   ├── InvoicePreview.tsx # Vista previa PDF
│   │   ├── ClientForm.tsx     # Formulario de cliente
│   │   ├── DataTable.tsx      # Tabla reutilizable
│   │   ├── StatusBadge.tsx    # Badge de estado de factura
│   │   ├── StatsCard.tsx      # Tarjeta de metrica del dashboard
│   │   ├── RevenueChart.tsx   # Grafico de ingresos mensuales
│   │   ├── SearchInput.tsx    # Input de busqueda
│   │   └── Sidebar.tsx        # Navegacion lateral
│   ├── lib/
│   │   ├── auth.ts            # Configuracion NextAuth
│   │   ├── db.ts              # Cliente Prisma
│   │   ├── email.ts           # Servicio de email (Resend)
│   │   ├── pdf-template.tsx   # Template PDF con React-PDF
│   │   ├── utils.ts           # Utilidades (formato moneda, numeros de factura)
│   │   └── validations.ts     # Schemas Zod
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── __tests__/                 # 49 tests (Vitest)
│   ├── invoice-calculations.test.ts
│   ├── invoice-status.test.ts
│   ├── invoice-lifecycle.test.ts
│   ├── validations.test.ts
│   └── utils.test.ts
├── docker-compose.yml         # PostgreSQL para produccion
└── docs/                      # Documentacion del proyecto
```

---

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

```env
# Base de datos (SQLite para desarrollo, PostgreSQL para produccion)
DATABASE_URL="file:./dev.db"
# DATABASE_URL="postgresql://user:pass@localhost:5432/invoicesnap"

# NextAuth
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="tu-secreto-seguro-aqui"

# Resend (servicio de email)
RESEND_API_KEY="re_tu_api_key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3003"
```

---

## Modelo de datos

```
User (1) ──── (N) Client
  |                  |
  |                  |
  └── (N) Invoice (N)┘
              |
              ├── (N) InvoiceItem
              └── (N) Payment
```

**Estados de factura:** `DRAFT` -> `SENT` -> `VIEWED` -> `PAID` | `OVERDUE`

---

## Tests

```bash
# Ejecutar todos los tests
npm run test:run

# Tests en modo watch
npm run test

# Con cobertura
npm run test:coverage
```

**49 tests** cubriendo:
- Calculos de factura (subtotal, impuestos, total)
- Transiciones de estado del ciclo de vida
- Validaciones con Zod (clientes, facturas, items)
- Utilidades (formato moneda, generacion de numeros)

---

## Autor

**Ronald** - [github.com/ronalc90](https://github.com/ronalc90)

## Licencia

Este proyecto esta bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para mas detalles.
