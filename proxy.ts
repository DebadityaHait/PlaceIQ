import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;
    if (path.startsWith("/student") && role !== "student") return NextResponse.redirect(new URL("/login", req.url));
    if (path.startsWith("/recruiter") && role !== "recruiter") return NextResponse.redirect(new URL("/login", req.url));
    if (path.startsWith("/officer") && role !== "officer") return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
  },
  {
    secret: process.env.AUTH_SECRET,
    callbacks: { authorized: ({ token }) => !!token }
  }
);

export const config = {
  matcher: ["/student/:path*", "/recruiter/:path*", "/officer/:path*"]
};
