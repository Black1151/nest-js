import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const originalBody = await req.text();
    const accessToken = req.cookies.get("accessToken")?.value;

    const nestResp = await fetch(
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

    // We simply pass along the response from the Nest server
    const textBody = await nestResp.text();

    // Return the response with the same status as Nest gave us
    const response = new NextResponse(textBody, {
      status: nestResp.status,
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { errors: [{ message: "Internal Server Error" }] },
      { status: 500 }
    );
  }
}
