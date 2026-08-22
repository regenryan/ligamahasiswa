import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { requireAuth } from "@/lib/auth";
import { readSheet } from "@/lib/sheets-db";
import { ProfileForm } from "./profile-form";

const DIR = 27;

export default async function DashboardPage() {
  const user = await requireAuth();

  if (!user) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Dashboard" title="Login required" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Please log in to access your dashboard.</p>
            <Link href="/login" className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Log in
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  const isAdmin = user.role === "admin";
  const isCommittee = user.role === "committee" || isAdmin;

  const [rsvps, prkNominations] = await Promise.all([
    readSheet("RSVPs", { user_id: user.id }).catch(() => []),
    readSheet("PRK_Nominations", { user_id: user.id }).catch(() => []),
  ]);

  const goingRsvps = rsvps.filter((r) => r.status === "going");
  const myNomination = prkNominations.length > 0 ? prkNominations[0] : null;

  const links = [
    { href: "/dashboard/card", label: "Member card", desc: "Your Liga ID card with QR code" },
    { href: "/dashboard/orders", label: "Order history", desc: "All your shop purchases" },
    { href: "/constitution", label: "Constitution", desc: "Read the Liga constitution (members only)" },
    { href: "/zine/submit", label: "Submit to zine", desc: "Contribute an article or artwork" },
    ...(isCommittee ? [{ href: "/dashboard/committee", label: "Committee", desc: "Manage your chapter committee" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin panel", desc: "Manage users, orders, and content" }] : []),
  ];

  const statusSkin =
    user.status === "approved" ? "border-term/40 bg-term/10 text-term" :
    user.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
    "border-ink/20 bg-ink/5 text-ink/60";
  const statusLabel =
    user.status === "approved" ? "Verified member" :
    user.status === "rejected" ? "Application rejected" : "Pending verification";

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Dashboard" title={`Hey, ${user.name}`} sub={`You are logged in as ${user.chapterSlug} chapter.`} />

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex border px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] ${statusSkin}`}>
              {statusLabel}
            </span>
            {user.memberId ? (
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink/40">
                ID: {user.memberId}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <div className="grid gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors">
                <div>
                  <p className="text-[15px] font-bold">{link.label}</p>
                  <p className="mono text-[12px] text-ink/50">{link.desc}</p>
                </div>
                <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">{"\u2192"}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {goingRsvps.length > 0 ? (
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="display text-2xl">My RSVPs</h2>
            <div className="mt-6 space-y-3">
              {goingRsvps.map((r) => (
                <Link key={r.id} href={`/events/${r.event_slug}`} className="block border border-line bg-cream px-5 py-4 hover:border-brand transition-colors">
                  <p className="text-[14px] font-bold">{r.event_slug}</p>
                  <p className="mono text-[12px] text-ink/50">Going</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="display text-2xl">PRK status</h2>
          {myNomination ? (
            <div className="mt-4 border border-line bg-cream px-5 py-4">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-bold">{myNomination.position}</p>
                <span className={`inline-flex border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] ${
                  myNomination.status === "approved" ? "border-term/40 bg-term/10 text-term" :
                  myNomination.status === "rejected" ? "border-brand/40 bg-brand/10 text-brand-text" :
                  "border-ink/20 bg-ink/5 text-ink/60"
                }`}>{myNomination.status}</span>
              </div>
              <p className="mt-1 text-[13px] text-ink/60">{myNomination.platform}</p>
            </div>
          ) : (
            <div className="mt-4 border border-dashed border-line p-6 text-center">
              <p className="text-[14px] text-ink/60">You have not been nominated yet.</p>
              <Link href="/prk" className="press mt-4 inline-flex border border-line px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink hover:border-ink hover:text-brand transition-colors">
                Nominate yourself
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="display text-2xl">Edit profile</h2>
          <p className="mt-2 text-[14px] text-ink/60">Update your name, chapter, and phone number.</p>
          <div className="mt-6 max-w-md">
            <ProfileForm name={user.name} chapterSlug={user.chapterSlug} phone={user.phone} />
          </div>
        </div>
      </section>

      {user.status !== "approved" ? (
        <section className="border-b border-line bg-midnight">
          <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="display text-2xl text-fog">Become a verified member</h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-fog/60">
              Verified members get a digital card, member pricing, and access to the constitution. Verification takes a few days.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="press inline-flex border border-2 border-fog bg-fog/10 px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fog hover:bg-fog/20 transition-colors">
                Apply to join
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
