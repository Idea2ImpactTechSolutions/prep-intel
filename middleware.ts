import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests if the following is true:
  // 1) It's a request for next-auth session & provider fetching
  // 2) The session exists
  // 3) The pathname is for static files (e.g., favicon.ico) or the API
  if (pathname.includes('/api/auth') || session || pathname.includes('/_next') || pathname.includes('/api')) {
    return NextResponse.next();
  }

  // Redirect to login if there is no session and the request is for a protected route
  if (!session && !pathname.includes('/public')) {
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${req.url}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|login/*|api/login|_next/image|.*\\.png$).*)"],

};
