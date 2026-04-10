'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { clientSchema, type ClientFormData } from '@/lib/validations';
import type { ActionResult } from '@/types';
import type { Client } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function getClients(search?: string): Promise<Client[]> {
  const userId = await getUserId();

  return prisma.client.findMany({
    where: {
      userId,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { company: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getClientById(id: string): Promise<Client | null> {
  const userId = await getUserId();

  return prisma.client.findFirst({
    where: { id, userId },
  });
}

export async function createClient(data: ClientFormData): Promise<ActionResult<Client>> {
  try {
    const userId = await getUserId();
    const validated = clientSchema.parse(data);

    const client = await prisma.client.create({
      data: {
        ...validated,
        userId,
      },
    });

    revalidatePath('/clients');
    return { success: true, data: client };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear el cliente';
    return { success: false, error: message };
  }
}

export async function updateClient(id: string, data: ClientFormData): Promise<ActionResult<Client>> {
  try {
    const userId = await getUserId();
    const validated = clientSchema.parse(data);

    const existing = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    const client = await prisma.client.update({
      where: { id },
      data: validated,
    });

    revalidatePath('/clients');
    revalidatePath(`/clients/${id}`);
    return { success: true, data: client };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el cliente';
    return { success: false, error: message };
  }
}

export async function deleteClient(id: string): Promise<ActionResult> {
  try {
    const userId = await getUserId();

    const existing = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, error: 'Cliente no encontrado' };
    }

    // Check if client has invoices
    const invoiceCount = await prisma.invoice.count({
      where: { clientId: id },
    });

    if (invoiceCount > 0) {
      return { success: false, error: 'No se puede eliminar un cliente con facturas existentes' };
    }

    await prisma.client.delete({ where: { id } });

    revalidatePath('/clients');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el cliente';
    return { success: false, error: message };
  }
}
