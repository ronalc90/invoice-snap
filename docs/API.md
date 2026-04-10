# Documentacion de API

InvoiceSnap utiliza **Server Actions** como capa principal de logica de negocio y **API Routes** solo para endpoints publicos.

## Server Actions

Las Server Actions estan definidas en `src/app/actions/` y se ejecutan en el servidor. Todas las acciones autenticadas verifican la sesion del usuario con `auth()`.

---

### Facturas (`src/app/actions/invoices.ts`)

#### `getInvoices(filters?)`

Obtiene la lista de facturas del usuario autenticado.

```typescript
async function getInvoices(filters?: {
  status?: InvoiceStatus;
  search?: string;
}): Promise<InvoiceWithClient[]>
```

**Parametros opcionales:**
- `status` -- Filtrar por estado (`DRAFT`, `SENT`, `VIEWED`, `PAID`, `OVERDUE`)
- `search` -- Buscar por numero de factura, nombre de cliente o empresa

**Retorna:** Array de facturas con la relacion `client` incluida, ordenadas por fecha de creacion descendente.

---

#### `getInvoiceById(id)`

Obtiene una factura especifica con todas sus relaciones.

```typescript
async function getInvoiceById(id: string): Promise<InvoiceWithRelations | null>
```

**Retorna:** Factura con `client`, `items` y `payments` incluidos. Solo retorna facturas del usuario autenticado.

---

#### `getInvoiceForPublicView(id)`

Obtiene una factura para vista publica (sin verificar autenticacion).

```typescript
async function getInvoiceForPublicView(id: string): Promise<InvoiceWithRelations | null>
```

**Uso:** Vista previa de factura para clientes que reciben el link por email.

---

#### `createInvoice(data)`

Crea una nueva factura con sus items.

```typescript
async function createInvoice(data: InvoiceFormData): Promise<ActionResult<{ id: string }>>
```

**Validacion:** Schema Zod (`invoiceSchema`)
- `clientId` -- obligatorio
- `issueDate`, `dueDate` -- obligatorios
- `taxRate` -- 0-100, default 0
- `currency` -- default "USD"
- `items[]` -- al menos 1 item con description, quantity > 0, unitPrice >= 0

**Logica:**
1. Valida datos con Zod
2. Genera numero de factura secuencial (`INV-YYYY-NNNN`)
3. Calcula subtotal, taxAmount y total
4. Crea factura con items en una sola transaccion
5. Revalida cache de `/invoices` y `/`

---

#### `updateInvoice(id, data)`

Actualiza una factura existente. Solo facturas en estado `DRAFT` pueden ser editadas.

```typescript
async function updateInvoice(id: string, data: InvoiceFormData): Promise<ActionResult<{ id: string }>>
```

**Restriccion:** Si `status !== 'DRAFT'`, retorna error.

**Logica:**
1. Verifica que la factura pertenece al usuario
2. Elimina items existentes y recrea con los nuevos datos
3. Recalcula subtotal, taxAmount y total

---

#### `deleteInvoice(id)`

Elimina una factura y todos sus items y pagos asociados (cascade).

```typescript
async function deleteInvoice(id: string): Promise<ActionResult>
```

---

#### `sendInvoice(id)`

Envia la factura al email del cliente y cambia el estado a `SENT`.

```typescript
async function sendInvoice(id: string): Promise<ActionResult>
```

**Restriccion:** Solo se puede enviar si `status === 'DRAFT'` o `status === 'SENT'` (reenvio).

**Logica:**
1. Obtiene factura con datos del cliente
2. Genera URL de vista publica
3. Envia email via Resend con HTML template
4. Actualiza status a `SENT` y registra `sentAt`

---

#### `markInvoiceAsViewed(id)`

Marca la factura como vista por el cliente. No requiere autenticacion.

```typescript
async function markInvoiceAsViewed(id: string): Promise<ActionResult>
```

**Restriccion:** Solo cambia estado si `status === 'SENT'`.

---

#### `markAsPaid(id, paymentData?)`

Registra el pago de una factura.

