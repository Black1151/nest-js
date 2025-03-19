import { NextRequest, NextResponse } from "next/server";



export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  // WIP NEED PROPER SOLUTION FOR CHECKING RBAC ON NAVIGATION - MIGHT NOT END UP IN HERE

  // 1) Allow public routes or Next internals (static files, etc.)
  //    e.g. let them see "/login" or "/logout" without a token
  if (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/api/refresh") || 
    pathname.startsWith("/_next") ||
    pathname.includes(".") // e.g. static assets
  ) {
    return NextResponse.next();
  }

  // 2) Check if we have an accessToken cookie
  const token = req.cookies.get("accessToken")?.value;
  // if (!token) {
  //   // No token => user is not logged in
  //   // If the route requires roles, redirect to /login
  //   const requiredRoles = getRequiredRolesForPath(pathname);
  //   if (requiredRoles) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   } else {
  //     // If no roles are required, let them continue
  //     return NextResponse.next();
  //   }
  // }

  // // 3) Decode the JWT to get roles
  // let roles: string[] = [];
  // try {
  //   const decoded: any = jwtDecode(token);
  //   roles = decoded.roles || [];
  // } catch (err) {
  //   console.error("JWT decode error:", err);
  //   // Possibly redirect to login
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // // 4) If this route has a role requirement, check it
  // const requiredRoles = getRequiredRolesForPath(pathname);
  // if (requiredRoles) {
  //   // The user must have at least one required role
  //   const hasAccess = requiredRoles.some((r) => roles.includes(r));
  //   if (!hasAccess) {
  //     // Redirect or show an "unauthorized" page
  //     return NextResponse.redirect(new URL("/unauthorized", req.url));
  //   }
  // }

  // 5) If the request is going to /api/graphql, attach the token in Authorization header
  //    so NestJS can also do server-side checks
  if (pathname.startsWith("/api/graphql")) {
    const headers = new Headers(req.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  // Otherwise, pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
