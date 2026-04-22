import { NextResponse } from 'next/server';

export function middleware(request) {
  // If the user is trying to access the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If they are going to the login page, let them pass
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for the auth cookie
    const authToken = request.cookies.get('admin_auth_token');

    // If no token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
