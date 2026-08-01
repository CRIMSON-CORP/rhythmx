// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();

  // NextAuth uses different cookie names in development (HTTP) vs production (HTTPS)
  const nextAuthCookies = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.callback-url",
    "__Host-next-auth.csrf-token",
  ];

  for (const cookieName of nextAuthCookies) {
    if (cookieStore.has(cookieName)) {
      cookieStore.delete(cookieName);
    }
  }

  // Redirect silently to your custom login page
  return NextResponse.redirect(new URL("/login", request.url));
}
