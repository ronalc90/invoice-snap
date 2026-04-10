# InvoiceSnap -- Alcance del MVP

Autor: Ronald

---

## Resumen Ejecutivo

El MVP de InvoiceSnap se desarrollara en 8 sprints de 2 semanas cada uno (16 semanas totales). El objetivo es entregar una aplicacion funcional que permita a un freelancer registrarse, agregar clientes, crear facturas profesionales, enviarlas por email o enlace, y rastrear el estado de pago.

Al finalizar el MVP, el usuario podra crear una factura profesional en menos de 60 segundos.

---

## Desglose por Sprints

### Sprint 1 -- Fundamentos (Semanas 1-2)

**Objetivo**: Configurar el proyecto base, autenticacion y estructura de la aplicacion.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Setup del proyecto | Next.js 14 + TypeScript + Tailwind + shadcn/ui | 4h |
| Configurar Prisma + Supabase | Conexion a PostgreSQL, schema inicial | 4h |
| Autenticacion con NextAuth v5 | Login con email/password + Google OAuth | 8h |
| Layout principal | Sidebar, header, navegacion responsive | 6h |
| Pagina de registro/login | UI completa con validaciones | 6h |
| Middleware de proteccion | Rutas protegidas, redireccion | 3h |
| CI/CD basico | Deploy automatico en Vercel | 3h |
| Tests de autenticacion | Tests unitarios y de integracion | 6h |

**Entregable**: Usuario puede registrarse, iniciar sesion y ver el layout principal.

**Criterios de Aceptacion**:
- El usuario puede registrarse con email/password.
- El usuario puede iniciar sesion con Google.
- Las rutas del dashboard estan protegidas.
- El layout es responsive (mobile, tablet, desktop).
- Deploy funcional en Vercel.

---

### Sprint 2 -- Gestion de Clientes (Semanas 3-4)

**Objetivo**: CRUD completo de clientes con busqueda y paginacion.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Schema de clientes en Prisma | Modelo Client con relaciones | 2h |
| API: Crear cliente | POST /api/clients | 3h |
| API: Listar clientes | GET /api/clients con paginacion | 3h |
| API: Actualizar cliente | PUT /api/clients/[id] | 2h |
| API: Eliminar cliente | DELETE /api/clients/[id] | 2h |
| UI: Lista de clientes | Tabla con busqueda, filtros, paginacion | 8h |
| UI: Formulario crear/editar cliente | Modal con validaciones | 6h |
| UI: Detalle de cliente | Pagina con historial de facturas | 4h |
| Validaciones de negocio | Email unico por usuario, campos requeridos | 3h |
| Tests | Tests unitarios de servicios + API | 6h |

**Entregable**: CRUD completo de clientes funcionando.

**Criterios de Aceptacion**:
- El usuario puede crear un cliente con nombre, email, empresa, telefono, direccion.
- La lista de clientes soporta busqueda por nombre/email y paginacion.
- El usuario puede editar y eliminar clientes.
- No se permiten emails duplicados para el mismo usuario.
- Al eliminar un cliente con facturas asociadas, se muestra confirmacion.

---

### Sprint 3 -- Creacion de Facturas - Base (Semanas 5-6)

**Objetivo**: Formulario de creacion de facturas con items y calculo automatico.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Schema de facturas e items | Modelos Invoice e InvoiceItem | 3h |
| Generador de numero de factura | Secuencia automatica por usuario (INV-001, INV-002...) | 3h |
| API: Crear factura | POST /api/invoices con items | 4h |
| API: Listar facturas | GET /api/invoices con filtros y paginacion | 3h |
| API: Obtener factura | GET /api/invoices/[id] | 2h |
| API: Actualizar factura | PUT /api/invoices/[id] | 3h |
| UI: Formulario de factura | Seleccion de cliente, items dinamicos, calculos | 12h |
| UI: Lista de facturas | Tabla con filtros por estado, busqueda | 6h |
| Calculos automaticos | Subtotal, impuestos, descuento, total | 3h |
| Tests | Tests de calculos, API, validaciones | 6h |

