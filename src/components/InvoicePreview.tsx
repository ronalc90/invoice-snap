import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import type { InvoiceWithRelations } from '@/types';

interface InvoicePreviewProps {
  invoice: InvoiceWithRelations;
  showActions?: boolean;
}

export function InvoicePreview({ invoice, showActions = false }: InvoicePreviewProps) {
  return (
    <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8 shadow-sm print:shadow-none">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="mt-1 text-lg font-medium text-primary-600">{invoice.invoiceNumber}</p>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      {/* Dates */}
      <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
        <div>
          <p className="font-medium text-gray-500">Issue Date</p>
          <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Due Date</p>
          <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 rounded-lg bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium uppercase text-gray-500">Bill To</p>
        <p className="font-semibold text-gray-900">{invoice.client.name}</p>
        {invoice.client.company && (
          <p className="text-sm text-gray-600">{invoice.client.company}</p>
        )}
        <p className="text-sm text-gray-600">{invoice.client.email}</p>
        {invoice.client.address && (
          <p className="text-sm text-gray-600">{invoice.client.address}</p>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-gray-500">
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Qty</th>
              <th className="pb-3 text-right">Unit Price</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoice.items.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className="py-3 text-gray-900">{item.description}</td>
                <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="py-3 text-right text-gray-600">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {formatCurrency(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
              <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <p className="mb-1 text-xs font-medium uppercase text-gray-500">Notes</p>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {/* Payment Info */}
      {invoice.payments.length > 0 && (
        <div className="mt-6 rounded-lg bg-green-50 p-4">
          <p className="mb-2 text-xs font-medium uppercase text-green-700">Payment Received</p>
          {invoice.payments.map((payment) => (
            <div key={payment.id} className="text-sm text-green-800">
              <p>
                {formatCurrency(payment.amount, invoice.currency)} on{' '}
                {formatDate(payment.paymentDate)}
              </p>
              {payment.paymentMethod && <p>Method: {payment.paymentMethod}</p>}
              {payment.reference && <p>Reference: {payment.reference}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
