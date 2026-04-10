# Decisiones Tecnicas (ADRs)

Registro de decisiones arquitectonicas tomadas durante el desarrollo de InvoiceSnap.

---

## ADR-001: Next.js App Router sobre Pages Router

**Estado:** Aceptada

**Contexto:** Next.js ofrece dos sistemas de routing: el tradicional Pages Router y el nuevo App Router introducido en Next.js 13.

**Decision:** Usar App Router.

**Justificacion:**
- Server Components por defecto reducen el JavaScript enviado al cliente
- Layouts anidados permiten compartir UI entre rutas sin re-renderizado
- Server Actions eliminan la necesidad de API Routes para mutaciones
- Streaming y Suspense para mejor UX de carga
- Es la direccion futura del framework

**Consecuencias:**
- Necesidad de marcar componentes interactivos con `'use client'`
- Algunas librerias de terceros aun no tienen soporte completo para Server Components (ej: `@react-pdf/renderer` requiere `serverComponentsExternalPackages`)

---

## ADR-002: Server Actions sobre tRPC o API Routes

**Estado:** Aceptada

**Contexto:** Para la comunicacion cliente-servidor se evaluaron tres opciones: API Routes tradicionales, tRPC, y Server Actions.

**Decision:** Usar Server Actions como capa principal de logica de negocio.

**Justificacion:**
- Tipado end-to-end nativo sin codigo de serializacion
- `revalidatePath()` integrado para invalidar cache
- Menos boilerplate que API Routes (no necesita fetch, headers, parse de body)
- Menos complejidad que tRPC (no requiere router, procedures, contexto)
- Las funciones se importan directamente en los componentes
- La autenticacion se resuelve con una llamada a `auth()` al inicio de cada accion

**API Routes se reservan para:**
- Endpoints publicos sin autenticacion (`/api/invoices/[id]/view`)
- Endpoints de NextAuth (`/api/auth/[...nextauth]`)

**Consecuencias:**
- La logica de negocio se concentra en `src/app/actions/`, no en `src/app/api/`
- Los endpoints publicos usan el pattern de Route Handlers de Next.js

---

## ADR-003: NextAuth v5 (Auth.js)

**Estado:** Aceptada

**Contexto:** La aplicacion necesita autenticacion para proteger las operaciones del usuario.

**Decision:** Usar NextAuth v5 con estrategia JWT y Prisma Adapter.

**Justificacion:**
- Estandar de la industria para autenticacion en Next.js
- Soporte nativo para App Router y middleware
- JWT strategy evita queries de sesion en cada request
- Prisma Adapter para persistir usuarios y cuentas
- Extensible con multiples providers (Google, GitHub, etc.)
- El middleware `auth()` protege rutas a nivel de framework

**Configuracion actual:**
- Provider: Credentials (email-based, auto-create en desarrollo)
- Session strategy: JWT
- Pages personalizadas: `/login`
- Callbacks: `jwt` y `session` para incluir `user.id`

**Consecuencias:**
- En desarrollo, los usuarios se crean automaticamente al loguearse con cualquier email
- Para produccion, se deberian agregar providers OAuth (Google, GitHub)

---

## ADR-004: Prisma sobre Drizzle

**Estado:** Aceptada

**Contexto:** Se necesita un ORM para interactuar con la base de datos. Las opciones principales eran Prisma y Drizzle.

**Decision:** Usar Prisma.

**Justificacion:**
- Mejor DX con auto-completado y tipos generados
- Prisma Studio para inspeccion visual de datos durante desarrollo
- Migraciones automaticas con `prisma db push` y `prisma migrate`
- Ecosistema maduro con documentacion extensa
- Compatible con NextAuth via `@auth/prisma-adapter`
- Singleton pattern en `db.ts` para hot-reload en desarrollo

**Trade-offs:**
- Drizzle es mas ligero y tiene mejor rendimiento en queries complejas
- Prisma genera un cliente mas pesado
- Para las necesidades actuales de InvoiceSnap (CRUD simple), la diferencia de rendimiento es despreciable

---

## ADR-005: React-PDF para Generacion de Facturas

**Estado:** Aceptada

**Contexto:** Las facturas necesitan exportarse como PDF profesional.

**Decision:** Usar `@react-pdf/renderer`.

**Justificacion:**
- Generacion server-side (no depende del navegador)
- Componentes React para definir el layout (familiaridad del equipo)
- Control total sobre tipografia, colores y layout
- Calidad profesional comparable a herramientas de disenio
- No requiere Puppeteer/Chromium (mas ligero)

**Alternativas descartadas:**
- `html2canvas` + `jspdf`: baja calidad, depende del DOM del navegador
- `puppeteer`: requiere Chromium, pesado para serverless
- APIs de terceros: dependencia externa, costos

**Configuracion requerida:**
```javascript
// next.config.js
experimental: {
  serverComponentsExternalPackages: ['@react-pdf/renderer'],
}
```

---

## ADR-006: SQLite (Desarrollo) / PostgreSQL (Produccion)

**Estado:** Aceptada

**Contexto:** Se necesita una base de datos que funcione bien en desarrollo local y en produccion.

**Decision:** Usar SQLite para desarrollo y PostgreSQL para produccion.

**Justificacion:**
- SQLite: zero-config, archivo local, ideal para desarrollo rapido
- PostgreSQL: robusto, escalable, soporte en todos los proveedores cloud
- Prisma abstrae las diferencias entre ambos motores
- Docker Compose incluido para PostgreSQL local cuando sea necesario

**Cambio de provider:**
```prisma
// Desarrollo
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Produccion
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## ADR-007: Zod para Validacion

**Estado:** Aceptada

**Contexto:** Se necesita validar datos de entrada tanto en el cliente (formularios) como en el servidor (Server Actions).

**Decision:** Usar Zod.

**Justificacion:**
- Los mismos schemas se usan en cliente y servidor
- Inferencia de tipos con `z.infer<typeof schema>` evita duplicar interfaces
- Mensajes de error descriptivos para formularios
- `z.coerce` para parsear numeros de inputs HTML
- Soporte nativo para valores opcionales y defaults

**Schemas definidos:**
- `clientSchema` -- Validacion de datos de cliente
- `invoiceSchema` -- Validacion de factura con items
- `invoiceItemSchema` -- Validacion de items individuales
- `paymentSchema` -- Validacion de datos de pago

---

## ADR-008: Vitest sobre Jest

**Estado:** Aceptada

**Contexto:** Se necesita un framework de testing para validar la logica de negocio.

**Decision:** Usar Vitest con jsdom environment.

**Justificacion:**
- Significativamente mas rapido que Jest (esbuild vs babel)
- Soporte nativo para TypeScript y ESM
- Compatible con Testing Library
- API compatible con Jest (migrar es trivial)
- Watch mode inteligente con HMR
- Path aliases (`@/`) funcionan con Vite resolver

**Configuracion:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': './src' },
  },
});
```
