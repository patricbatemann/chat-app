import { NextRequest, NextResponse } from "next/server";
import { SERVER_URL } from "@/lib/config";

const BACKEND_URL = SERVER_URL;

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    const response = await fetch(`${BACKEND_URL}/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
