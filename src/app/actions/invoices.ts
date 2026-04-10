'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { invoiceSchema, type InvoiceFormData } from '@/lib/validations';
import { generateInvoiceNumber } from '@/lib/utils';
import { sendInvoiceEmail } from '@/lib/email';
import type { ActionResult, InvoiceWithRelations, InvoiceWithClient, InvoiceStatus } from '@/types';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function getInvoices(filters?: {
  status?: InvoiceStatus;
  search?: string;
}): Promise<InvoiceWithClient[]> {
  const userId = await getUserId();

  return prisma.invoice.findMany({
    where: {
      userId,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.search
        ? {
            OR: [
              { invoiceNumber: { contains: filters.search } },
              { client: { name: { contains: filters.search } } },
              { client: { company: { contains: filters.search } } },
            ],
          }
        : {}),
    },
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getInvoiceById(id: string): Promise<InvoiceWithRelations | null> {
  const userId = await getUserId();

  return prisma.invoice.findFirst({
    where: { id, userId },
    include: {
      client: true,
      items: true,
      payments: true,
    },
  });
}

export async function getInvoiceForPublicView(id: string): Promise<InvoiceWithRelations | null> {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      items: true,
      payments: true,
    },
  });
}

export async function createInvoice(data: InvoiceFormData): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getUserId();
    const validated = invoiceSchema.parse(data);

    const invoiceNumber = await generateInvoiceNumber();

    // Calculate totals
    const items = validated.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (validated.taxRate / 100);
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        clientId: validated.clientId,
        invoiceNumber,
        issueDate: new Date(validated.issueDate),
        dueDate: new Date(validated.dueDate),
        taxRate: validated.taxRate,
        currency: validated.currency,
        notes: validated.notes || null,
        subtotal,
        taxAmount,
        total,
        items: {
          create: items,
        },
      },
    });

    revalidatePath('/invoices');
    revalidatePath('/');
    return { success: true, data: { id: invoice.id } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create invoice';
    return { success: false, error: message };
  }
}

export async function updateInvoice(id: string, data: InvoiceFormData): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await getUserId();
    const validated = invoiceSchema.parse(data);

    const existing = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, error: 'Invoice not found' };
    }

    if (existing.status !== 'DRAFT') {
      return { success: false, error: 'Only draft invoices can be edited' };
    }

    const items = validated.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (validated.taxRate / 100);
    const total = subtotal + taxAmount;

    // Delete existing items and recreate
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    await prisma.invoice.update({
      where: { id },
      data: {
        clientId: validated.clientId,
        issueDate: new Date(validated.issueDate),
        dueDate: new Date(validated.dueDate),
        taxRate: validated.taxRate,
        currency: validated.currency,
        notes: validated.notes || null,
        subtotal,
        taxAmount,
        total,
        items: {
          create: items,
        },
      },
    });

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${id}`);
    revalidatePath('/');
    return { success: true, data: { id } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update invoice';
    return { success: false, error: message };
  }
}

export async function deleteInvoice(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();

    const existing = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, error: 'Invoice not found' };
    }

    await prisma.invoice.delete({ where: { id } });

    revalidatePath('/invoices');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete invoice';
    return { success: false, error: message };
  }
}

export async function sendInvoice(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: { client: true },
    });

    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (invoice.status !== 'DRAFT' && invoice.status !== 'SENT') {
      return { success: false, error: 'Invoice cannot be sent in its current status' };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const viewUrl = `${appUrl}/invoices/${invoice.id}/preview`;

    const result = await sendInvoiceEmail({
      to: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client.name,
      total: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      viewUrl,
    });

    if (!result.success) {
      return { success: false, error: 'Failed to send email' };
    }

    await prisma.invoice.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send invoice';
    return { success: false, error: message };
  }
}

export async function markInvoiceAsViewed(id: string): Promise<ActionResult> {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (invoice.status === 'SENT') {
      await prisma.invoice.update({
        where: { id },
        data: {
          status: 'VIEWED',
          viewedAt: new Date(),
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update invoice' };
  }
}

export async function markAsPaid(
  id: string,
  paymentData?: { paymentMethod?: string; reference?: string }
): Promise<ActionResult> {
  try {
    const userId = await getUserId();

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      return { success: false, error: 'Invoice not found' };
    }

    if (invoice.status === 'PAID') {
      return { success: false, error: 'Invoice is already paid' };
    }

    await prisma.$transaction([
      prisma.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      }),
      prisma.payment.create({
        data: {
          invoiceId: id,
          amount: invoice.total,
          paymentMethod: paymentData?.paymentMethod || null,
          reference: paymentData?.reference || null,
        },
      }),
    ]);

    revalidatePath('/invoices');
    revalidatePath(`/invoices/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to mark as paid';
    return { success: false, error: message };
  }
}
