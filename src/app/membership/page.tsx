import Link from "next/link";
import { getMembershipFee, getMembershipDurationDays } from "@/lib/config";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { MembershipButton } from "./membership-button";

export const metadata = {
  title: "Keahlian | Liga Mahasiswa Malaysia",
};

export default async function MembershipPage({
  searchParams,
}: {
  params: Promise<never>;
  searchParams: Promise<{ status?: string }>;
}) {
  const [user, fee, durationDays, params] = await Promise.all([
    getCurrentUser(),
    getMembershipFee(),
    getMembershipDurationDays(),
    searchParams,
  ]);

  const isMember = user !== null && hasRole(user.role, "member") && user.status === "active";
  const isExpired = user !== null && user.status === "expired";

  return (
    <main className="min-h-screen bg-paper text-ink font-sans">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-liga-red font-display text-sm uppercase tracking-widest mb-6">
          Liga Mahasiswa Malaysia
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-tight">
          SERTAI LIGA
        </h1>
        <p className="mt-4 text-stone text-lg">
          Keahlian terbuka kepada semua mahasiswa. Bayaran anda menampung operasi dan aktiviti pergerakan.
        </p>

        {params.status === "success" && (
          <div className="mt-8 rounded-lg bg-success/10 border border-success/20 px-6 py-4 text-success">
            Pembayaran berjaya. Anda kini ahli Liga Mahasiswa Malaysia.
          </div>
        )}
        {params.status === "failed" && (
          <div className="mt-8 rounded-lg bg-alert/10 border border-alert/20 px-6 py-4 text-alert">
            Pembayaran tidak berjaya. Sila cuba lagi.
          </div>
        )}

        {isMember && (
          <div className="mt-8 rounded-lg bg-success/10 border border-success/20 px-6 py-4">
            <p className="font-semibold text-success">Anda sudah menjadi ahli</p>
            {user?.membershipExpiresAt && (
              <p className="mt-1 text-sm text-stone">
                Tempoh sah sehingga {new Date(user.membershipExpiresAt).toLocaleDateString("ms-MY")}
              </p>
            )}
          </div>
        )}

        {isExpired && (
          <div className="mt-8 rounded-lg bg-alert/10 border border-alert/20 px-6 py-4">
            <p className="font-semibold text-alert">Keahlian telah tamat tempoh</p>
            <p className="mt-1 text-sm text-stone">Sila perbaharui untuk terus menikmati hak ahli.</p>
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-mist bg-white p-8">
            <h2 className="font-display text-xl">Keahlian Biasa</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl">RM{fee}</span>
              <span className="text-sm text-stone">/ {durationDays} hari</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-stone">
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Akses penuh laman web
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Kad ahli digital
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Undang-undang tubuh
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Produk eksklusif ahli
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Pengundi PRK
              </li>
            </ul>
            <div className="mt-8">
              {!user ? (
                <div className="space-y-3">
                  <Link
                    href="/register"
                    className="block w-full rounded-lg bg-liga-red px-4 py-3 text-center font-display text-sm uppercase tracking-wider text-white hover:bg-liga-red-deep"
                  >
                    Daftar &amp; Sertai
                  </Link>
                  <p className="text-center text-xs text-stone">
                    Sudah ada akaun?{" "}
                    <Link href="/login" className="text-liga-red hover:underline">
                      Log masuk
                    </Link>
                  </p>
                </div>
              ) : isMember ? (
                <div className="rounded-lg bg-success/10 px-4 py-3 text-center text-sm text-success font-medium">
                  Anda sudah ahli
                </div>
              ) : (
                <MembershipButton />
              )}
            </div>
          </div>

          <div className="rounded-xl border border-mist bg-white p-8">
            <h2 className="font-display text-xl">Pengguna Biasa</h2>
            <p className="mt-2 text-sm text-stone">Tiada bayaran diperlukan</p>
            <ul className="mt-6 space-y-3 text-sm text-stone">
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Lihat halaman awam
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Beli dari kedai
              </li>
              <li className="flex gap-2">
                <span className="text-success">{"\u2713"}</span>
                Hantar zine
              </li>
              <li className="flex gap-2">
                <span className="text-stone/40">{"\u2717"}</span>
                <span className="text-stone/60">Kad ahli</span>
              </li>
              <li className="flex gap-2">
                <span className="text-stone/40">{"\u2717"}</span>
                <span className="text-stone/60">Undang-undang tubuh</span>
              </li>
              <li className="flex gap-2">
                <span className="text-stone/40">{"\u2717"}</span>
                <span className="text-stone/60">Produk eksklusif</span>
              </li>
            </ul>
            <div className="mt-8">
              {!user ? (
                <Link
                  href="/register"
                  className="block w-full rounded-lg border border-mist px-4 py-3 text-center text-sm font-medium text-ink hover:border-stone"
                >
                  Daftar Percuma
                </Link>
              ) : (
                <div className="rounded-lg bg-mist px-4 py-3 text-center text-sm text-stone">
                  {isMember ? "Anda sudah ahli" : "Anda sudah log masuk"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
