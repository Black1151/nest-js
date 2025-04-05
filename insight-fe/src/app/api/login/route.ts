import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const nestResp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation LogUserInWithEmailAndPassword($email: String!, $password: String!) {
            logUserInWithEmailAndPassword(data: { email: $email, password: $password }) {
              accessToken
              refreshToken
            }
          }
        `,
          variables: { email, password },
        }),
      }
    );

    if (!nestResp.ok) {
      return NextResponse.json(
        { error: "Failed to contact NestJS or invalid credentials." },
        { status: 401 }
      );
    }

    const { data, errors } = await nestResp.json();

    if (errors || !data?.logUserInWithEmailAndPassword?.accessToken) {
      return NextResponse.json(
        { error: errors?.[0]?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = data.logUserInWithEmailAndPassword;

    const decodedAccessToken = jwtDecode(accessToken);
    const decodedRefreshToken = jwtDecode(refreshToken);

    const resp = NextResponse.json({ accessToken, refreshToken });
    resp.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
    resp.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return resp;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
