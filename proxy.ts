import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const proxy = withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect signed-in users away from pre-login auth pages (get-started, login, verify)
    if (token && pathname.startsWith("/auth") && !pathname.startsWith("/auth/create-account")) {
      if (token.next_step === "choose_plan" || token.next_step === "renew") {
        return NextResponse.redirect(new URL("/billing", req.url));
      }
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect unauthenticated users trying to access /billing to login
    if (!token && pathname.startsWith("/billing")) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/billing", req.url));
    }

    // Redirect unauthenticated users trying to access /auth/create-account to /auth/get-started
    if (!token && pathname.startsWith("/auth/create-account")) {
      return NextResponse.redirect(new URL("/auth/get-started", req.url));
    }

    // Redirect signed-in users needing to choose or renew plan to /billing
    if (
      token &&
      (token.next_step === "choose_plan" || token.next_step === "renew") &&
      !pathname.startsWith("/billing") &&
      !pathname.startsWith("/auth")
    ) {
      return NextResponse.redirect(new URL("/billing", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to pre-login auth pages
        if (pathname.startsWith("/auth") && !pathname.startsWith("/auth/create-account")) {
          return true;
        }

        // Require active session token for /auth/create-account and all dashboard pages
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
