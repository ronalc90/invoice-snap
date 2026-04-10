import { ClientForm } from '@/components/ClientForm';

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Cliente</h1>
        <p className="mt-1 text-sm text-gray-500">Agrega un nuevo cliente a tu directorio</p>
      </div>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <ClientForm />
      </div>
    </div>
  );
}
