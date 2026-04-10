import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Correo electronico invalido'),
  phone: z.string().max(20, 'El telefono no puede exceder 20 caracteres').optional().or(z.literal('')),
  address: z.string().max(500, 'La direccion no puede exceder 500 caracteres').optional().or(z.literal('')),
  company: z.string().max(100, 'La empresa no puede exceder 100 caracteres').optional().or(z.literal('')),
});

export type ClientFormData = z.infer<typeof clientSchema>;

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La descripcion es obligatoria'),
  quantity: z.coerce.number().positive('La cantidad debe ser positiva'),
  unitPrice: z.coerce.number().min(0, 'El precio unitario no puede ser negativo'),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'El cliente es obligatorio'),
  issueDate: z.string().min(1, 'La fecha de emision es obligatoria'),
  dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  currency: z.string().default('USD'),
  notes: z.string().max(1000).optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'Se requiere al menos un item'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser positivo'),
  paymentDate: z.string().min(1, 'La fecha de pago es obligatoria'),
  paymentMethod: z.string().optional().or(z.literal('')),
  reference: z.string().optional().or(z.literal('')),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
