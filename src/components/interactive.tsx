"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  startTransition,
  type ReactNode,
} from "react";
import { submitJoinForm, submitNewsletter } from "@/lib/sheets";
import type { Product } from "@/lib/mock";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      data-reveal={shown ? "shown" : undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

type CartItem = Product;

type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartCtx | null>(null);

const CART_KEY = "liga-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setItems(loadCart());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add: (p) =>
        setItems((prev) =>
          prev.some((x) => x.slug === p.slug) ? prev : [...prev, p],
        ),
      remove: (slug) =>
        setItems((prev) => prev.filter((x) => x.slug !== slug)),
      clear: () => setItems([]),
      open,
      setOpen,
    }),
    [items, open],
  );
  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function LikeButton({
  initial,
  label = "Likes",
  targetType = "",
  targetSlug = "",
}: {
  initial: number;
  label?: string;
  targetType?: string;
  targetSlug?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initial);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (loading) return;
    if (!targetType || !targetSlug) {
      setLiked((v) => {
        setCount((c) => c + (v ? -1 : 1));
        return !v;
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetSlug }),
      });
      const data = await res.json();
      if (data.ok) {
        setLiked(true);
        setCount(data.count ?? count + 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={toggle}
      disabled={loading}
      className={`press inline-flex items-center gap-2 border px-3 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-colors ${
        liked
          ? "border-brand bg-brand/10 text-brand-text"
          : "border-line text-ink/60 hover:border-ink hover:text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`transition-transform duration-200 ${liked ? "scale-110" : ""}`}
      >
        {liked ? "\u2764" : "\u2661"}
      </span>
      <span className="transition-transform duration-200">{count}</span>
      <span className="hidden text-ink/40 sm:inline">{label}</span>
    </button>
  );
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label = "Filter",
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`press border px-3 py-2 text-[12px] font-bold uppercase tracking-[0.1em] transition-colors ${
            value === opt
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink/60 hover:border-ink hover:text-ink"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Tabs({
  tabs,
  labels,
}: {
  tabs: ReactNode[];
  labels: string[];
}) {
  const [active, setActive] = useState(0);
  const highlightRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const moveHighlight = useCallback(() => {
    const el = itemsRef.current[active];
    const h = highlightRef.current;
    if (!el || !h) return;
    h.style.width = `${el.offsetWidth}px`;
    h.style.transform = `translateX(${el.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(() => {
    moveHighlight();
  }, [moveHighlight]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Page sections"
        className="relative flex flex-wrap gap-1 border-b border-line"
      >
        <div className="tab-highlight" ref={highlightRef} aria-hidden="true" />
        {labels.map((l, i) => (
          <button
            key={l}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`press z-10 px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.1em] transition-colors ${
              active === i ? "text-brand-text" : "text-ink/50 hover:text-ink"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-6">
        {tabs[active]}
      </div>
    </div>
  );
}

export function Accordion({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.title}
            className={i > 0 ? "border-t border-line" : ""}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[14px] font-bold">{item.title}</span>
              <span
                aria-hidden="true"
                className={`text-[13px] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[14px] leading-relaxed text-ink/70">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const id = useId();

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSending(true);
    const res = await submitNewsletter(email);
    setSending(false);
    if (res.ok) {
      setDone(true);
    } else {
      setError(res.error ?? "Something went wrong. Try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {done ? (
        <p className="mono border border-term/50 bg-term/10 px-4 py-3 text-[13px] text-term">
          You are on the list. Spread the word.
        </p>
      ) : (
        <form
          className="flex w-full flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          noValidate
        >
          <label className="sr-only" htmlFor={id}>
            Email address
          </label>
          <input
            id={id}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@campus.edu.my"
            disabled={sending}
            aria-invalid={error ? true : undefined}
            className={`w-full border bg-paper px-4 py-3 text-[14px] text-ink placeholder:text-ink/35 focus:outline-none ${
              error ? "border-brand" : "border-line"
            }`}
          />
          <button
            type="submit"
            disabled={sending}
            className="press shrink-0 border border-2 border-ink bg-brand px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          >
            {sending ? "Sending..." : "On the list"}
          </button>
        </form>
      )}
      {error ? (
        <p role="alert" className="mono mt-2 text-[12px] text-brand-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const CAMPUSES = [
  "Malaysia (national)",
  "UM",
  "UTM",
  "USM",
  "UniSZA",
  "SPARC UTeM",
];

export function JoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 3) next.name = "Tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!campus) next.campus = "Pick your chapter.";
    if (!agree) next.agree = "Tick the box to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    const res = await submitJoinForm({
      name: name.trim(),
      email: email.trim(),
      chapter: campus,
      agreed: agree,
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
      <div className="border border-line bg-paper p-6">
        <p className="display text-2xl text-brand-text">
          Welcome, {name.split(" ")[0]}.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink/70">
          Your application is in. Your digital member card is issued instantly -
          your chapter committee verifies it within days.
        </p>
        <div className="mt-6 border border-dashed border-brand/60 bg-brand/10 p-5">
          <p className="mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
            Digital member card / pending verification
          </p>
          <p className="mt-2 text-lg font-bold">{name}</p>
          <p className="text-[13px] text-ink/60">{campus} chapter</p>
          <p className="mono mt-3 text-[11px] uppercase tracking-[0.16em] text-brand-text">
            Card issued - check your email
          </p>
        </div>
        <a
          href="/dashboard/card"
          className="press mt-6 inline-flex border border-ink bg-ink px-5 py-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-paper hover:bg-brand hover:text-white"
        >
          Preview the member card
        </a>
      </div>
    );
  }

  const field = (key: string) =>
    errors[key] ? (
      <p role="alert" className="mt-1.5 text-[12px] text-brand-text">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form
      className="border border-line bg-paper p-6"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      noValidate
    >
      <p className="mono mb-5 text-[11px] uppercase tracking-[0.2em] text-ink/50">
        Register in 2 minutes
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="join-name" className="mb-1.5 block text-[13px] font-bold">
            Full name
          </label>
          <input
            id="join-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nur Aisyah Binti Ahmad"
            disabled={sending}
            aria-invalid={errors.name ? true : undefined}
            className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none ${
              errors.name ? "border-brand" : "border-line"
            }`}
          />
          {field("name")}
        </div>
        <div>
          <label
            htmlFor="join-email"
            className="mb-1.5 block text-[13px] font-bold"
          >
            Email
          </label>
          <input
            id="join-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@campus.edu.my"
            disabled={sending}
            aria-invalid={errors.email ? true : undefined}
            className={`w-full border bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/35 focus:outline-none ${
              errors.email ? "border-brand" : "border-line"
            }`}
          />
          {field("email")}
        </div>
        <div>
          <label
            htmlFor="join-campus"
            className="mb-1.5 block text-[13px] font-bold"
          >
            Chapter
          </label>
          <select
            id="join-campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            disabled={sending}
            aria-invalid={errors.campus ? true : undefined}
            className={`w-full border bg-midnight px-4 py-3 text-[14px] focus:outline-none ${
              errors.campus ? "border-brand" : "border-line"
            }`}
          >
            <option value="">Pick your chapter...</option>
            {CAMPUSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {field("campus")}
        </div>
        <div>
          <label className="flex items-start gap-3 text-[13px] leading-relaxed text-ink/75">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              disabled={sending}
              className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]"
            />
            <span>
              I want to receive campaign updates and assembly notices. I am a
              current or former student of a Malaysian university or college.
            </span>
          </label>
          {field("agree")}
        </div>
        {errors.submit ? (
          <p role="alert" className="text-[12px] text-brand-text">
            {errors.submit}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="press mt-6 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-white disabled:opacity-50"
      >
        {sending ? "Sending..." : "Join the movement"}
      </button>
    </form>
  );
}

export function DotPattern({
  width = 16,
  height = 16,
  cx = 1,
  cy = 1,
  cr = 1,
  className = "",
}: {
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full fill-current ${className}`}
    >
      <defs>
        <pattern
          id="dot-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#dot-pattern)" />
    </svg>
  );
}

export function CornerFrame({
  children,
  className = "",
  accentColor = "bg-brand",
}: {
  children: ReactNode;
  className?: string;
  accentColor?: string;
}) {
  return (
    <div className={`relative border border-line p-6 md:p-8 ${className}`}>
      <div className={`absolute -left-1.5 -top-1.5 h-3 w-3 ${accentColor}`} />
      <div className={`absolute -bottom-1.5 -left-1.5 h-3 w-3 ${accentColor}`} />
      <div className={`absolute -right-1.5 -top-1.5 h-3 w-3 ${accentColor}`} />
      <div className={`absolute -bottom-1.5 -right-1.5 h-3 w-3 ${accentColor}`} />
      {children}
    </div>
  );
}

export function StatusPing({
  label,
  color = "bg-emerald-500",
}: {
  label: string;
  color?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
        />
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${color}`}
        />
      </span>
      <span>{label}</span>
    </div>
  );
}

export function KineticCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let width = (canvas.width =
      canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height =
      canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.7 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

export function StarfieldCanvas({
  className = "",
  accent = "#00f0ff",
  density = 220,
  twinkle = true,
}: {
  className?: string;
  accent?: string;
  density?: number;
  twinkle?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let width = (canvas.width =
      canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height =
      canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    const stars = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const t = performance.now() * 0.001;
      stars.forEach((s) => {
        if (!reduce) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }
        const tw = twinkle
          ? 0.4 +
            0.6 *
              Math.abs(Math.sin(t * s.speed * 10 + s.phase))
          : 0.9;
        ctx.fillStyle = accent;
        ctx.globalAlpha = tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [accent, density, twinkle]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

export function ShutterText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {text.split("").map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
          style={{
            transform: shown ? "translateY(0)" : "translateY(110%)",
            transitionDelay: `${delay + i * 45}ms`,
            willChange: "transform",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}

export function WobbleReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setShown(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      data-reveal={shown ? "shown" : undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
