import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];
const protectedRoutes = ['/dashboard', '/bookings', '/orders', '/settings', '/profile'];

export default function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow API routes and static files
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/')
  ) {
    return NextResponse.next();
  }
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = path === '/login' || path === '/signup';
  
  // Simple token check (detailed verification happens in API routes)
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // Protect routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect authenticated users from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
