/**
 * Instrumentacion de Next.js para metricas y observabilidad.
 *
 * Este archivo se carga automaticamente por Next.js cuando
 * `instrumentationHook: true` esta habilitado en next.config.js.
 *
 * Registra metricas basicas de la aplicacion que pueden ser
 * consumidas por Prometheus a traves del endpoint /api/metrics.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { MetricsCollector } = await import('./lib/metrics');
    MetricsCollector.initialize();

    console.log('[InvoiceSnap] Instrumentacion inicializada correctamente');
  }
}
