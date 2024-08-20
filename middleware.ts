// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

export const config = {
  matcher: "/chat/:path*", // Protect all routes under /chat
};
