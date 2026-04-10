import type { Invoice, InvoiceItem, Client, Payment, User } from '@prisma/client';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE';

export type InvoiceWithRelations = Invoice & {
  client: Client;
  items: InvoiceItem[];
  payments: Payment[];
};

export type InvoiceWithClient = Invoice & {
  client: Client;
};

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export type DashboardStats = {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalClients: number;
  monthlyRevenue: MonthlyRevenue[];
};

export type MonthlyRevenue = {
  month: string;
  revenue: number;
};

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};