**Entregable**: El usuario puede crear facturas con multiples items y calculos automaticos.

**Criterios de Aceptacion**:
- El formulario permite seleccionar un cliente existente o crear uno nuevo.
- Se pueden agregar multiples items con descripcion, cantidad, precio unitario.
- El subtotal, impuestos y total se calculan automaticamente.
- El numero de factura se genera automaticamente.
- Las facturas se crean en estado "borrador" por defecto.
- La lista de facturas permite filtrar por estado (borrador, enviada, pagada, vencida).

---

### Sprint 4 -- Plantillas y Vista Previa (Semanas 7-8)

**Objetivo**: Tres plantillas de factura y vista previa en tiempo real.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Plantilla Minimalista | Diseno limpio, tipografia moderna | 6h |
| Plantilla Corporativa | Diseno formal con colores neutros | 6h |
| Plantilla Creativa | Diseno con acentos de color, para creativos | 6h |
| Selector de plantilla | UI para elegir plantilla al crear factura | 4h |
| Vista previa en tiempo real | Preview que se actualiza al editar | 6h |
| Personalizacion basica | Logo del usuario, colores primarios | 4h |
| Datos del emisor | Configuracion de datos del freelancer | 4h |
| Tests | Tests de renderizado de plantillas | 4h |

**Entregable**: Tres plantillas funcionales con vista previa en tiempo real.

**Criterios de Aceptacion**:
- El usuario puede elegir entre 3 plantillas al crear una factura.
- La vista previa se actualiza en tiempo real al modificar la factura.
- El usuario puede subir su logo y configurar color primario.
- Los datos del emisor (nombre, empresa, direccion, NIT/RFC) se configuran una vez.
- Las plantillas se ven profesionales en pantalla.

---

### Sprint 5 -- Envio por Email y Enlace Compartible (Semanas 9-10)

**Objetivo**: Enviar facturas por email y generar enlaces compartibles.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Integracion Resend | Configuracion del servicio de email | 3h |
| Template de email | Diseno del email con la factura adjunta | 6h |
| API: Enviar factura | POST /api/invoices/[id]/send | 4h |
| Generacion de enlace publico | Token unico para acceso publico | 3h |
| Pagina publica de factura | Vista de factura sin autenticacion | 6h |
| Boton compartir WhatsApp | Generar enlace de WhatsApp con URL de factura | 2h |
| Confirmacion de lectura | Tracking pixel para saber si abrio el email | 4h |
| Historial de envios | Registro de cuando se envio y reenvia | 4h |
| Cambio de estado automatico | Borrador -> Enviada al enviar | 2h |
| Tests | Tests de envio, generacion de links | 6h |

**Entregable**: Facturas se pueden enviar por email y compartir por enlace/WhatsApp.

**Criterios de Aceptacion**:
- El usuario puede enviar una factura por email al cliente.
- El email incluye un enlace para ver la factura en linea.
- El usuario puede generar un enlace unico para compartir por WhatsApp.
- La pagina publica muestra la factura con la plantilla seleccionada.
- Al enviar, el estado cambia automaticamente de "borrador" a "enviada".
- El usuario puede ver el historial de envios de cada factura.

---

### Sprint 6 -- Rastreo de Pagos (Semanas 11-12)

**Objetivo**: Sistema de rastreo de pagos con estados y dashboard.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Maquina de estados | draft -> sent -> viewed -> paid / overdue | 4h |
| API: Marcar como pagada | POST /api/invoices/[id]/pay | 3h |
| API: Registrar pago parcial | POST /api/invoices/[id]/payments | 4h |
| UI: Detalle de pagos | Historial de pagos por factura | 5h |
| Deteccion de vencidas | Job programado para marcar facturas vencidas | 4h |
| Notas de pago | Agregar notas al registrar un pago | 2h |
| Metodo de pago | Registrar como se recibio el pago | 2h |
| Indicadores visuales | Badges de estado con colores | 3h |
| Tests | Tests de maquina de estados, pagos | 6h |

