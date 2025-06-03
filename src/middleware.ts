import { NextRequest, NextResponse } from "next/server";
import jwtDecode, { JwtUserPayload } from "./helpers/jwtDecoder";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token) {
    const protectedRoutes =
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/reporter/dashboard");
    if (protectedRoutes) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }
    return NextResponse.next();
  }

  let tokenPayload: JwtUserPayload;
  try {
    tokenPayload = jwtDecode(token);
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const userRole = tokenPayload.role;
  if (userRole === "ADMIN") {
    if (!pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }
  if (userRole === "REPORTER") {
    if (!pathname.startsWith("/reporter/dashboard")) {
      return NextResponse.redirect(new URL("/reporter/dashboard", req.url));
    }
  }
  if (userRole === "READER") {
    if (
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/reporter/dashboard") ||
      pathname.startsWith("/auth")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
