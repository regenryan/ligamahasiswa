import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const PROTECTED_ROUTES = ["/dashboard", "/member/edit"];
const MEMBER_ROUTES = ["/constitution"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  const isMemberOnly = MEMBER_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  if (!isProtected && !isMemberOnly) {
    return NextResponse.next();
  }

  const token = request.cookies.get("liga-session")?.value;

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isMemberOnly && token) {
    decrypt(token).then((session) => {
      if (session?.status !== "approved") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
