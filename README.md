<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

<h1 align="center">InvoiceSnap</h1>

<p align="center">
  <strong>Genera facturas profesionales en 60 segundos</strong>
</p>

<p align="center">
  Crea, envia y rastrea facturas desde un solo lugar.<br/>
  Disenado para freelancers que quieren cobrar mas rapido.
</p>

---

## Sobre el Proyecto

**InvoiceSnap** es una aplicacion web de facturacion construida con Next.js 14 App Router, pensada para freelancers y profesionales independientes. Permite crear facturas profesionales, enviarlas por email al cliente, rastrear si fueron vistas, y registrar pagos -- todo desde un dashboard intuitivo.

El sistema implementa un **ciclo de vida completo** para cada factura con maquina de estados:

```
DRAFT --> SENT --> VIEWED --> PAID
                     |
                  OVERDUE --> PAID
```

Cada transicion se registra con timestamps (`sentAt`, `viewedAt`, `paidAt`) para trazabilidad completa.

## Caracteristicas

- **Creacion rapida de facturas** con items dinamicos, impuestos configurables y notas
- **Ciclo de vida completo**: Draft, Sent, Viewed, Paid, Overdue
- **Envio por email** via Resend con tracking automatico de visualizacion
- **Vista publica** de facturas para clientes (sin autenticacion requerida)
- **Generacion de PDF** profesional con React-PDF
- **Dashboard** con metricas de ingresos, facturas pendientes y grafico de 6 meses
- **Gestion de clientes** con busqueda y tarjetas visuales
- **Busqueda y filtros** por estado en la lista de facturas
- **Validacion robusta** con Zod en cliente y servidor
- **Autenticacion** con NextAuth v5 (estrategia JWT)
- **Multi-moneda** con formato internacionalizado (Intl.NumberFormat)
- **Responsive design** con Tailwind CSS y paleta personalizada

## Arquitectura

InvoiceSnap utiliza **Next.js 14 App Router** con **Server Actions** como capa principal de logica de negocio, eliminando la necesidad de API Routes tradicionales para operaciones autenticadas.

```
src/
  app/
    actions/          <-- Server Actions (logica de negocio)
      invoices.ts     <-- CRUD + send + markViewed + markPaid
      clients.ts      <-- CRUD de clientes
      dashboard.ts    <-- Estadisticas y metricas
    api/              <-- Solo rutas publicas
      auth/           <-- NextAuth endpoints
      invoices/[id]/view/  <-- Vista publica (marca como VIEWED)
    invoices/         <-- Paginas de facturas
    clients/          <-- Paginas de clientes
    login/            <-- Pagina de login
  components/         <-- Componentes React reutilizables
  lib/                <-- Utilidades, auth, DB, validaciones, PDF
  types/              <-- TypeScript types e interfaces
  middleware.ts       <-- Proteccion de rutas
```

Los **Server Actions** manejan toda la logica autenticada (crear, editar, eliminar, enviar facturas), mientras que las **API Routes** solo se usan para endpoints publicos que no requieren sesion.

## Stack Tecnologico

| Categoria | Tecnologia |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript 5.7 |
| **ORM** | Prisma 5.22 |
| **Base de datos** | SQLite (dev) / PostgreSQL (prod) |
| **Autenticacion** | NextAuth v5 (Auth.js) |
| **Estilos** | Tailwind CSS 3.4 |
| **Validacion** | Zod 3.23 |
| **Email** | Resend |
| **PDF** | @react-pdf/renderer 4.1 |
| **Graficos** | Recharts 2.15 |
| **Iconos** | Lucide React |
| **Testing** | Vitest + Testing Library |
| **Deployment** | Vercel |

## Instalacion

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/ronalc90/invoice-snap.git
cd invoice-snap

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Generar el cliente Prisma y crear la base de datos
npx prisma generate
npx prisma db push

# 5. (Opcional) Cargar datos de ejemplo
npx tsx prisma/seed.ts

# 6. Iniciar el servidor de desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:3003`.

### Con PostgreSQL (produccion)

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Actualizar DATABASE_URL en .env
# DATABASE_URL="postgresql://invoicesnap:invoicesnap@localhost:5432/invoicesnap"

npx prisma db push
npm run dev
```

## Variables de Entorno

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexion a la base de datos | `file:./dev.db` |
| `NEXTAUTH_URL` | URL base de la aplicacion | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret para firmar tokens JWT | `tu-secret-seguro` |
| `RESEND_API_KEY` | API key de Resend para envio de emails | `re_xxxxxxxxxxxx` |
| `NEXT_PUBLIC_APP_URL` | URL publica de la aplicacion | `https://invoicesnap.vercel.app` |

> En desarrollo, el envio de emails se simula en consola si `RESEND_API_KEY` no esta configurado.

## Rutas y Paginas

| Ruta | Tipo | Descripcion |
|---|---|---|
| `/` | Pagina | Dashboard principal con metricas y facturas recientes |
| `/login` | Pagina | Inicio de sesion (email credentials) |
| `/invoices` | Pagina | Lista de facturas con filtros por estado y busqueda |
| `/invoices/new` | Pagina | Formulario de creacion de factura |
| `/invoices/[id]` | Pagina | Detalle de factura con acciones (enviar, marcar pagada) |
| `/invoices/[id]/preview` | Pagina | Vista publica de factura (accesible sin login) |
| `/clients` | Pagina | Lista de clientes con tarjetas visuales |
| `/clients/new` | Pagina | Formulario de nuevo cliente |
| `/clients/[id]` | Pagina | Detalle y edicion de cliente |
| `/api/auth/[...nextauth]` | API | Endpoints de autenticacion NextAuth |
| `/api/invoices/[id]/view` | API | Endpoint publico que retorna factura y marca como VIEWED |

