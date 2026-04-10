'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { DashboardStats, MonthlyRevenue } from '@/types';

async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const userId = await getUserId();

  const [
    paidInvoices,
    sentInvoices,
    overdueInvoices,
    viewedInvoices,
    totalClients,
    allPaidInvoices,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { userId, status: 'PAID' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { userId, status: 'SENT' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { userId, status: 'OVERDUE' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { userId, status: 'VIEWED' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.client.count({ where: { userId } }),
    prisma.invoice.findMany({
      where: { userId, status: 'PAID', paidAt: { not: null } },
      select: { total: true, paidAt: true },
      orderBy: { paidAt: 'asc' },
    }),
  ]);

  // Calculate monthly revenue for last 6 months
  const monthlyRevenue: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthName = monthDate.toLocaleString('en-US', { month: 'short' });

    const monthRevenue = allPaidInvoices
      .filter((inv) => {
        const paidAt = inv.paidAt!;
        return paidAt >= monthDate && paidAt <= monthEnd;
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    monthlyRevenue.push({
      month: monthName,
      revenue: monthRevenue,
    });
  }

  const pendingAmount =
    (sentInvoices._sum.total || 0) + (viewedInvoices._sum.total || 0);
  const pendingCount =
    (sentInvoices._count || 0) + (viewedInvoices._count || 0);

  return {
    totalRevenue: paidInvoices._sum.total || 0,
    pendingAmount,
    overdueAmount: overdueInvoices._sum.total || 0,
    paidCount: paidInvoices._count || 0,
    pendingCount,
    overdueCount: overdueInvoices._count || 0,
    totalClients,
    monthlyRevenue,
  };
}
