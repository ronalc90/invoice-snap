# Ciclo de Vida de Factura

## Estados

Cada factura en InvoiceSnap pasa por un ciclo de vida con 5 estados posibles:

### DRAFT (Borrador)

Estado inicial al crear una factura. Se puede editar libremente.

- Se pueden modificar items, fechas, cliente, impuestos y notas
- Se puede eliminar
- Se puede enviar al cliente

### SENT (Enviada)

La factura fue enviada por email al cliente.

- Se registra la fecha de envio (`sentAt`)
- Se puede reenviar
- No se puede editar
- Se puede marcar como pagada directamente

### VIEWED (Vista)

El cliente abrio el link de la factura en su navegador.

- Se registra la fecha de visualizacion (`viewedAt`)
- Transicion automatica cuando el cliente accede a la vista publica
- Se puede marcar como pagada

### PAID (Pagada)

El pago fue registrado. Estado final.

- Se registra la fecha de pago (`paidAt`)
- Se crea un registro de pago (Payment)
- No se puede hacer ninguna otra accion

### OVERDUE (Vencida)

La factura supero su fecha de vencimiento sin recibir pago.

- Aplica cuando la fecha actual supera `dueDate`
- Se puede marcar como pagada (pago tardio)

## Diagrama de Transiciones

```
  DRAFT ──────► SENT ──────► VIEWED ──────► PAID
                  │              │
                  │              ▼
                  └──────► OVERDUE ──────► PAID
```

## Transiciones Validas

| Desde | Hacia | Como se activa |
|---|---|---|
| DRAFT | SENT | Enviar factura por email |
| SENT | VIEWED | Cliente abre el link |
| SENT | PAID | Marcar como pagada |
| SENT | OVERDUE | Fecha de vencimiento superada |
| VIEWED | PAID | Marcar como pagada |
| VIEWED | OVERDUE | Fecha de vencimiento superada |
| OVERDUE | PAID | Marcar como pagada (pago tardio) |

## Restricciones

- **No se puede editar** una factura despues de enviarla
- **No se puede retroceder** un estado (ej: SENT no puede volver a DRAFT)
- **PAID es estado final** -- no admite ninguna transicion
- **DRAFT no puede ir a PAID** directamente -- debe enviarse primero
- **Solo DRAFT se puede eliminar** de forma segura (las demas ya tienen registro de envio)

## Timestamps de Trazabilidad

| Evento | Campo | Momento |
|---|---|---|
| Creacion | `createdAt` | Al crear la factura |
| Envio | `sentAt` | Al enviar por email |
| Visualizacion | `viewedAt` | Cliente abre el link |
| Pago | `paidAt` | Al registrar pago |

Todos los timestamps son inmutables una vez registrados.

## Numeracion de Facturas

Formato: `INV-YYYY-NNNN`

Ejemplos:
- `INV-2024-0001`
- `INV-2024-0002`
- `INV-2025-0001` (se reinicia con el anio)

La numeracion es secuencial y automatica. No se puede modificar manualmente.
