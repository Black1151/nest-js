import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/api/refresh") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (pathname.startsWith("/api/graphql")) {
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
