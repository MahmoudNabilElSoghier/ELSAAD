import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login without check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Check presence of elsaad_rt cookie
  const hasRefreshToken = request.cookies.has("elsaad_rt");
  if (!hasRefreshToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
