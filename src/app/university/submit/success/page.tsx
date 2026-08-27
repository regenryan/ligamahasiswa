import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";

export default function SubmitSuccessPage() {
  return (
    <Shell dir={27}>
      <PageHead kicker="Universities" title="Submission Received" />
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
          <p className="text-[15px] leading-relaxed text-ink/70">
            Thank you for submitting a new university. Our national committee will review the submission. 
            Once approved, a new chapter will be automatically created.
          </p>
          <div className="mt-8 flex justify-center">
            <Btn kind="ghost" href="/dashboard">Back to Dashboard</Btn>
          </div>
        </div>
      </section>
    </Shell>
  );
}