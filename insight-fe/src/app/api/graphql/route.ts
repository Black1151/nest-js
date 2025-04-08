import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let refreshSetCookieHeaders: string[] | undefined;

  try {
    const originalBody = await req.text();
    const accessToken = req.cookies.get("accessToken")?.value;

    let nestResp = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: originalBody,
      }
    );

    let nestJson;
    try {
      nestJson = await nestResp.json();
    } catch (err) {
      const text = await nestResp.text();
      return new NextResponse(text, {
        status: nestResp.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const errors = nestJson?.errors;

    const isUnauthorized = Array.isArray(errors)
      ? errors.some(
          (e: any) =>
            e?.extensions?.originalError?.statusCode === 401 ||
            e?.extensions?.code === "UNAUTHENTICATED"
        )
      : false;

    if (isUnauthorized) {
      const cookieHeader = req.headers.get("cookie") ?? "";

      const refreshResp = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
          },
        }
      );

      const setCookies: string[] = [];
      refreshResp.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          setCookies.push(value);
        }
      });
      if (setCookies.length > 0) {
        refreshSetCookieHeaders = setCookies;
      }

      if (refreshResp.ok) {
        const refreshData = await refreshResp.json();

        if (refreshData?.accessToken) {
          nestResp = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshData.accessToken}`,
              },
              body: originalBody,
            }
          );

          try {
            nestJson = await nestResp.json();
          } catch (err) {
            const text = await nestResp.text();
            return new NextResponse(text, {
              status: nestResp.status,
              headers: { "Content-Type": "application/json" },
            });
          }
        } else {
          return new NextResponse(
            JSON.stringify({ error: "Invalid refresh response" }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      } else {
        return new NextResponse(JSON.stringify({ error: "Refresh failed" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const response = new NextResponse(JSON.stringify(nestJson), {
      status: nestResp.status,
      headers: { "Content-Type": "application/json" },
    });

    if (refreshSetCookieHeaders) {
      for (const cookie of refreshSetCookieHeaders) {
        response.headers.append("Set-Cookie", cookie);
      }
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { errors: [{ message: "Internal Server Error" }] },
      { status: 500 }
    );
  }
}
