'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendInvoice, markAsPaid, deleteInvoice } from '@/app/actions/invoices';
import type { InvoiceWithRelations } from '@/types';

interface InvoiceActionsProps {
  invoice: InvoiceWithRelations;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSend() {
    if (!confirm('Enviar esta factura al cliente?')) return;
    setLoading('send');
    const result = await sendInvoice(invoice.id);
    setLoading(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Error al enviar');
    }
  }

  async function handleMarkPaid() {
    if (!confirm('Marcar esta factura como pagada?')) return;
    setLoading('paid');
    const result = await markAsPaid(invoice.id);
    setLoading(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Error al marcar como pagada');
    }
  }

  async function handleDelete() {
    if (!confirm('Estas seguro de eliminar esta factura? Esta accion no se puede deshacer.')) return;
    setLoading('delete');
    const result = await deleteInvoice(invoice.id);
    setLoading(null);
    if (result.success) {
      router.push('/invoices');
    } else {
      alert(result.error || 'Error al eliminar');
    }
  }

  return (
    <div className="flex gap-2">
      {invoice.status === 'DRAFT' && (
        <>
          <button
            onClick={handleSend}
            disabled={loading !== null}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading === 'send' ? 'Enviando...' : 'Enviar Factura'}
          </button>
          <a
            href={`/invoices/${invoice.id}/preview`}
            target="_blank"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Vista Previa
          </a>
        </>
      )}

      {(invoice.status === 'SENT' || invoice.status === 'VIEWED' || invoice.status === 'OVERDUE') && (
        <button
          onClick={handleMarkPaid}
          disabled={loading !== null}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
        >
          {loading === 'paid' ? 'Procesando...' : 'Marcar como Pagada'}
        </button>
      )}

      {invoice.status !== 'PAID' && (
        <button
          onClick={handleDelete}
          disabled={loading !== null}
          className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 disabled:opacity-50"
        >
          {loading === 'delete' ? 'Eliminando...' : 'Eliminar'}
        </button>
      )}
    </div>
  );
}
