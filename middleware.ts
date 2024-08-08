import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { Role } from "@/nextauth.d";

function isRegisterRequest(path, method) {
  return path === "/api/students" && method === "POST";
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token; // Available when middleware is augmented via "withAuth"
    const invalidSession = !token;

    // Allowed Anonymous access
    const allowedPaths = ["/", "/register", "/api/admin/schools"]
    const isAllowedPath = allowedPaths.includes(path) || path.startsWith("/api/students") && req.method === "POST";

    // Authorization restrictions by area and role
    if (!isAllowedPath && !token?.userIsActive) {
      return NextResponse.rewrite(
        new URL("/inactive", req.url)
      );
    }

    // Authorization restrictions by area and role
    if (!isAllowedPath &&
        ((path.startsWith("/admin") || path.startsWith("/api/admin")) && token?.role !== Role.admin)  ||
        (path.startsWith("/school/") && !(token?.role === Role.manager || token?.role === Role.admin)) ||
        (path.startsWith("/recruiter/") && token?.role !== Role.recruiter) ||
        (path.startsWith("/student/") && token?.role !== Role.student)) {
      return NextResponse.rewrite(
        new URL("/denied", req.url)
      );
    }

    const isRegisterPost = isRegisterRequest(path, req.method);
    const isAuthRequest = path.startsWith("/api/auth")

    // Redirect to login if there is no session and the request is not to an anonymous endpoint
    if (invalidSession && !isAllowedPath && !isRegisterPost && !isAuthRequest) {
      const formUrl = process.env.NEXTAUTH_FORM === "default" ? "/api/auth/signin" : "/login";

      return NextResponse.redirect(
        new URL(`${formUrl}?callbackUrl=${req.url}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({token, req}) => !!token ||
        // Also allow register/create-account requests to pass through to middleware validation
        isRegisterRequest(req.nextUrl.pathname, req.method),
    }
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|register|api/spec|login/*|api/auth/*|_next/image|favicon.ico|public|api/healthcheck|users/claim|users/set-password|api/users/claim|api/users/*set-password|api/users/reset-password|.*\\.png$|.*\\.svg$).*)",
  ],
};
