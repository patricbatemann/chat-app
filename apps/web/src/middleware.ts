import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is accessing the protected /chat route
  if (request.nextUrl.pathname.startsWith("/chat")) {
    const hasToken = request.cookies.has("jwt_token");

    if (!hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/chat/:path*",
};
