import Link from 'next/link';
import { getDashboardStats } from './actions/dashboard';
import { getInvoices } from './actions/invoices';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { RevenueChart } from '@/components/RevenueChart';
import { formatCurrency, formatDate } from '@/lib/utils';

export default async function DashboardPage() {
  let stats;
  let recentInvoices;

  try {
    [stats, recentInvoices] = await Promise.all([
      getDashboardStats(),
      getInvoices(),
    ]);
  } catch {
    // Fallback para estado sin autenticar
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido a InvoiceSnap</h1>
        <p className="text-gray-500 mb-8">Generador de facturas rapido para freelancers</p>
        <Link href="/login" className="btn-primary">
          Iniciar sesion
        </Link>
      </div>
    );
  }

  const isEmpty = stats.totalClients === 0 && recentInvoices.length === 0;

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <div className="rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10 text-center max-w-lg mx-auto">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
              IS
            </div>
            <h2 className="text-2xl font-bold">Bienvenido a InvoiceSnap</h2>
            <p className="mt-2 text-sm text-primary-100">
              Comienza creando tu primer cliente para poder generar facturas profesionales en segundos.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/clients/new"
                className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 shadow-md hover:bg-primary-50 transition-all duration-200 hover:-translate-y-0.5"
              >
                + Crear tu primer cliente
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Como empezar</h3>
            <ol className="text-left text-sm text-gray-600 space-y-3">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">1</span>
                <span><strong>Agrega un cliente</strong> con sus datos de contacto</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">2</span>
                <span><strong>Crea una factura</strong> con los items y montos</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">3</span>
                <span><strong>Envia la factura</strong> por email y rastrea el estado</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner de bienvenida */}
      <div className="rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-xl font-bold">Bienvenido a InvoiceSnap</h2>
          <p className="mt-1 max-w-2xl text-sm text-primary-100">
            Tu plataforma de facturacion para freelancers. Crea facturas en segundos, rastrea
            pagos en tiempo real y recibe recordatorios automaticos. Todo desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="mt-1 text-sm text-gray-500">Resumen de tu actividad de facturacion</p>
        </div>
        <Link
          href="/invoices/new"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          + Nueva Factura
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Ingresos Totales"
          value={formatCurrency(stats.totalRevenue)}
          subtitle={`${stats.paidCount} factura${stats.paidCount !== 1 ? 's' : ''} pagada${stats.paidCount !== 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Pendiente"
          value={formatCurrency(stats.pendingAmount)}
          subtitle={`${stats.pendingCount} factura${stats.pendingCount !== 1 ? 's' : ''}`}
          className="border-l-4 border-l-blue-500"
        />
        <StatsCard
          title="Vencidas"
          value={formatCurrency(stats.overdueAmount)}
          subtitle={`${stats.overdueCount} factura${stats.overdueCount !== 1 ? 's' : ''}`}
          className="border-l-4 border-l-red-500"
        />
        <StatsCard
          title="Clientes"
          value={stats.totalClients.toString()}
          subtitle="Clientes activos"
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={stats.monthlyRevenue} />

      {/* Recent Invoices */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">Facturas Recientes</h2>
          <Link href="/invoices" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            Ver todas &rarr;
          </Link>
        </div>
        <div className="divide-y">
          {recentInvoices.slice(0, 5).map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoices/${invoice.id}`}
              className="flex items-center justify-between p-4 transition-colors hover:bg-primary-50/50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">{invoice.client.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={invoice.status} />
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Vence {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {recentInvoices.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Aun no tienes facturas. Crea tu primera factura.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
