import { describe, it, expect } from 'vitest';

type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE';

// Simulate a full invoice lifecycle
interface MockInvoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  total: number;
  sentAt: Date | null;
  viewedAt: Date | null;
  paidAt: Date | null;
}

class InvoiceLifecycle {
  private invoice: MockInvoice;

  constructor(total: number) {
    this.invoice = {
      id: 'inv-001',
      invoiceNumber: 'INV-2024-0001',
      status: 'DRAFT',
      total,
      sentAt: null,
      viewedAt: null,
      paidAt: null,
    };
  }

  getInvoice(): MockInvoice {
    return { ...this.invoice };
  }

  send(): boolean {
    if (this.invoice.status !== 'DRAFT' && this.invoice.status !== 'SENT') {
      return false;
    }
    this.invoice.status = 'SENT';
    this.invoice.sentAt = new Date();
    return true;
  }

  view(): boolean {
    if (this.invoice.status !== 'SENT') return false;
    this.invoice.status = 'VIEWED';
    this.invoice.viewedAt = new Date();
    return true;
  }

  markPaid(): boolean {
    if (this.invoice.status === 'PAID' || this.invoice.status === 'DRAFT') {
      return false;
    }
    this.invoice.status = 'PAID';
    this.invoice.paidAt = new Date();
    return true;
  }

  markOverdue(): boolean {
    if (this.invoice.status !== 'SENT' && this.invoice.status !== 'VIEWED') {
      return false;
    }
    this.invoice.status = 'OVERDUE';
    return true;
  }
}

describe('Invoice Lifecycle (E2E-style)', () => {
  it('should complete full lifecycle: DRAFT -> SENT -> VIEWED -> PAID', () => {
    const lifecycle = new InvoiceLifecycle(5500);

    // Initially DRAFT
    let inv = lifecycle.getInvoice();
    expect(inv.status).toBe('DRAFT');
    expect(inv.sentAt).toBeNull();

    // Send
    expect(lifecycle.send()).toBe(true);
    inv = lifecycle.getInvoice();
    expect(inv.status).toBe('SENT');
    expect(inv.sentAt).not.toBeNull();

    // Client views
    expect(lifecycle.view()).toBe(true);
    inv = lifecycle.getInvoice();
    expect(inv.status).toBe('VIEWED');
    expect(inv.viewedAt).not.toBeNull();

    // Mark as paid
    expect(lifecycle.markPaid()).toBe(true);
    inv = lifecycle.getInvoice();
    expect(inv.status).toBe('PAID');
    expect(inv.paidAt).not.toBeNull();
  });

  it('should handle overdue then paid: DRAFT -> SENT -> OVERDUE -> PAID', () => {
    const lifecycle = new InvoiceLifecycle(3456);

    expect(lifecycle.send()).toBe(true);
    expect(lifecycle.markOverdue()).toBe(true);

    const inv = lifecycle.getInvoice();
    expect(inv.status).toBe('OVERDUE');

    expect(lifecycle.markPaid()).toBe(true);
    expect(lifecycle.getInvoice().status).toBe('PAID');
  });

  it('should not allow skipping send step', () => {
    const lifecycle = new InvoiceLifecycle(1000);

    // Cannot view before sending
    expect(lifecycle.view()).toBe(false);
    expect(lifecycle.getInvoice().status).toBe('DRAFT');

    // Cannot mark as paid from draft
    expect(lifecycle.markPaid()).toBe(false);
    expect(lifecycle.getInvoice().status).toBe('DRAFT');
  });

  it('should not allow actions after payment', () => {
    const lifecycle = new InvoiceLifecycle(2000);

    lifecycle.send();
    lifecycle.markPaid();

    // Cannot send after paid
    expect(lifecycle.send()).toBe(false);
    expect(lifecycle.getInvoice().status).toBe('PAID');

    // Cannot mark overdue after paid
    expect(lifecycle.markOverdue()).toBe(false);
    expect(lifecycle.getInvoice().status).toBe('PAID');

    // Cannot mark paid again
    expect(lifecycle.markPaid()).toBe(false);
  });

  it('should preserve invoice number format', () => {
    const lifecycle = new InvoiceLifecycle(100);
    const inv = lifecycle.getInvoice();

    expect(inv.invoiceNumber).toMatch(/^INV-\d{4}-\d{4}$/);
  });

  it('should track total correctly through lifecycle', () => {
    const lifecycle = new InvoiceLifecycle(9350);

    lifecycle.send();
    lifecycle.view();
    lifecycle.markPaid();

    const finalInvoice = lifecycle.getInvoice();
    expect(finalInvoice.total).toBe(9350);
  });
});
