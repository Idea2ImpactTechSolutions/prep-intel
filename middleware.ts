import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Redirect to login if there is no session and the request is for a protected route
  // const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (!session && !req.nextUrl.pathname.startsWith("/api/auth")) {
  //   const formUrl =
  //     process.env.NEXTAUTH_FORM === "default" ? "/api/auth/signin" : "/login";
  //   return NextResponse.redirect(
  //     new URL(`${formUrl}?callbackUrl=${req.url}`, req.url)
  //   );
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|api/ddbg|login/*|api/auth/*|_next/image|favicon.ico|public|.*\\.png$).*)",
  ],
};
