import { describe, it, expect } from 'vitest';
import { clientSchema, invoiceSchema } from '@/lib/validations';

describe('Client Schema Validation', () => {
  it('should validate a correct client', () => {
    const validClient = {
      name: 'Maria Garcia',
      email: 'maria@techstartup.com',
      phone: '+1 555-234-5678',
      company: 'TechStartup Inc.',
      address: '456 Innovation Blvd',
    };

    const result = clientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });

  it('should require name', () => {
    const result = clientSchema.safeParse({
      name: '',
      email: 'test@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('should require valid email', () => {
    const result = clientSchema.safeParse({
      name: 'Test',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('should allow optional fields to be empty strings', () => {
    const result = clientSchema.safeParse({
      name: 'Test Client',
      email: 'test@example.com',
      phone: '',
      company: '',
      address: '',
    });
    expect(result.success).toBe(true);
  });

  it('should reject name exceeding max length', () => {
    const result = clientSchema.safeParse({
      name: 'A'.repeat(101),
      email: 'test@example.com',
    });
    expect(result.success).toBe(false);
  });
});

describe('Invoice Schema Validation', () => {
  it('should validate a correct invoice', () => {
    const validInvoice = {
      clientId: 'client-123',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      taxRate: 10,
      currency: 'USD',
      notes: 'Gracias por su negocio',
      items: [
        {
          description: 'Desarrollo Web',
          quantity: 10,
          unitPrice: 100,
        },
      ],
    };

    const result = invoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
  });

  it('should require at least one item', () => {
    const result = invoiceSchema.safeParse({
      clientId: 'client-123',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [],
    });
    expect(result.success).toBe(false);
  });

  it('should require positive quantity', () => {
    const result = invoiceSchema.safeParse({
      clientId: 'client-123',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        {
          description: 'Test',
          quantity: -1,
          unitPrice: 100,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('should require client ID', () => {
    const result = invoiceSchema.safeParse({
      clientId: '',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [
        {
          description: 'Test',
          quantity: 1,
          unitPrice: 100,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('should cap tax rate at 100', () => {
    const result = invoiceSchema.safeParse({
      clientId: 'client-123',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      taxRate: 150,
      items: [
        {
          description: 'Test',
          quantity: 1,
          unitPrice: 100,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it('should default tax rate to 0', () => {
    const validInvoice = {
      clientId: 'client-123',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      items: [{ description: 'Test', quantity: 1, unitPrice: 100 }],
    };

    const result = invoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.taxRate).toBe(0);
    }
  });
});
