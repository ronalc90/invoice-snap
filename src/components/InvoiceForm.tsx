'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInvoice, updateInvoice } from '@/app/actions/invoices';
import { formatDateInput } from '@/lib/utils';
import type { Client } from '@prisma/client';
import type { InvoiceWithRelations } from '@/types';

interface InvoiceFormProps {
  clients: Client[];
  invoice?: InvoiceWithRelations;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceForm({ clients, invoice }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<LineItem[]>(
    invoice?.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) || [{ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }]
  );

  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? 0);

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  function addItem() {
    setItems([...items, { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(id: string) {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  }

  function updateItem(id: string, field: keyof LineItem, value: string | number) {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      clientId: formData.get('clientId') as string,
      issueDate: formData.get('issueDate') as string,
      dueDate: formData.get('dueDate') as string,
      taxRate,
      currency: (formData.get('currency') as string) || 'USD',
      notes: (formData.get('notes') as string) || '',
      items: items.map(({ description, quantity, unitPrice }) => ({
        description,
        quantity,
        unitPrice,
      })),
    };

    const result = invoice
      ? await updateInvoice(invoice.id, data)
      : await createInvoice(data);

    setLoading(false);

    if (result.success && result.data) {
      router.push(`/invoices/${result.data.id}`);
      router.refresh();
    } else {
      setError(result.error || 'Algo salio mal');
    }
  }

  const today = formatDateInput(new Date());
  const thirtyDaysLater = formatDateInput(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Cliente y Fechas */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Detalles de la Factura</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
              Cliente *
            </label>
            <select
              name="clientId"
              id="clientId"
              required
              defaultValue={invoice?.clientId || ''}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} {client.company ? `(${client.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
              Fecha de Emision *
            </label>
            <input
              type="date"
              name="issueDate"
              id="issueDate"
              required
              defaultValue={invoice ? formatDateInput(invoice.issueDate) : today}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              required
              defaultValue={invoice ? formatDateInput(invoice.dueDate) : thirtyDaysLater}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          <button
            type="button"
            onClick={addItem}
            className="rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100"
          >
            + Agregar Item
          </button>
        </div>

        <div className="space-y-4">
          {/* Encabezado */}
          <div className="hidden grid-cols-12 gap-4 text-sm font-medium text-gray-500 sm:grid">
            <div className="col-span-5">Descripcion</div>
            <div className="col-span-2">Cantidad</div>
            <div className="col-span-2">Precio Unitario</div>
            <div className="col-span-2">Monto</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Descripcion"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Cant."
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Precio"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center text-sm font-medium text-gray-900 sm:col-span-2">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </div>
              <div className="flex items-center sm:col-span-1">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totales y Notas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Notas</h3>
          <textarea
            name="notes"
            rows={4}
            defaultValue={invoice?.notes || ''}
            placeholder="Notas adicionales para el cliente..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <input type="hidden" name="currency" value="USD" />
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Resumen</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Impuesto</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right text-sm"
                />
                <span className="text-gray-500">%</span>
              </div>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : invoice ? 'Actualizar Factura' : 'Crear Factura'}
        </button>
      </div>
    </form>
  );
}
