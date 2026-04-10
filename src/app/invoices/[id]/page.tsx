import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getInvoiceById } from '@/app/actions/invoices';
import { InvoicePreview } from '@/components/InvoicePreview';
import { InvoiceActions } from './InvoiceActions';

interface InvoiceDetailPageProps {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const invoice = await getInvoiceById(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Volver a facturas
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Factura {invoice.invoiceNumber}
          </h1>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      <InvoicePreview invoice={invoice} />
    </div>
  );
}
