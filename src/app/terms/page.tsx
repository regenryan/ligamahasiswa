import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";

export default function TermsPage() {
  return (
    <Shell dir={27}>
      <PageHead kicker="Legal" title="Terms of Service" />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 prose prose-ink">
          <h2>1. Introduction</h2>
          <p>By using the Liga Mahasiswa platform, you agree to these terms.</p>
          
          <h2>2. Membership</h2>
          <p>Membership is subject to verification. We reserve the right to suspend accounts that violate our community guidelines.</p>
          
          <h2>3. Purchases</h2>
          <p>All proceeds go towards the movement. Returns are only accepted for defective items.</p>
          
          <h2>4. Content</h2>
          <p>Users are responsible for the content they submit. We do not tolerate hate speech or harassment.</p>
        </div>
      </section>
    </Shell>
  );
}