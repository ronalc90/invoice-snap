import { getClients } from '@/app/actions/clients';
import { InvoiceForm } from '@/components/InvoiceForm';

export default async function NewInvoicePage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
        <p className="mt-1 text-sm text-gray-500">Crea una nueva factura para un cliente</p>
      </div>
      {clients.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-gray-500">Necesitas agregar un cliente antes de crear una factura.</p>
          <a href="/clients/new" className="mt-4 inline-block text-primary-600 hover:underline">
            Agregar tu primer cliente
          </a>
        </div>
      ) : (
        <InvoiceForm clients={clients} />
      )}
    </div>
  );
}
