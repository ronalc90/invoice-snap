import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateInput, getStatusColor, cn } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format USD amounts correctly', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });

  it('should handle different currencies', () => {
    const eurResult = formatCurrency(1000, 'EUR');
    expect(eurResult).toContain('1,000.00');
  });
});

describe('formatDate', () => {
  it('should format dates correctly', () => {
    // Use noon UTC to avoid timezone offset shifting the day
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date);
    expect(result).toContain('Jan');
    expect(result).toContain('2024');
  });

  it('should handle string dates', () => {
    const result = formatDate('2024-06-15T12:00:00Z');
    expect(result).toContain('Jun');
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

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    expect(cn('px-2', undefined, 'py-1')).toBe('px-2 py-1');
  });

  it('should handle conflicting tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
