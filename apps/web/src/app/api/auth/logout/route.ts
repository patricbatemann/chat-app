import { NextRequest, NextResponse } from "next/server";
import { SERVER_URL } from "@/lib/config";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");

    // Call backend to invalidate session/clear cookies
    const response = await fetch(`${SERVER_URL}/auth/logout`, {
      method: "GET",
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      credentials: "include",
    });

    // Return success JSON so client can redirect
    const successResponse = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Forward Set-Cookie headers from backend to browser to clear cookies
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      successResponse.headers.set("Set-Cookie", setCookie);
    }

    return successResponse;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if backend fails, return success so client clears its state/redirects
    return NextResponse.json(
      { success: true, message: "Logged out with errors" },
      { status: 200 }
    );
  }
}
