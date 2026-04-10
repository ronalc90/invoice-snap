import { describe, it, expect } from 'vitest';

// Test invoice calculation logic (same logic used in createInvoice action)
function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number
) {
  const calculatedItems = items.map((item) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));

  const subtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return { items: calculatedItems, subtotal, taxAmount, total };
}

describe('Invoice Calculations', () => {
  it('should calculate item amounts correctly', () => {
    const items = [
      { quantity: 2, unitPrice: 100 },
      { quantity: 5, unitPrice: 50 },
    ];

    const result = calculateInvoiceTotals(items, 0);

    expect(result.items[0].amount).toBe(200);
    expect(result.items[1].amount).toBe(250);
    expect(result.subtotal).toBe(450);
    expect(result.total).toBe(450);
  });

  it('should calculate tax correctly', () => {
    const items = [{ quantity: 1, unitPrice: 1000 }];
    const result = calculateInvoiceTotals(items, 10);

    expect(result.subtotal).toBe(1000);
    expect(result.taxAmount).toBe(100);
    expect(result.total).toBe(1100);
  });

  it('should handle zero items', () => {
    const result = calculateInvoiceTotals([], 10);

    expect(result.subtotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(0);
  });

  it('should handle zero tax rate', () => {
    const items = [{ quantity: 3, unitPrice: 200 }];
    const result = calculateInvoiceTotals(items, 0);

    expect(result.subtotal).toBe(600);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(600);
  });

  it('should handle decimal quantities and prices', () => {
    const items = [{ quantity: 1.5, unitPrice: 99.99 }];
    const result = calculateInvoiceTotals(items, 8.5);

    expect(result.subtotal).toBeCloseTo(149.985, 2);
    expect(result.taxAmount).toBeCloseTo(12.749, 2);
    expect(result.total).toBeCloseTo(162.734, 2);
  });

  it('should handle multiple items with tax', () => {
    const items = [
      { quantity: 1, unitPrice: 3000 },
      { quantity: 10, unitPrice: 150 },
      { quantity: 1, unitPrice: 500 },
    ];

    const result = calculateInvoiceTotals(items, 10);

    expect(result.subtotal).toBe(5000);
    expect(result.taxAmount).toBe(500);
    expect(result.total).toBe(5500);
  });
});
