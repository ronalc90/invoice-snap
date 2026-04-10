import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });
    }

    // Mark as viewed if currently sent
    if (invoice.status === 'SENT') {
      await prisma.invoice.update({
        where: { id: params.id },
        data: {
          status: 'VIEWED',
          viewedAt: new Date(),
        },
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
