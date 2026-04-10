import { notFound } from 'next/navigation';
import { getClientById } from '@/app/actions/clients';
import { ClientForm } from '@/components/ClientForm';

interface ClientDetailPageProps {
  params: { id: string };
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
        <p className="mt-1 text-sm text-gray-500">Actualizar informacion del cliente</p>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <ClientForm client={client} />
      </div>
    </div>
  );
}
