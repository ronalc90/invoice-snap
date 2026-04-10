# Observabilidad - InvoiceSnap

Documentacion del sistema de monitoreo, metricas y alertas de InvoiceSnap.

## Arquitectura de Observabilidad

```
InvoiceSnap (Next.js)
    |
    +---> /api/metrics (formato Prometheus)
    |
    v
Prometheus (scrape cada 15s)
    |
    v
Grafana (dashboards y alertas)
```

## Componentes

### 1. Metricas de Aplicacion

El archivo `src/lib/metrics.ts` implementa un recolector de metricas liviano compatible con el formato Prometheus exposition, sin dependencias externas.

**Metricas disponibles**:

| Metrica | Tipo | Descripcion |
|---|---|---|
| `invoicesnap_http_requests_total` | Counter | Total de peticiones HTTP (labels: method, path, status) |
| `invoicesnap_invoices_created_total` | Counter | Total de facturas creadas |
| `invoicesnap_invoices_sent_total` | Counter | Total de facturas enviadas por email |
| `invoicesnap_active_users` | Gauge | Numero de usuarios activos |
| `invoicesnap_uptime_seconds` | Gauge | Tiempo de actividad del servidor |

### 2. Instrumentacion

El archivo `src/instrumentation.ts` se carga automaticamente por Next.js al inicio de la aplicacion y registra las metricas.

**Configuracion requerida en `next.config.js`**:

```js
experimental: {
  instrumentationHook: true,
}
```

### 3. Endpoint de Metricas

`GET /api/metrics` expone las metricas en formato text/plain compatible con Prometheus.

**Ejemplo de respuesta**:

```
# HELP invoicesnap_http_requests_total Total de peticiones HTTP recibidas
# TYPE invoicesnap_http_requests_total counter
invoicesnap_http_requests_total{method="GET",path="/",status="200"} 150
# HELP invoicesnap_invoices_created_total Total de facturas creadas
# TYPE invoicesnap_invoices_created_total counter
invoicesnap_invoices_created_total 42
# HELP invoicesnap_uptime_seconds Tiempo de actividad del servidor en segundos
# TYPE invoicesnap_uptime_seconds gauge
invoicesnap_uptime_seconds 86400
```

## Prometheus

### Configuracion

El archivo `monitoring/prometheus.yml` configura:

- **Scrape interval**: 15 segundos
- **Target**: `app:3003/api/metrics`
- **Auto-monitoreo**: Prometheus se monitorea a si mismo

### Acceso

- **URL**: http://localhost:9090
- **Queries utiles**:

```promql
# Tasa de peticiones por segundo (ultimos 5 min)
rate(invoicesnap_http_requests_total[5m])

# Total de facturas creadas
invoicesnap_invoices_created_total

# Uptime en horas
invoicesnap_uptime_seconds / 3600

# Tasa de errores (HTTP 5xx)
rate(invoicesnap_http_requests_total{status=~"5.."}[5m])
  /
rate(invoicesnap_http_requests_total[5m])
```

## Grafana

### Acceso

- **URL**: http://localhost:3001
- **Usuario**: admin
- **Password**: invoicesnap

### Configuracion Inicial

1. Agregar datasource Prometheus:
   - URL: `http://prometheus:9090`
   - Metodo: GET
   - Access: Server (default)

2. Crear dashboards para:
   - **Trafico**: Peticiones por segundo, endpoints mas visitados
   - **Facturas**: Creadas/enviadas por hora, tendencias
   - **Sistema**: Uptime, uso de recursos, errores

### Dashboards Recomendados

**Dashboard: Vista General**

| Panel | Query | Tipo |
|---|---|---|
| Peticiones/seg | `rate(invoicesnap_http_requests_total[5m])` | Time series |
| Facturas creadas | `invoicesnap_invoices_created_total` | Stat |
| Facturas enviadas | `invoicesnap_invoices_sent_total` | Stat |
| Usuarios activos | `invoicesnap_active_users` | Gauge |
| Uptime | `invoicesnap_uptime_seconds / 3600` | Stat |
| Tasa de errores | `rate(invoicesnap_http_requests_total{status=~"5.."}[5m])` | Time series |

## Uso del Recolector de Metricas

Para registrar metricas desde el codigo de la aplicacion:

```typescript
import { MetricsCollector } from '@/lib/metrics';

// Registrar una peticion HTTP
MetricsCollector.trackRequest('GET', '/invoices', 200);

// Registrar creacion de factura
MetricsCollector.trackInvoiceCreated();

// Registrar envio de factura
MetricsCollector.trackInvoiceSent();

// Actualizar usuarios activos
MetricsCollector.setActiveUsers(42);
```

## Levantar el Stack de Monitoreo

```bash
# Levantar todos los servicios (incluye Prometheus y Grafana)
docker compose up -d

# Verificar que Prometheus esta scrapeando
curl http://localhost:9090/api/v1/targets

# Verificar metricas de la app
curl http://localhost:3003/api/metrics

# Acceder a Grafana
open http://localhost:3001
```

## Alertas Recomendadas (Grafana)

### Alerta: Alta Tasa de Errores

```yaml
Condicion: rate(invoicesnap_http_requests_total{status=~"5.."}[5m]) > 0.05
Severidad: critica
Notificacion: email, Slack
Mensaje: "InvoiceSnap: Tasa de errores HTTP 5xx superior al 5%"
```

### Alerta: Aplicacion Caida

```yaml
Condicion: up{job="invoicesnap"} == 0
Severidad: critica
Notificacion: email, Slack, PagerDuty
Mensaje: "InvoiceSnap: La aplicacion no esta respondiendo"
```

### Alerta: Sin Facturas en 24h

```yaml
Condicion: increase(invoicesnap_invoices_created_total[24h]) == 0
Severidad: advertencia
Notificacion: email
Mensaje: "InvoiceSnap: No se han creado facturas en las ultimas 24 horas"
```

## Troubleshooting

### Prometheus no recolecta metricas

1. Verificar que la app esta corriendo: `curl http://localhost:3003`
2. Verificar endpoint de metricas: `curl http://localhost:3003/api/metrics`
3. Revisar targets en Prometheus: `http://localhost:9090/targets`
4. Verificar red Docker: `docker network inspect invoicesnap-network`

### Grafana no muestra datos

1. Verificar datasource: Settings > Data Sources > Prometheus
2. Verificar URL del datasource: `http://prometheus:9090`
3. Probar query en Prometheus UI primero
4. Verificar rango de tiempo en Grafana

## Contacto

- **Autor**: Ronald
- **Repositorio**: https://github.com/ronalc90/invoice-snap
