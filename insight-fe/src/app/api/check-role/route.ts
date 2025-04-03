import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return NextResponse.json(
        { hasAccess: false, error: "No access token cookie found" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || "mySecretKey";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    const userRoles = decoded.roles as string[] | undefined;
    if (!userRoles) {
      return NextResponse.json(
        { hasAccess: false, error: "No roles in token" },
        { status: 403 }
      );
    }

    const requiredRole = "admin";
    const hasRequiredRole = userRoles.includes(requiredRole);

    if (!hasRequiredRole) {
      return NextResponse.json(
        { hasAccess: false, error: "User does not have the correct role" },
        { status: 403 }
      );
    }

    return NextResponse.json({ hasAccess: true }, { status: 200 });
  } catch (error) {
    console.error("Role check error:", error);
    return NextResponse.json(
      { hasAccess: false, error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
