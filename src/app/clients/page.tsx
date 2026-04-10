import Link from 'next/link';
import { getClients } from '@/app/actions/clients';
import { SearchInput } from '@/components/SearchInput';
import { formatDate } from '@/lib/utils';

interface ClientsPageProps {
  searchParams: { search?: string };
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const clients = await getClients(searchParams.search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          + Agregar Cliente
        </Link>
      </div>

      <SearchInput placeholder="Buscar clientes..." />

      {clients.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <p className="text-gray-500">No se encontraron clientes. Agrega tu primer cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{client.name}</h3>
                  {client.company && (
                    <p className="text-sm text-gray-500">{client.company}</p>
                  )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-medium text-white shadow-sm">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-500">
                <p>{client.email}</p>
                {client.phone && <p>{client.phone}</p>}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Agregado {formatDate(client.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
