import { NextRequest, NextResponse } from "next/server";
import { readSheet, writeSheet } from "@/lib/sheets-db";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { targetType, targetSlug } = (await req.json()) as {
      targetType: string;
      targetSlug: string;
    };

    if (!targetType || !targetSlug) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const existing = await readSheet("Likes", {
      user_id: session.userId,
      target_type: targetType,
      target_slug: targetSlug,
    });

    if (existing.length > 0) {
      return NextResponse.json({ ok: false, error: "Already liked" }, { status: 409 });
    }

    await writeSheet("Likes", {
      id: `like_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_id: session.userId,
      target_type: targetType,
      target_slug: targetSlug,
      created_at: new Date().toISOString(),
    });

    const allLikes = await readSheet("Likes", {
      target_type: targetType,
      target_slug: targetSlug,
    });

    return NextResponse.json({ ok: true, count: allLikes.length });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("type") ?? "";
    const targetSlug = searchParams.get("slug") ?? "";

    if (!targetType || !targetSlug) {
      return NextResponse.json({ ok: false, error: "Missing params" }, { status: 400 });
    }

    const likes = await readSheet("Likes", {
      target_type: targetType,
      target_slug: targetSlug,
    });

    return NextResponse.json({ ok: true, count: likes.length });
  } catch {
    return NextResponse.json({ ok: false, count: 0 });
  }
}
