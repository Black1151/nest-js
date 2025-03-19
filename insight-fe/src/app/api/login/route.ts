import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  console.log('login route hit');

  try {
    // 1) Parse the JSON body for credentials
    const { email, password } = await req.json();

    // 2) Forward to NestJS for authentication (example: GraphQL "login" mutation)
    const nestResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(data: { email: $email, password: $password }) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { email, password },
      }),
    });

    if (!nestResp.ok) {
      return NextResponse.json(
        { error: "Failed to contact NestJS or invalid credentials." },
        { status: 401 }
      );
    }

    const { data, errors } = await nestResp.json();

    // If NestJS returned errors or no token, assume invalid login
    if (errors || !data?.login?.accessToken) {
      return NextResponse.json(
        { error: errors?.[0]?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3) Extract tokens and user data
    const { accessToken, refreshToken, user } = data.login;

    // decode teh tokens and log to console
    const decodedAccessToken = jwtDecode(accessToken);
    const decodedRefreshToken = jwtDecode(refreshToken);
    console.log('decodedAccessToken', decodedAccessToken);
    console.log('decodedRefreshToken', decodedRefreshToken);


    // 5) Set HTTP-only cookies
    //    In production, set secure=true (with HTTPS), sameSite, etc.
    const resp = NextResponse.json({ user }); // Optionally return user info
    resp.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // set to true in production (HTTPS)
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // e.g., 15 minutes
    });
    resp.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // e.g., 7 days
    });

    return resp;
  } catch (err) {
    console.error("Login route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}