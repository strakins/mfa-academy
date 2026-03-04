import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasAtLeastRole } from "@/lib/rbac";

const protectedPrefixes = [
  "/profile",
  "/student",
  "/instructor",
  "/admin",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = ((token as any).role ?? "USER") as any;

  // Role gates
  if (pathname.startsWith("/admin") && !hasAtLeastRole(role, "ADMIN")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }
  if (pathname.startsWith("/instructor") && !hasAtLeastRole(role, "INSTRUCTOR")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }
  if (pathname.startsWith("/student") && !hasAtLeastRole(role, "STUDENT")) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/student/:path*", "/instructor/:path*", "/admin/:path*"],
};
