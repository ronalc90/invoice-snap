import Link from 'next/link';
import { getInvoices } from '@/app/actions/invoices';
import { StatusBadge } from '@/components/StatusBadge';
import { SearchInput } from '@/components/SearchInput';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { InvoiceStatus } from '@/types';

interface InvoicesPageProps {
  searchParams: { search?: string; status?: InvoiceStatus };
}

const statuses: { label: string; value: InvoiceStatus | '' }[] = [
  { label: 'Todas', value: '' },
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Enviada', value: 'SENT' },
  { label: 'Vista', value: 'VIEWED' },
  { label: 'Pagada', value: 'PAID' },
  { label: 'Vencida', value: 'OVERDUE' },
];

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const invoices = await getInvoices({
    status: searchParams.status || undefined,
    search: searchParams.search || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="mt-1 text-sm text-gray-500">
            {invoices.length} factura{invoices.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          + Nueva Factura
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {statuses.map((s) => (
            <Link
              key={s.value}
              href={s.value ? `/invoices?status=${s.value}` : '/invoices'}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                (searchParams.status || '') === s.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
        <SearchInput placeholder="Buscar facturas..." />
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-gray-500">No se encontraron facturas.</p>
          <Link href="/invoices/new" className="mt-4 inline-block text-primary-600 hover:underline">
            Crear tu primera factura
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="transition-colors hover:bg-primary-50/50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {formatDate(invoice.issueDate)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {invoice.client.name}
                    {invoice.client.company && (
                      <p className="text-xs text-gray-500">{invoice.client.company}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
