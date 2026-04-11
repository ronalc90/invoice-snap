interface SendInvoiceEmailParams {
  to: string;
  invoiceNumber: string;
  clientName: string;
  total: number;
  currency: string;
  dueDate: Date;
  viewUrl: string;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams): Promise<{ success: boolean; messageId?: string }> {
  const { to, invoiceNumber, clientName, total, currency, dueDate, viewUrl } = params;

  // In development, mock the email send
  if (process.env.NODE_ENV === 'development' || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_dev_key') {
    console.log('--- Mock Email Sent ---');
    console.log(`To: ${to}`);
    console.log(`Subject: Factura ${invoiceNumber} de InvoiceSnap`);
    console.log(`Client: ${clientName}`);
    console.log(`Total: ${currency} ${total}`);
    console.log(`Due: ${dueDate.toISOString()}`);
    console.log(`View URL: ${viewUrl}`);
    console.log('--- End Mock Email ---');

    return { success: true, messageId: `mock-${Date.now()}` };
  }

  // Production: use Resend
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const formattedTotal = new Intl.NumberFormat('es', {
      style: 'currency',
      currency,
    }).format(total);

    const formattedDueDate = new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dueDate);

    const { data, error } = await resend.emails.send({
      from: 'InvoiceSnap <invoices@invoicesnap.dev>',
      to: [to],
      subject: `Factura ${invoiceNumber} - ${formattedTotal}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Factura ${invoiceNumber}</h2>
          <p>Hola ${clientName},</p>
          <p>Has recibido una nueva factura por <strong>${formattedTotal}</strong>.</p>
          <p>Fecha de vencimiento: <strong>${formattedDueDate}</strong></p>
          <div style="margin: 24px 0;">
            <a href="${viewUrl}"
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Ver Factura
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Esta factura fue enviada a traves de InvoiceSnap.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false };
  }
}
