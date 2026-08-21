import Link from "next/link";
import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";
import { requireAuth } from "@/lib/auth";

const DIR = 27;

const LINKS = [
  { href: "/dashboard/card", label: "Member card", desc: "Your Liga ID card with QR code" },
  { href: "/dashboard/orders", label: "Order history", desc: "All your shop purchases" },
  { href: "/dashboard/committee", label: "Committee", desc: "Manage your chapter committee" },
  { href: "/constitution", label: "Constitution", desc: "Read the Liga constitution (members only)" },
  { href: "/zine/submit", label: "Submit to zine", desc: "Contribute an article or artwork" },
];

export default async function DashboardPage() {
  const user = await requireAuth();

  if (!user) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Dashboard" title="Login required" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="text-[15px] text-ink/60">Please log in to access your dashboard.</p>
            <Link
              href="/login"
              className="press mt-6 inline-block border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-white"
            >
              Log in
            </Link>
          </div>
        </section>
      </Shell>
    );
  }

  return (
    <Shell dir={DIR}>
      <PageHead
        kicker="Dashboard"
        title={`Hey, ${user.name}`}
        sub={`You are logged in as ${user.chapterSlug} chapter.`}
      />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
          <div className="grid gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between border border-line bg-cream px-5 py-4 hover:border-brand hover:bg-brand/5 transition-colors"
              >
                <div>
                  <p className="text-[15px] font-bold">{link.label}</p>
                  <p className="mono text-[12px] text-ink/50">{link.desc}</p>
                </div>
                <span className="mono text-[12px] text-ink/30 group-hover:text-brand transition-colors">
                  {"\u2192"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
