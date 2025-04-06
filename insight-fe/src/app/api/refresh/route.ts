import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // 1) Call your NestJS backend to refresh
    const nestResp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation Refresh($refreshToken: String!) {
            refreshUsersTokens(refreshToken: $refreshToken) {
              accessToken
              refreshToken
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
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken: newRefresh } = data.refreshUsersTokens;

    // 2) Set new cookies
    const res = NextResponse.json({ success: true });
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // in dev only
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });
    res.cookies.set("refreshToken", newRefresh, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("Refresh error: ", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
