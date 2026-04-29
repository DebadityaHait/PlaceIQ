import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const role = token?.role;
  const path = req.nextUrl.pathname;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith("/student") && role !== "student") return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  if (path.startsWith("/recruiter") && role !== "recruiter") return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
  if (path.startsWith("/officer") && role !== "officer") return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/recruiter/:path*", "/officer/:path*"]
};
