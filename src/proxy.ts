import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/member/edit"];
const MEMBER_ROUTES = ["/constitution"];

const ROLE_LEVELS: Record<string, number> = {
  user: 0, member: 1, committee: 2, national: 3, admin: 4,
};

function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function hasRoleMin(role: string, min: string): boolean {
  return (ROLE_LEVELS[role] ?? 0) >= (ROLE_LEVELS[min] ?? 0);
}

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

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isMemberOnly) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeToken(token);
    if (!payload || !hasRoleMin(String(payload.role ?? ""), "member")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
