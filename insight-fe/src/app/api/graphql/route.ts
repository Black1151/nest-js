import { NextRequest, NextResponse } from "next/server";
import { attemptRefresh } from "@/lib/authUtils";

export async function POST(req: NextRequest) {
  try {
    // 1) Read the original GraphQL body
    const originalBody = await req.text();

    // 2) Forward to Nest
    let nestResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
      body: originalBody,
    });

    // 3) If 401 => attempt refresh
    if (nestResp.status === 401) {
      const refreshed = await attemptRefresh();
      if (!refreshed) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // 4) If refresh succeeded, retry the original request
      nestResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If Nest strictly requires Authorization, decode the new cookie
          // or rely on Nest to read from the cookie. 
        },
        body: originalBody,
      });

      if (nestResp.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // 5) Pass along the final response
    const respText = await nestResp.text();
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
