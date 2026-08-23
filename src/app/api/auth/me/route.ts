import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      chapterSlug: user.chapterSlug,
      role: user.role,
      status: user.status,
      memberId: user.memberId,
      membershipExpiresAt: user.membershipExpiresAt,
    },
  });
}
