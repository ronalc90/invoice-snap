import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateInput, getStatusColor, getStatusLabel, cn } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    const result = formatCurrency(1000);
    // Spanish locale uses comma for decimals
    expect(result).toContain('1000');
    expect(result).toContain('00');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should handle decimal amounts', () => {
    const result = formatCurrency(99.99);
    expect(result).toContain('99');
  });

  it('should handle different currencies', () => {
    const eurResult = formatCurrency(1000, 'EUR');
    expect(eurResult).toContain('1000');
  });
});

describe('formatDate', () => {
  it('should format dates in Spanish locale', () => {
    // Use noon UTC to avoid timezone offset shifting the day
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date);
    expect(result).toContain('2024');
    expect(result).toContain('ene');
  });

  it('should handle string dates', () => {
    const result = formatDate('2024-06-15T12:00:00Z');
    expect(result).toContain('jun');
    expect(result).toContain('2024');
  });
});

describe('formatDateInput', () => {
  it('should return YYYY-MM-DD format', () => {
    const date = new Date('2024-03-15T12:00:00Z');
    const result = formatDateInput(date);
    expect(result).toBe('2024-03-15');
  });
});

describe('getStatusColor', () => {
  it('should return correct colors for each status', () => {
    expect(getStatusColor('DRAFT')).toContain('gray');
    expect(getStatusColor('SENT')).toContain('blue');
    expect(getStatusColor('VIEWED')).toContain('yellow');
    expect(getStatusColor('PAID')).toContain('green');
    expect(getStatusColor('OVERDUE')).toContain('red');
  });

  it('should return default for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toContain('gray');
  });
});

describe('getStatusLabel', () => {
  it('should return Spanish labels for each status', () => {
    expect(getStatusLabel('DRAFT')).toBe('Borrador');
    expect(getStatusLabel('SENT')).toBe('Enviada');
    expect(getStatusLabel('VIEWED')).toBe('Vista');
    expect(getStatusLabel('PAID')).toBe('Pagada');
    expect(getStatusLabel('OVERDUE')).toBe('Vencida');
  });

  it('should return raw status for unknown values', () => {
    expect(getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    expect(cn('px-2', undefined, 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
