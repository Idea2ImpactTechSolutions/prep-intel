import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Cookie exists?
  const token = request.cookies.get("token");

  // Assuming '/login' is your login route
  const loginPath = "/login";
  let loginRequired = !token && request.nextUrl.pathname !== loginPath;

  // TODO: Way too heavy, but works as a starting point
  if (token && token.value) {
    //if (token && request.nextUrl.pathname.startsWith('/api/')) {
    try {
      await jwtVerify(
        token.value,
        new TextEncoder().encode(process.env.TOKEN_SECRET as string)
      );
    } catch (err) {
      loginRequired = true;
    }
  }

  // Check if the request is for a page other than the login page
  // if (loginRequired) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = loginPath;
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|login/*|api/login|_next/image|.*\\.png$).*)"],
};
