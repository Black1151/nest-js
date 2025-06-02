import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Call NestJS to refresh
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const nestResp = await fetch(
      `${backend}/graphql`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Refresh($refreshToken: String!) {
            refreshUsersTokens(refreshToken: $refreshToken) {
              accessToken
              refreshToken
              userDetails {
                publicId
                permissions
              }
            }
          }
        `,
          variables: { refreshToken },
        }),
      }
    );

    if (!nestResp.ok) {
      return NextResponse.json(
        { error: "Refresh request failed" },
        { status: 401 }
      );
    }

    const { data, errors } = await nestResp.json();
    if (errors || !data?.refreshUsersTokens?.accessToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const {
      accessToken,
      refreshToken: newRefresh,
      userDetails,
    } = data.refreshUsersTokens;

    // Set the new cookies
    const res = NextResponse.json({
      success: true,
      accessToken,
      refreshToken: newRefresh,
      userDetails,
    });

    // For dev/demo: not secure. Adjust to production needs.
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    res.cookies.set("refreshToken", newRefresh, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
