// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/auth/login?expired=1", request.url));

  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    if (cookie.name.includes("next-auth")) {
      cookieStore.delete(cookie.name);
      response.cookies.delete(cookie.name);
      response.cookies.set(cookie.name, "", {
        maxAge: 0,
        path: "/",
        expires: new Date(0),
      });
    }
  }

  return response;
}

export async function POST(request: Request) {
  return GET(request);
}