## Estructura del Proyecto

```
invoice-snap/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI
├── __tests__/
│   ├── setup.ts                # Configuracion de test
│   ├── invoice-calculations.test.ts   # Calculos de totales e impuestos
│   ├── invoice-lifecycle.test.ts      # Ciclo de vida E2E
│   ├── invoice-status.test.ts         # Transiciones de estado
│   ├── utils.test.ts                  # Utilidades (formato, colores)
│   └── validations.test.ts           # Esquemas Zod
├── docs/
│   ├── ARCHITECTURE.md         # Arquitectura del sistema
│   ├── API.md                  # Documentacion de Server Actions y API
│   ├── DECISIONS.md            # Decisiones tecnicas (ADRs)
│   ├── DEPLOYMENT.md           # Guia de despliegue
│   └── INVOICE-LIFECYCLE.md    # Maquina de estados de facturas
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   └── seed.ts                 # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── actions/            # Server Actions
│   │   ├── api/                # API Routes (publicas)
│   │   ├── invoices/           # Paginas de facturas
│   │   ├── clients/            # Paginas de clientes
│   │   ├── login/              # Pagina de login
│   │   ├── layout.tsx          # Layout principal con Sidebar
│   │   ├── page.tsx            # Dashboard
│   │   └── globals.css         # Estilos globales
│   ├── components/
│   │   ├── ClientForm.tsx      # Formulario de clientes
│   │   ├── DataTable.tsx       # Tabla de datos generica
│   │   ├── InvoiceForm.tsx     # Formulario de facturas
│   │   ├── InvoicePreview.tsx  # Vista previa de factura
│   │   ├── RevenueChart.tsx    # Grafico de ingresos
│   │   ├── SearchInput.tsx     # Input de busqueda con URL params
│   │   ├── Sidebar.tsx         # Navegacion lateral
│   │   ├── StatsCard.tsx       # Tarjeta de estadistica
│   │   └── StatusBadge.tsx     # Badge de estado con colores
│   ├── lib/
│   │   ├── auth.ts             # Configuracion NextAuth v5
│   │   ├── auth-provider.ts    # Provider de credenciales
│   │   ├── db.ts               # Singleton Prisma Client
│   │   ├── email.ts            # Servicio de email (Resend)
│   │   ├── pdf-template.tsx    # Plantilla PDF con React-PDF
│   │   ├── utils.ts            # Utilidades (formato, colores, cn)
│   │   └── validations.ts      # Esquemas Zod
│   ├── types/
│   │   ├── index.ts            # Types de dominio
│   │   └── next-auth.d.ts      # Type augmentation para NextAuth
│   └── middleware.ts           # Middleware de autenticacion
├── docker-compose.yml          # PostgreSQL para produccion
├── tailwind.config.ts          # Configuracion Tailwind
├── vitest.config.ts            # Configuracion de tests
├── next.config.js              # Configuracion Next.js
├── package.json
└── tsconfig.json
```

## Decisiones Tecnicas

| Decision | Justificacion |
|---|---|
| **App Router sobre Pages Router** | Soporte nativo para Server Components, layouts anidados y Server Actions |
| **Server Actions sobre tRPC/API Routes** | Menos boilerplate, tipado end-to-end, revalidacion integrada |
| **NextAuth v5 sobre soluciones custom** | Estandar de la industria, soporte JWT, extensible con adapters |
| **Prisma sobre Drizzle** | Mejor DX, migraciones automaticas, Prisma Studio para debug |
| **React-PDF sobre html2canvas** | Generacion server-side, control total del layout, calidad profesional |
| **SQLite (dev) / PostgreSQL (prod)** | Desarrollo rapido sin Docker, produccion robusta |
| **Zod** | Validacion declarativa compartida entre cliente y servidor |
| **Vitest sobre Jest** | Mas rapido, mejor soporte para ESM y TypeScript nativo |

> Documentacion completa de decisiones en [docs/DECISIONS.md](docs/DECISIONS.md)

## Testing

El proyecto cuenta con **49 tests** organizados en 5 suites:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar una sola vez (CI)
npm run test:run

# Con cobertura
npm run test:coverage
```

| Suite | Tests | Cobertura |
|---|---|---|
| Calculos de factura | 6 | Totales, impuestos, decimales, items multiples |
| Ciclo de vida | 6 | Flujo completo, overdue, restricciones de estado |
| Transiciones de estado | 17 | Validacion de todas las transiciones posibles |
| Validaciones Zod | 11 | Esquemas de cliente y factura |
| Utilidades | 9 | Formato de moneda, fechas, colores, cn() |

## Despliegue

### Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar variables de entorno en el panel de Vercel
3. Cambiar `DATABASE_URL` a PostgreSQL (Supabase, Neon, Railway)
4. Deploy automatico en cada push a `main`

> Guia detallada en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Roadmap

- [ ] Facturas recurrentes (automaticas mensuales)
- [ ] Recordatorios automaticos de pago por email
- [ ] Soporte multi-idioma (i18n)
- [ ] Exportacion a Excel/CSV
- [ ] Integracion con pasarelas de pago (Stripe, PayPal)
- [ ] Reportes fiscales y contables
- [ ] App movil (React Native)
- [ ] Templates de factura personalizables

## Autor

Desarrollado por **Ronald** - [github.com/ronalc90](https://github.com/ronalc90)

## Licencia

Este proyecto esta bajo la [Licencia MIT](LICENSE).
