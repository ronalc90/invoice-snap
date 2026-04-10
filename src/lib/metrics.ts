/**
 * Recolector de metricas para InvoiceSnap.
 *
 * Implementa un sistema liviano de metricas compatible con el formato
 * Prometheus exposition. No requiere dependencias externas.
 *
 * Metricas disponibles:
 * - invoicesnap_http_requests_total: Total de peticiones HTTP
 * - invoicesnap_http_request_duration_seconds: Duracion de peticiones
 * - invoicesnap_invoices_created_total: Facturas creadas
 * - invoicesnap_invoices_sent_total: Facturas enviadas
 * - invoicesnap_active_users: Usuarios activos (gauge)
 * - invoicesnap_uptime_seconds: Tiempo de actividad
 */

interface CounterMetric {
  name: string;
  help: string;
  type: 'counter';
  labels: Map<string, number>;
}

interface GaugeMetric {
  name: string;
  help: string;
  type: 'gauge';
  value: number;
}

type Metric = CounterMetric | GaugeMetric;

class MetricsRegistry {
  private metrics: Map<string, Metric> = new Map();
  private startTime: number = Date.now();

  registerCounter(name: string, help: string): void {
    this.metrics.set(name, {
      name,
      help,
      type: 'counter',
      labels: new Map(),
    });
  }

  registerGauge(name: string, help: string): void {
    this.metrics.set(name, {
      name,
      help,
      type: 'gauge',
      value: 0,
    });
  }

  incrementCounter(name: string, labels: Record<string, string> = {}): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'counter') return;

    const key = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    const currentValue = metric.labels.get(key) || 0;
    metric.labels.set(key, currentValue + 1);
  }

  setGauge(name: string, value: number): void {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'gauge') return;
    metric.value = value;
  }

  serialize(): string {
    const lines: string[] = [];

    for (const metric of this.metrics.values()) {
      lines.push(`# HELP ${metric.name} ${metric.help}`);
      lines.push(`# TYPE ${metric.name} ${metric.type}`);

      if (metric.type === 'counter') {
        if (metric.labels.size === 0) {
          lines.push(`${metric.name} 0`);
        } else {
          for (const [labels, value] of metric.labels) {
            const labelStr = labels ? `{${labels}}` : '';
            lines.push(`${metric.name}${labelStr} ${value}`);
          }
        }
      } else {
        lines.push(`${metric.name} ${metric.value}`);
      }
    }

    // Metrica de uptime calculada dinamicamente
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    lines.push('# HELP invoicesnap_uptime_seconds Tiempo de actividad del servidor en segundos');
    lines.push('# TYPE invoicesnap_uptime_seconds gauge');
    lines.push(`invoicesnap_uptime_seconds ${uptimeSeconds}`);

    return lines.join('\n') + '\n';
  }
}

let registry: MetricsRegistry | null = null;

export class MetricsCollector {
  static initialize(): void {
    if (registry) return;

    registry = new MetricsRegistry();

    registry.registerCounter(
      'invoicesnap_http_requests_total',
      'Total de peticiones HTTP recibidas'
    );
    registry.registerCounter(
      'invoicesnap_invoices_created_total',
      'Total de facturas creadas'
    );
    registry.registerCounter(
      'invoicesnap_invoices_sent_total',
      'Total de facturas enviadas por email'
    );
    registry.registerGauge(
      'invoicesnap_active_users',
      'Numero de usuarios activos'
    );

    console.log('[Metrics] Registro de metricas inicializado');
  }

  static getRegistry(): MetricsRegistry | null {
    return registry;
  }

  static trackRequest(method: string, path: string, status: number): void {
    registry?.incrementCounter('invoicesnap_http_requests_total', {
      method,
      path,
      status: String(status),
    });
  }

  static trackInvoiceCreated(): void {
    registry?.incrementCounter('invoicesnap_invoices_created_total');
  }

  static trackInvoiceSent(): void {
    registry?.incrementCounter('invoicesnap_invoices_sent_total');
  }

  static setActiveUsers(count: number): void {
    registry?.setGauge('invoicesnap_active_users', count);
  }

  static serialize(): string {
    return registry?.serialize() ?? '';
  }
}
