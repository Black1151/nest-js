import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * GET /api/check-role
 *
 * Checks if the user has a valid access token (in an HTTP-only cookie) and
 * whether they have the correct role(s). Responds with JSON like:
 *   { hasAccess: true } or { hasAccess: false }
 */
export async function GET(req: NextRequest) {
  try {
    // 1) Extract the JWT from the "accessToken" cookie
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { hasAccess: false, error: "No access token cookie found" },
        { status: 401 }
      );
    }

    // 2) Verify and decode the token
    //    Make sure to use the same secret as in NestJS (JWT_SECRET)
    const secret = process.env.JWT_SECRET || "mySecretKey";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    // Example: The payload might look like: { sub, email, roles: ['user', 'admin'], iat, exp }
    const userRoles = decoded.roles as string[] | undefined;
    if (!userRoles) {
      return NextResponse.json(
        { hasAccess: false, error: "No roles in token" },
        { status: 403 }
      );
    }

    // 3) Implement your role-checking logic
    //    For example, check if the user is an admin:
    const requiredRole = "admin"; // or some other role
    const hasRequiredRole = userRoles.includes(requiredRole);

    if (!hasRequiredRole) {
      return NextResponse.json(
        { hasAccess: false, error: "User does not have the correct role" },
        { status: 403 }
      );
    }

    // 4) If we get here, the user has the correct privileges
    return NextResponse.json({ hasAccess: true }, { status: 200 });
  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json(
      { hasAccess: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
