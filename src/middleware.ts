import { NextRequest, NextResponse } from "next/server";
import jwtDecode, { JwtUserPayload } from "./helpers/jwtDecoder";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/reporter/dashboard");
  const isPublicRequireVerified = pathname.startsWith("/articles");

  // jika token gada, dan coba akses protected, redirect ke sign in
  if (!token) {
    if (isProtected) {
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

  const { role, verified } = tokenPayload;

  // jika token ada, dan coba akses public require verified, redirect ke verify
  if (!verified && isPublicRequireVerified) {
    return NextResponse.redirect(new URL("/auth/verify", req.url));
  }
  // jik admin coba akses selain admin dashboard, redirect ke admin dashboard
  if (role === "ADMIN") {
    if (!pathname.startsWith("/admin/dashboard")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // jika reporter coba akses selain reporter dashboard, redirect ke reporter dashboard
  if (role === "REPORTER") {
    if (!pathname.startsWith("/reporter/dashboard")) {
      return NextResponse.redirect(new URL("/reporter/dashboard", req.url));
    }
  }

  // jika reader coba akses dashboard dan auth, redirect ke main
  if (role === "READER") {
    if (
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/reporter/dashboard") ||
      pathname.startsWith("/auth")
    )
      return NextResponse.redirect(new URL("/", req.url));
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
