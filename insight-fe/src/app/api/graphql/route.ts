import { NextRequest, NextResponse } from "next/server";

/**
 * GraphQL API route handler that proxies requests to the NestJS backend.
 * Handles authentication by:
 * 1. Forwarding the access token from cookies to the backend
 * 2. Automatically refreshing expired tokens and retrying failed requests
 * 3. Returning appropriate error responses if authentication fails
 *
 * @param req The incoming Next.js request containing GraphQL query/mutation
 * @returns NextResponse with the GraphQL response from the backend
 */

export async function POST(req: NextRequest) {
  console.log("GraphQL proxy request received");

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

    console.log("NestJS response status:", nestResp.status);

    if (nestResp.status === 401) {
      const refreshResp = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/refresh`,
        {
          method: "POST",
        }
      );

      if (refreshResp.ok) {
        const data = await refreshResp.json();
        if (data?.accessToken) {
          nestResp = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.accessToken}`,
              },
              body: originalBody,
            }
          );
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

    const respText = await nestResp.text();

    console.log("NestJS response text:", respText);
    return new NextResponse(respText, {
      status: nestResp.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GraphQL proxy error:", err);
    return NextResponse.json(
      { errors: [{ message: "Internal Server Error" }] },
      { status: 500 }
    );
  }
}
