import { describe, it, expect } from 'vitest';

type InvoiceStatus = 'DRAFT' | 'SENT' | 'VIEWED' | 'PAID' | 'OVERDUE';

// Model the valid status transitions
const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ['SENT'],
  SENT: ['VIEWED', 'PAID', 'OVERDUE'],
  VIEWED: ['PAID', 'OVERDUE'],
  OVERDUE: ['PAID'],
  PAID: [],
};

function canTransition(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return validTransitions[from].includes(to);
}

function canEdit(status: InvoiceStatus): boolean {
  return status === 'DRAFT';
}

function canSend(status: InvoiceStatus): boolean {
  return status === 'DRAFT' || status === 'SENT';
}

function canMarkAsPaid(status: InvoiceStatus): boolean {
  return status !== 'PAID' && status !== 'DRAFT';
}

describe('Invoice Status Transitions', () => {
  it('should allow DRAFT -> SENT', () => {
    expect(canTransition('DRAFT', 'SENT')).toBe(true);
  });

  it('should allow SENT -> VIEWED', () => {
    expect(canTransition('SENT', 'VIEWED')).toBe(true);
  });

  it('should allow SENT -> PAID', () => {
    expect(canTransition('SENT', 'PAID')).toBe(true);
  });

  it('should allow VIEWED -> PAID', () => {
    expect(canTransition('VIEWED', 'PAID')).toBe(true);
  });

  it('should allow OVERDUE -> PAID', () => {
    expect(canTransition('OVERDUE', 'PAID')).toBe(true);
  });

  it('should NOT allow PAID -> any state', () => {
    expect(canTransition('PAID', 'DRAFT')).toBe(false);
    expect(canTransition('PAID', 'SENT')).toBe(false);
    expect(canTransition('PAID', 'VIEWED')).toBe(false);
    expect(canTransition('PAID', 'OVERDUE')).toBe(false);
  });

  it('should NOT allow DRAFT -> PAID directly', () => {
    expect(canTransition('DRAFT', 'PAID')).toBe(false);
  });

  it('should NOT allow backward transitions', () => {
    expect(canTransition('SENT', 'DRAFT')).toBe(false);
    expect(canTransition('VIEWED', 'SENT')).toBe(false);
    expect(canTransition('PAID', 'VIEWED')).toBe(false);
  });
});

describe('Invoice Editability', () => {
  it('should only allow editing DRAFT invoices', () => {
    expect(canEdit('DRAFT')).toBe(true);
    expect(canEdit('SENT')).toBe(false);
    expect(canEdit('VIEWED')).toBe(false);
    expect(canEdit('PAID')).toBe(false);
    expect(canEdit('OVERDUE')).toBe(false);
  });
});

describe('Invoice Sendability', () => {
  it('should allow sending DRAFT invoices', () => {
    expect(canSend('DRAFT')).toBe(true);
  });

  it('should allow resending SENT invoices', () => {
    expect(canSend('SENT')).toBe(true);
  });

  it('should not allow sending PAID invoices', () => {
    expect(canSend('PAID')).toBe(false);
  });
});

describe('Mark as Paid', () => {
  it('should allow marking SENT as paid', () => {
    expect(canMarkAsPaid('SENT')).toBe(true);
  });

  it('should allow marking VIEWED as paid', () => {
    expect(canMarkAsPaid('VIEWED')).toBe(true);
  });

  it('should allow marking OVERDUE as paid', () => {
    expect(canMarkAsPaid('OVERDUE')).toBe(true);
  });

  it('should NOT allow marking DRAFT as paid', () => {
    expect(canMarkAsPaid('DRAFT')).toBe(false);
  });

  it('should NOT allow marking PAID as paid again', () => {
    expect(canMarkAsPaid('PAID')).toBe(false);
  });
});
