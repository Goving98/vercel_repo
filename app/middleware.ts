import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin"; // Redirect to the sign-in page
    return NextResponse.redirect(url);
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next(); // Continue if valid
  } catch (err) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url); // Redirect if invalid token
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard", "/tasks/:path*"], // Protect these routes
};
