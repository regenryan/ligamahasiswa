import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { nomination, nominationNote, user } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { NominationDetailClient } from "./client";

export default async function NominationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "committee")) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Access denied" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <Link href="/dashboard" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-paper">Back to dashboard</Link>
          </div>
        </section>
      </Shell>
    );
  }

  const noms = await db.select().from(nomination).where(eq(nomination.nominationId, id));
  const nom = noms[0];

  if (!nom) {
    return (
      <Shell dir={27}>
        <PageHead kicker="Admin" title="Nomination not found" />
      </Shell>
    );
  }

  const notesRaw = await db
    .select({
      noteId: nominationNote.noteId,
      comment: nominationNote.comment,
      verdict: nominationNote.verdict,
      contactStatus: nominationNote.contactStatus,
      createdAt: nominationNote.createdAt,
      authorName: user.name,
    })
    .from(nominationNote)
    .leftJoin(user, eq(nominationNote.userId, user.userId))
    .where(eq(nominationNote.nominationId, id))
    .orderBy(desc(nominationNote.createdAt));

  const notes = notesRaw.map(n => ({
    id: n.noteId,
    comment: n.comment ?? "",
    verdict: n.verdict,
    contactStatus: n.contactStatus,
    createdAt: n.createdAt ? String(n.createdAt) : "",
    authorName: n.authorName ?? "Unknown",
  }));

  const nominationData = {
    id: nom.nominationId,
    name: nom.name,
    email: nom.email ?? "",
    phone: nom.phone ?? "",
    chapter: nom.chapterId ?? "",
    status: nom.status ?? "pending",
    justification: nom.justification ?? "",
    createdAt: nom.createdAt ? String(nom.createdAt) : "",
  };

  return <NominationDetailClient nomination={nominationData} notes={notes} />;
}