**Entregable**: Sistema completo de rastreo de estados y registro de pagos.

**Criterios de Aceptacion**:
- Las facturas siguen el flujo: borrador -> enviada -> vista -> pagada / vencida.
- El usuario puede marcar una factura como pagada (total o parcial).
- Al registrar un pago, se puede indicar metodo (transferencia, efectivo, cheque, etc.).
- Las facturas vencidas se marcan automaticamente segun la fecha de vencimiento.
- Los estados se muestran con badges de colores en todas las vistas.

---

### Sprint 7 -- Dashboard y Reportes Basicos (Semanas 13-14)

**Objetivo**: Dashboard con metricas clave y resumen financiero.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Widget de resumen | Total facturado, pendiente, cobrado, vencido | 4h |
| Grafico de ingresos mensuales | Chart con tendencia de ultimos 6 meses | 5h |
| Facturas recientes | Lista de ultimas 5 facturas con estado | 3h |
| Clientes con deuda | Lista de clientes con facturas pendientes | 4h |
| Acciones rapidas | Botones para crear factura, agregar cliente | 2h |
| Filtro por periodo | Selector de rango de fechas | 4h |
| Exportar resumen | Descargar resumen en CSV | 4h |
| Pagina de configuracion | Datos del usuario, empresa, preferencias | 6h |
| Tests | Tests de calculos del dashboard | 6h |

**Entregable**: Dashboard funcional con metricas y configuracion del usuario.

**Criterios de Aceptacion**:
- El dashboard muestra total facturado, pendiente de cobro, cobrado y vencido.
- Se visualiza un grafico con la tendencia de ingresos de los ultimos 6 meses.
- Las ultimas 5 facturas se muestran con su estado actual.
- El usuario puede filtrar metricas por rango de fechas.
- El usuario puede exportar un resumen basico en CSV.
- La pagina de configuracion permite editar datos personales y de empresa.

---

### Sprint 8 -- Pulido, Testing y Lanzamiento (Semanas 15-16)

**Objetivo**: Testing exhaustivo, correccion de bugs, optimizacion y lanzamiento.

| Tarea | Descripcion | Estimacion |
|---|---|---|
| Testing E2E | Tests de flujos completos con Playwright | 8h |
| Correccion de bugs | Bugs encontrados durante testing | 8h |
| Optimizacion de rendimiento | Lazy loading, caching, optimizacion de queries | 6h |
| SEO y meta tags | Open Graph, meta descripciones, sitemap | 4h |
| Pagina de landing | Landing page publica con CTA | 6h |
| Documentacion de usuario | Guia rapida de uso | 4h |
| Configuracion de dominio | DNS, SSL, dominio personalizado | 2h |
| Monitoreo | Sentry para errores, Vercel Analytics | 3h |
| Revision de seguridad | CSRF, XSS, rate limiting, validaciones | 4h |
| Deploy a produccion | Verificacion final y lanzamiento | 3h |

**Entregable**: Aplicacion lista para produccion y disponible para usuarios.

**Criterios de Aceptacion**:
- Todos los flujos principales funcionan sin errores (registro, crear cliente, crear factura, enviar, marcar pagada).
- La aplicacion carga en menos de 3 segundos en conexion 3G.
- La landing page explica el producto y tiene CTA para registro.
- Sentry esta configurado para capturar errores en produccion.
- El dominio esta configurado y funcional con SSL.
- La aplicacion pasa las pruebas de seguridad basicas.

---

## Esquema de Base de Datos