```typescript
async function markAsPaid(
  id: string,
  paymentData?: { paymentMethod?: string; reference?: string }
): Promise<ActionResult>
```

**Restriccion:** No se puede marcar como pagada si ya esta `PAID` o si es `DRAFT`.

**Logica (transaccion):**
1. Actualiza status a `PAID` y registra `paidAt`
2. Crea registro de `Payment` con el monto total

---

### Clientes (`src/app/actions/clients.ts`)

#### `getClients(search?)`

```typescript
async function getClients(search?: string): Promise<Client[]>
```

Busca por nombre, email o empresa del cliente.

---

#### `getClientById(id)`

```typescript
async function getClientById(id: string): Promise<Client | null>
```

---

#### `createClient(data)`

```typescript
async function createClient(data: ClientFormData): Promise<ActionResult<Client>>
```

**Validacion (`clientSchema`):**
- `name` -- obligatorio, max 100 caracteres
- `email` -- obligatorio, formato email valido
- `phone` -- opcional, max 20 caracteres
- `address` -- opcional, max 500 caracteres
- `company` -- opcional, max 100 caracteres

---

#### `updateClient(id, data)`

```typescript
async function updateClient(id: string, data: ClientFormData): Promise<ActionResult<Client>>
```

---

#### `deleteClient(id)`

```typescript
async function deleteClient(id: string): Promise<ActionResult>
```

**Restriccion:** No se puede eliminar un cliente que tiene facturas asociadas.

---

### Dashboard (`src/app/actions/dashboard.ts`)

#### `getDashboardStats()`

```typescript
async function getDashboardStats(): Promise<DashboardStats>
```

**Retorna:**

```typescript
type DashboardStats = {
  totalRevenue: number;      // Suma de facturas PAID
  pendingAmount: number;     // Suma de facturas SENT + VIEWED
  overdueAmount: number;     // Suma de facturas OVERDUE
  paidCount: number;         // Cantidad de facturas pagadas
  pendingCount: number;      // Cantidad de facturas pendientes
  overdueCount: number;      // Cantidad de facturas vencidas
  totalClients: number;      // Total de clientes
  monthlyRevenue: MonthlyRevenue[];  // Ingresos ultimos 6 meses
};
```

Ejecuta 6 queries en paralelo con `Promise.all` para obtener todas las metricas.

---

## API Routes (Publicas)

### `GET /api/invoices/[id]/view`

Endpoint publico para obtener datos de una factura y marcarla como vista.

**Parametros:**
- `id` (path) -- ID de la factura

**Respuesta exitosa (200):**

```json
{
  "id": "clxxxxxxxxx",
  "invoiceNumber": "INV-2024-0001",
  "status": "VIEWED",
  "total": 5500,
  "client": { ... },
  "items": [ ... ],
  "payments": [ ... ]
}
```

**Error (404):**

```json
{ "error": "Invoice not found" }
```

**Logica:** Si el estado es `SENT`, automaticamente lo cambia a `VIEWED` y registra `viewedAt`.

---

### `* /api/auth/[...nextauth]`

Endpoints de autenticacion gestionados por NextAuth v5. Soporta:

- `GET /api/auth/signin` -- Pagina de login
- `POST /api/auth/callback/credentials` -- Login con email
- `GET /api/auth/session` -- Sesion actual
- `POST /api/auth/signout` -- Cerrar sesion

---

## Tipos Compartidos

```typescript
// Estados posibles de una factura
type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE';

// Factura con todas las relaciones
type InvoiceWithRelations = Invoice & {
  client: Client;
  items: InvoiceItem[];
  payments: Payment[];
};

// Resultado estandar de acciones
type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

## Esquemas de Validacion (Zod)

### `clientSchema`

```typescript
z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  company: z.string().max(100).optional(),
})
```

### `invoiceSchema`

```typescript
z.object({
  clientId: z.string().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  currency: z.string().default('USD'),
  notes: z.string().max(1000).optional(),
  items: z.array(invoiceItemSchema).min(1),
})
```
