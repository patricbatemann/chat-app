import { NextRequest, NextResponse } from "next/server";
import { SERVER_URL } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const cookieHeader = req.headers.get("cookie");

    const response = await fetch(`${SERVER_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from backend" },
        { status: response.status }
      );
    }

    // Create a new response with the backend's body stream
    // This preserves the streaming behavior
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
