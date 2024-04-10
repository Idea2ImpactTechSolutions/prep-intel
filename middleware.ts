import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Redirect to login if there is no session and the request is for a protected route
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session && path !== "/" && !path.startsWith("/api/auth")) {
    const formUrl =
      process.env.NEXTAUTH_FORM === "default" ? "/api/auth/signin" : "/login";
    return NextResponse.redirect(
      new URL(`${formUrl}?callbackUrl=${req.url}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  // matcher: [
  //   "/((?!_next/static|api/ddbg|login/*|api/auth/*|_next/image|favicon.ico|public|api/healthcheck|users/claim|users/set-password|api/users/claim|api/users/set-password|.*\\.png$).*)",
  // ],
};