```sql
-- ============================================
-- ESQUEMA DE BASE DE DATOS - InvoiceSnap MVP
-- PostgreSQL (Supabase)
-- ============================================

-- Tabla de usuarios
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),
    name            VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255),
    company_address TEXT,
    tax_id          VARCHAR(50),
    phone           VARCHAR(20),
    logo_url        VARCHAR(500),
    primary_color   VARCHAR(7) DEFAULT '#2563EB',
    currency        VARCHAR(3) DEFAULT 'USD',
    invoice_prefix  VARCHAR(10) DEFAULT 'INV',
    next_invoice_num INTEGER DEFAULT 1,
    plan            VARCHAR(20) DEFAULT 'free'
                    CHECK (plan IN ('free', 'pro', 'business')),
    stripe_customer_id VARCHAR(255),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255),
    phone           VARCHAR(20),
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100),
    zip_code        VARCHAR(20),
    tax_id          VARCHAR(50),
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, email)
);

-- Tabla de facturas
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    invoice_number  VARCHAR(50) NOT NULL,
    status          VARCHAR(20) DEFAULT 'draft'
                    CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled')),
    template        VARCHAR(50) DEFAULT 'minimal'
                    CHECK (template IN ('minimal', 'corporate', 'creative')),
    issue_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date        DATE NOT NULL,
    currency        VARCHAR(3) DEFAULT 'USD',
    subtotal        DECIMAL(12, 2) DEFAULT 0,
    tax_rate        DECIMAL(5, 2) DEFAULT 0,
    tax_amount      DECIMAL(12, 2) DEFAULT 0,
    discount_rate   DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total           DECIMAL(12, 2) DEFAULT 0,
    amount_paid     DECIMAL(12, 2) DEFAULT 0,
    amount_due      DECIMAL(12, 2) DEFAULT 0,
    notes           TEXT,
    terms           TEXT,
    public_token    VARCHAR(64) UNIQUE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    viewed_at       TIMESTAMP WITH TIME ZONE,
    paid_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, invoice_number)
);

-- Tabla de items de factura
CREATE TABLE invoice_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description     VARCHAR(500) NOT NULL,
    quantity        DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price      DECIMAL(12, 2) NOT NULL,
    amount          DECIMAL(12, 2) NOT NULL,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount          DECIMAL(12, 2) NOT NULL,
    payment_method  VARCHAR(50)
                    CHECK (payment_method IN ('bank_transfer', 'cash', 'check', 'credit_card', 'paypal', 'stripe', 'other')),
    payment_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    reference       VARCHAR(255),
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recordatorios
CREATE TABLE reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    type            VARCHAR(20) NOT NULL
                    CHECK (type IN ('before_due', 'on_due', 'after_due')),
    days_offset     INTEGER NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sent', 'failed')),
    scheduled_for   TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de envios
CREATE TABLE send_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    channel         VARCHAR(20) NOT NULL
                    CHECK (channel IN ('email', 'whatsapp', 'link')),
    recipient       VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'sent'
                    CHECK (status IN ('sent', 'delivered', 'opened', 'failed')),
    sent_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para optimizar consultas frecuentes
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_public_token ON invoices(public_token);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_reminders_invoice_id ON reminders(invoice_id);
CREATE INDEX idx_reminders_scheduled_for ON reminders(scheduled_for);
CREATE INDEX idx_send_history_invoice_id ON send_history(invoice_id);
```

---

## Endpoints de la API

### Autenticacion

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | /api/auth/register | Registrar nuevo usuario | No |
| POST | /api/auth/login | Iniciar sesion | No |
| POST | /api/auth/logout | Cerrar sesion | Si |
| GET | /api/auth/session | Obtener sesion actual | Si |
| POST | /api/auth/forgot-password | Solicitar reset de password | No |
| POST | /api/auth/reset-password | Resetear password | No |

### Clientes

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /api/clients | Listar clientes (paginado, busqueda) | Si |
| POST | /api/clients | Crear cliente | Si |
| GET | /api/clients/[id] | Obtener detalle de cliente | Si |
| PUT | /api/clients/[id] | Actualizar cliente | Si |
| DELETE | /api/clients/[id] | Eliminar cliente | Si |
| GET | /api/clients/[id]/invoices | Listar facturas del cliente | Si |

