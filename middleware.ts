import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const invalidSession = !session;

  // Allowed Anonymous access
  const allowedPaths = ["/", "/register"];
  const isAllowedPath = allowedPaths.includes(path);
  const isRegisterPost = path === "/api/students" && req.method === "POST";
  const isAuthRequest = path.startsWith("/api/auth");

  // Redirect to login if there is no session and the request is not to an anonymous endpoint
  if (invalidSession && !isAllowedPath && !isRegisterPost && !isAuthRequest) {
    const formUrl =
      process.env.NEXTAUTH_FORM === "default" ? "/api/auth/signin" : "/login";

    return NextResponse.redirect(
      new URL(`${formUrl}?callbackUrl=${req.url}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|api/ddbg|api/spec|login/*|api/auth/*|_next/image|favicon.ico|public|api/healthcheck|users/claim|users/set-password|api/users/claim|api/users/set-password|.*\\.png$).*)",
  ],
};
