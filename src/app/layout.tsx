import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LayoutShell } from '@/components/LayoutShell';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InvoiceSnap - Generador de Facturas',
  description: 'Generador de facturas profesional para freelancers. Crea, envia y rastrea facturas sin esfuerzo.',
  icons: {
    icon: '/favicon.svg',
  },
  other: {
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
