import { NextRequest, NextResponse } from "next/server";
import { SERVER_URL } from "@/lib/config";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const response = await fetch(`${SERVER_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Auth Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
