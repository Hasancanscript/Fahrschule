import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { mutationRequestError } from "@/lib/security";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/")) {
    // Auth.js endpoints perform their own CSRF checks and accept form submissions.
    if (!pathname.startsWith("/api/auth/")) {
      const failure = mutationRequestError(req);
      if (failure) return NextResponse.json({ error: failure.error }, { status: failure.status });
    }
    return NextResponse.next();
  }
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === "ADMIN";

  if (pathname.startsWith("/admin") && !isAdmin) {
    const url = isLoggedIn ? "/" : "/login";
    return NextResponse.redirect(new URL(url, req.url));
  }

  if (pathname.startsWith("/booking") && !isLoggedIn) {
    const login = new URL("/login", req.url);
    login.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(login);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/booking/:path*", "/api/:path*"],
};
