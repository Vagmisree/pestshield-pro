import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_CUSTOMER = ['/dashboard'];
const PROTECTED_ADMIN = ['/admin'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  if (PROTECTED_CUSTOMER.some(p => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
  }

  if (PROTECTED_ADMIN.some(p => pathname.startsWith(p)) && pathname !== '/admin/login' && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