### Facturas

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /api/invoices | Listar facturas (filtros, paginacion) | Si |
| POST | /api/invoices | Crear factura con items | Si |
| GET | /api/invoices/[id] | Obtener detalle de factura | Si |
| PUT | /api/invoices/[id] | Actualizar factura | Si |
| DELETE | /api/invoices/[id] | Eliminar factura (solo borradores) | Si |
| POST | /api/invoices/[id]/send | Enviar factura por email | Si |
| POST | /api/invoices/[id]/duplicate | Duplicar factura | Si |
| GET | /api/invoices/[id]/link | Obtener enlace publico | Si |
| GET | /api/invoices/public/[token] | Ver factura publica | No |

### Pagos

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /api/invoices/[id]/payments | Listar pagos de una factura | Si |
| POST | /api/invoices/[id]/payments | Registrar pago | Si |
| DELETE | /api/payments/[id] | Eliminar registro de pago | Si |

### Dashboard

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /api/dashboard/summary | Resumen de metricas | Si |
| GET | /api/dashboard/revenue-chart | Datos para grafico de ingresos | Si |
| GET | /api/dashboard/recent-invoices | Ultimas facturas | Si |
| GET | /api/dashboard/overdue | Facturas vencidas | Si |

### Configuracion

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| GET | /api/settings | Obtener configuracion del usuario | Si |
| PUT | /api/settings | Actualizar configuracion | Si |
| POST | /api/settings/logo | Subir logo | Si |

### Webhooks

| Metodo | Endpoint | Descripcion | Auth |
|---|---|---|---|
| POST | /api/webhooks/stripe | Webhook de Stripe | Stripe Signature |
| GET | /api/webhooks/email-open/[id] | Tracking pixel de apertura | No |

---

## Pantallas de la Aplicacion

### Pantallas Publicas

| Pantalla | Ruta | Descripcion |
|---|---|---|
| Landing Page | / | Pagina principal con valor, caracteristicas y CTA |
| Login | /login | Formulario de inicio de sesion |
| Registro | /register | Formulario de registro |
| Olvidar Password | /forgot-password | Solicitar reset de password |
| Factura Publica | /invoice/[token] | Vista publica de factura (sin auth) |

### Pantallas del Dashboard

| Pantalla | Ruta | Descripcion |
|---|---|---|
| Dashboard | /dashboard | Resumen con metricas, graficos y acciones rapidas |
| Lista de Facturas | /invoices | Tabla de facturas con filtros y busqueda |
| Crear Factura | /invoices/new | Formulario de creacion con vista previa |
| Editar Factura | /invoices/[id]/edit | Edicion de factura existente |
| Detalle de Factura | /invoices/[id] | Vista completa con historial de pagos y envios |
| Lista de Clientes | /clients | Tabla de clientes con busqueda |
| Detalle de Cliente | /clients/[id] | Informacion del cliente + facturas asociadas |
| Configuracion | /settings | Datos personales, empresa, preferencias |
| Configuracion - Perfil | /settings/profile | Editar datos del usuario |
| Configuracion - Empresa | /settings/company | Datos de empresa, logo, colores |
| Configuracion - Plan | /settings/plan | Ver y cambiar plan actual |

---

## Resumen de Esfuerzo

| Sprint | Horas Estimadas | Semanas |
|---|---|---|
| Sprint 1: Fundamentos | 40h | 1-2 |
| Sprint 2: Clientes | 39h | 3-4 |
| Sprint 3: Facturas Base | 45h | 5-6 |
| Sprint 4: Plantillas y Preview | 40h | 7-8 |
| Sprint 5: Envio y Links | 40h | 9-10 |
| Sprint 6: Pagos | 33h | 11-12 |
| Sprint 7: Dashboard | 38h | 13-14 |
| Sprint 8: Pulido y Launch | 48h | 15-16 |
| **Total** | **323h** | **16 semanas** |

Considerando un ritmo de 20-25 horas semanales de desarrollo, el MVP es alcanzable en 16 semanas.
