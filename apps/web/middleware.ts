import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("elsaad_rt");

  if (pathname === "/admin/login") {
    if (hasRefreshToken) {
      const nextUrl = request.nextUrl.searchParams.get("next") ?? "/admin";
      return NextResponse.redirect(new URL(nextUrl, request.url));
    }
    return NextResponse.next();
  }

  if (!hasRefreshToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
