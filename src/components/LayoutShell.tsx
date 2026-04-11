'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

const breadcrumbLabels: Record<string, string> = {
  '': 'Panel',
  'invoices': 'Facturas',
  'clients': 'Clientes',
  'new': 'Nuevo',
  'edit': 'Editar',
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs: { label: string; href: string }[] = [
    { label: 'Panel', href: '/' },
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = breadcrumbLabels[segment] || segment;
    crumbs.push({ label, href: currentPath });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500">
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {index > 0 && (
            <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          )}
          {index === crumbs.length - 1 ? (
            <span className="font-medium text-gray-700">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-primary-600 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/login' || pathname.endsWith('/preview');

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
}
