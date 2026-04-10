import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public routes that don't require auth
  const publicPaths = ['/login', '/api/auth', '/invoices/'];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Allow public invoice preview
  if (pathname.match(/^\/invoices\/[^/]+\/preview$/)) {
    return NextResponse.next();
  }

  // Allow API routes for auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (pathname.match(/^\/api\/invoices\/[^/]+\/view$/)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
