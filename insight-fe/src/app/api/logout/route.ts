import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/logout
 *
 * Clears accessToken and refreshToken cookies.
 */
export async function POST(req: NextRequest) {
  try {
    // If you want to also invalidate tokens in NestJS, you can do so here, e.g.:
    //  1) Read the refreshToken cookie from the request
    //  2) Call NestJS to revoke that refresh token in DB
    // For now, let's just clear them on the client side.

    const resp = NextResponse.json({ message: "Logged out successfully." });

    // Clear both tokens by setting them to empty with maxAge: 0
    resp.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    resp.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return resp;
  } catch (err) {
    console.error("Logout route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
