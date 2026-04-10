import { notFound } from 'next/navigation';
import { getInvoiceForPublicView, markInvoiceAsViewed } from '@/app/actions/invoices';
import { InvoicePreview } from '@/components/InvoicePreview';

interface PreviewPageProps {
  params: { id: string };
}

export default async function InvoicePreviewPage({ params }: PreviewPageProps) {
  const invoice = await getInvoiceForPublicView(params.id);

  if (!invoice) {
    notFound();
  }

  // Mark as viewed when client opens it
  await markInvoiceAsViewed(params.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
              IS
            </div>
            <span className="text-lg font-bold text-gray-900">InvoiceSnap</span>
          </div>
        </div>
        <InvoicePreview invoice={invoice} />
        <div className="mt-6 text-center text-sm text-gray-400">
          Powered by InvoiceSnap
        </div>
      </div>
    </div>
  );
}
