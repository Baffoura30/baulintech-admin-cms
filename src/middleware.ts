import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isPublicApi = req.nextUrl.pathname.startsWith("/api/webhooks") || req.nextUrl.pathname.startsWith("/api/xero/callback");

    if (isAuthPage || isPublicApi) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - api/webhooks (public webhook endpoints)
     * - api/xero/callback (OAuth callback)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api/auth|api/webhooks|api/xero/callback|_next/static|_next/image|favicon.ico).*)",
  ],
};
