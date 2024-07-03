import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import type { Role } from "@/nextauth.d";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
  const path = req.nextUrl.pathname;
  const token = req.nextauth.token; // Available when middleware is augmented via "withAuth"
  const invalidSession = !token;

  // Allowed Anonymous access
  const allowedPaths = ["/", "/register"]
  const isAllowedPath = allowedPaths.includes(path);
  const isRegisterPost = path === "/api/students" && req.method === "POST";
  const isAuthRequest = path.startsWith("/api/auth")

  if (path.startsWith("/admin") || path.startsWith("/api/admin") && token?.role !== Role.admin) {
    return NextResponse.rewrite(
      new URL("/denied", req.url)
    );
  }

  // Redirect to login if there is no session and the request is not to an anonymous endpoint
  if (invalidSession && !isAllowedPath && !isRegisterPost && !isAuthRequest) {
    const formUrl = process.env.NEXTAUTH_FORM === "default" ? "/api/auth/signin" : "/login";

    return NextResponse.redirect(
      new URL(`${formUrl}?callbackUrl=${req.url}`, req.url)
    );
  }

  return NextResponse.next();
}
)

export const config = {
  matcher: [
    "/((?!_next/static|api/spec|login/*|api/auth/*|_next/image|favicon.ico|public|api/healthcheck|users/claim|users/set-password|api/users/claim|api/users/set-password|.*\\.png$).*)",
  ],
};
