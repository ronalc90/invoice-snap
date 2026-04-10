import { NextResponse } from 'next/server';
import { MetricsCollector } from '@/lib/metrics';

/**
 * GET /api/metrics
 *
 * Endpoint de metricas en formato Prometheus exposition.
 * Consumido por el scraper de Prometheus configurado en
 * monitoring/prometheus.yml.
 */
export async function GET() {
  const metrics = MetricsCollector.serialize();

  return new NextResponse(metrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
