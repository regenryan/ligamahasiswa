"use client";

import { Suspense, useState } from "react";
import { Shell } from "@/components/shells";
import { PageHead, Btn } from "@/components/sections";
import { Reveal } from "@/components/interactive";
import { submitContact } from "@/lib/sheets";
import { SkeletonGrid } from "@/components/skeleton";

const DIR = 27;

function ContactInner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (!subject.trim()) next.subject = "Enter a subject.";
    if (message.trim().length < 10) next.message = "Write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    const res = await submitContact({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setSending(false);

    if (res.ok) {
      setDone(true);
    } else {
      setErrors({ submit: res.error ?? "Submission failed. Try again." });
    }
  };

  if (done) {
    return (
      <Shell dir={DIR}>
        <PageHead kicker="Contact" title="Message sent" />
        <section className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
            <p className="mono text-[11px] uppercase tracking-[0.2em] text-term">Confirmed</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">We got your message</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/70">
              Thank you, {name.split(" ")[0]}. We will get back to you as soon as we can.
            </p>
            <div className="mt-8">
              <Btn kind="act" href="/">Back to home</Btn>
            </div>
          </div>
        </section>
      </Shell>
    );
  }

  const field = (key: string) =>
    errors[key] ? (
      <p role="alert" className="mt-1.5 text-[12px] text-brand-text">{errors[key]}</p>
    ) : null;

  return (
    <Shell dir={DIR}>
      <PageHead kicker="Contact" title="Get in touch" sub="Questions, proposals, or just want to say hello. We read every message." />
      <section className="border-b border-line">
        <div className="mx-auto grid w-full max-w-4xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <form
              className="space-y-4"
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              noValidate
            >
              <div>
                <label htmlFor="ct-name" className="mb-1.5 block text-[13px] font-bold">Name</label>
                <input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} disabled={sending} className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none ${errors.name ? "border-brand" : "border-line"}`} />
                {field("name")}
              </div>
              <div>
                <label htmlFor="ct-email" className="mb-1.5 block text-[13px] font-bold">Email</label>
                <input id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={sending} className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none ${errors.email ? "border-brand" : "border-line"}`} />
                {field("email")}
              </div>
              <div>
                <label htmlFor="ct-subject" className="mb-1.5 block text-[13px] font-bold">Subject</label>
                <input id="ct-subject" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={sending} className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none ${errors.subject ? "border-brand" : "border-line"}`} />
                {field("subject")}
              </div>
              <div>
                <label htmlFor="ct-message" className="mb-1.5 block text-[13px] font-bold">Message</label>
                <textarea id="ct-message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} disabled={sending} className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none ${errors.message ? "border-brand" : "border-line"}`} />
                {field("message")}
              </div>
              {errors.submit && <p role="alert" className="text-[12px] text-brand-text">{errors.submit}</p>}
              <button type="submit" disabled={sending} className="press w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50">
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-8">
              <div>
                <h3 className="display text-xl">Email</h3>
                <p className="mt-2 text-[14px] text-ink/70">contact@ligamahasiswa.my</p>
                <p className="text-[14px] text-ink/70">admin@ligamahasiswa.my</p>
              </div>
              <div>
                <h3 className="display text-xl">Social</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { name: "Instagram", href: "https://instagram.com/ligamahasiswa" },
                    { name: "TikTok", href: "https://tiktok.com/@ligamahasiswa" },
                    { name: "YouTube", href: "https://youtube.com/@ligamahasiswa" },
                  ].map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="border border-line px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-ink/60 hover:border-ink hover:text-ink">
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="display text-xl">Press</h3>
                <p className="mt-2 text-[14px] text-ink/70">media@ligamahasiswa.my</p>
                <p className="text-[13px] text-ink/50">For interview requests and media inquiries.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <ContactInner />
    </Suspense>
  );
}
