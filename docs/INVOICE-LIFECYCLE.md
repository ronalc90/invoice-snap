# Ciclo de Vida de Facturas

## Diagrama de Estados

```
                    ┌──────────┐
                    │          │
            ┌──────►│  DRAFT   │
            │       │          │
            │       └────┬─────┘
            │            │
            │            │ sendInvoice()
            │            │ sentAt = now()
            │            ▼
            │       ┌──────────┐
            │       │          │
     resend │       │   SENT   │────────────────────┐
            │       │          │                    │
            │       └────┬─────┘                    │
            │            │                          │
            │            │ markAsViewed()            │ markOverdue()
            │            │ viewedAt = now()          │ (automatico o manual)
            │            ▼                          ▼
            │       ┌──────────┐            ┌──────────┐
            │       │          │            │          │
            │       │  VIEWED  │            │ OVERDUE  │
            │       │          │            │          │
            │       └────┬─────┘            └────┬─────┘
            │            │                       │
            │            │ markAsPaid()           │ markAsPaid()
            │            │ paidAt = now()         │ paidAt = now()
            │            ▼                       │
            │       ┌──────────┐                 │
            │       │          │◄────────────────┘
            │       │   PAID   │
            │       │          │
            │       └──────────┘
            │       (estado final)
```

## Estados

### DRAFT (Borrador)

Estado inicial de toda factura. La factura se puede editar libremente.

**Acciones permitidas:**
- Editar datos de la factura (cliente, items, fechas, notas)
- Enviar al cliente (`sendInvoice`)
- Eliminar
- Vista previa

**Acciones NO permitidas:**
- Marcar como pagada (debe enviarse primero)
- Marcar como vista

---

### SENT (Enviada)

La factura fue enviada por email al cliente.

**Se activa cuando:** Se ejecuta `sendInvoice()`.

**Datos registrados:**
- `sentAt`: timestamp del momento de envio
- Se envia email con link a la vista publica

**Acciones permitidas:**
- Reenviar al cliente
- Marcar como pagada
- Eliminar

**Acciones NO permitidas:**
- Editar contenido

---

### VIEWED (Vista)

El cliente abrio el link de la factura en su navegador.

**Se activa cuando:** El cliente accede a `/invoices/[id]/preview` o se llama a `/api/invoices/[id]/view`.

**Datos registrados:**
- `viewedAt`: timestamp de la primera visualizacion

**Condicion:** Solo se cambia a VIEWED si el estado actual es SENT.

**Acciones permitidas:**
- Marcar como pagada
- Eliminar

---

### PAID (Pagada)

El pago fue recibido y registrado.

**Se activa cuando:** Se ejecuta `markAsPaid()`.

**Datos registrados:**
- `paidAt`: timestamp del pago
- Se crea un registro en la tabla `Payment` con:
  - `amount`: monto total de la factura
  - `paymentDate`: fecha actual
  - `paymentMethod`: metodo de pago (opcional)
  - `reference`: referencia del pago (opcional)

**Es un estado final.** No se puede transicionar a ningun otro estado.

---

### OVERDUE (Vencida)

La factura supero su fecha de vencimiento sin recibir pago.

**Se activa cuando:** Se detecta que `dueDate < hoy` y el estado es SENT o VIEWED.

**Acciones permitidas:**
- Marcar como pagada (late payment)

---

## Tabla de Transiciones

| Desde | Hacia | Accion | Condiciones |
|---|---|---|---|
| DRAFT | SENT | `sendInvoice()` | -- |
| SENT | VIEWED | `markInvoiceAsViewed()` | Solo si status === SENT |
| SENT | PAID | `markAsPaid()` | -- |
| SENT | OVERDUE | Automatico/manual | `dueDate < now()` |
| VIEWED | PAID | `markAsPaid()` | -- |
| VIEWED | OVERDUE | Automatico/manual | `dueDate < now()` |
| OVERDUE | PAID | `markAsPaid()` | -- |
| PAID | -- | Estado final | No permite transiciones |

## Transiciones Invalidas

Las siguientes transiciones estan **bloqueadas** por la logica de negocio:

| Intento | Resultado |
|---|---|
| DRAFT -> PAID | Error: debe enviarse primero |
| DRAFT -> VIEWED | Error: debe enviarse primero |
| PAID -> cualquiera | Error: estado final |
| SENT -> DRAFT | Error: no se permite retroceder |
| VIEWED -> SENT | Error: no se permite retroceder |
| VIEWED -> DRAFT | Error: no se permite retroceder |

## Timestamps de Trazabilidad

Cada factura registra timestamps inmutables para las transiciones clave:

| Campo | Se registra cuando | Formato |
|---|---|---|
| `createdAt` | Se crea la factura | `DateTime @default(now())` |
| `sentAt` | Se envia al cliente | `DateTime?` |
| `viewedAt` | El cliente abre el link | `DateTime?` |
| `paidAt` | Se registra el pago | `DateTime?` |
| `updatedAt` | Cualquier actualizacion | `DateTime @updatedAt` |

## Generacion de Numero de Factura

El numero de factura sigue el formato `INV-YYYY-NNNN`:

```
INV-2024-0001
INV-2024-0002
...
INV-2025-0001  (se reinicia con el anio)
```

**Logica:** Se busca el ultimo numero del anio actual y se incrementa. Si no existe, comienza en 0001.

## Calculo de Totales

```
items[] = [{ quantity, unitPrice }]

item.amount = quantity * unitPrice
subtotal = sum(items[].amount)
taxAmount = subtotal * (taxRate / 100)
total = subtotal + taxAmount
```

Los totales se calculan al crear/actualizar la factura y se almacenan desnormalizados en la base de datos para consultas rapidas en el dashboard.

## Tests del Ciclo de Vida

Los tests cubren exhaustivamente el ciclo de vida en 3 suites (29 tests):

- **invoice-lifecycle.test.ts** (6 tests) -- Flujos completos E2E
- **invoice-status.test.ts** (17 tests) -- Todas las transiciones validas e invalidas
- **invoice-calculations.test.ts** (6 tests) -- Calculos de subtotal, tax y total
