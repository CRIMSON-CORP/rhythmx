import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect signed-in users away from auth pages to dashboard
    if (token && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Always allow access check to pass for /auth routes so custom function handles redirect
        if (pathname.startsWith("/auth")) {
          return true;
        }

        // Require active token for all protected dashboard routes
        return !!token;
      },
    },
  },
);

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (e.g. /api/auth/*)
     * - _next/static, _next/image (static Next.js assets)
     * - static files (favicon.ico, images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
