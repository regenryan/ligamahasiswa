import { Shell } from "@/components/shells";
import { PageHead } from "@/components/sections";

export default function PrivacyPage() {
  return (
    <Shell dir={27}>
      <PageHead kicker="Legal" title="Privacy Policy" />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 prose prose-ink">
          <h2>1. Data Collection</h2>
          <p>We collect basic information (name, email, phone) to verify membership and process shop orders.</p>
          
          <h2>2. Data Usage</h2>
          <p>Your data is used solely for platform functionality. We do not sell your data to third parties.</p>
          
          <h2>3. Cookies</h2>
          <p>We use essential cookies to maintain your login session.</p>
          
          <h2>4. Data Deletion</h2>
          <p>You can delete your account at any time from your dashboard settings. This will anonymize your personal information.</p>
        </div>
      </section>
    </Shell>
  );
}