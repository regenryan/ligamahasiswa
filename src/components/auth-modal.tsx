"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useActionState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { loginAction, registerAction, type AuthState } from "@/app/actions/auth";
import { CHAPTERS } from "@/lib/chapters";

type AuthModalMode = "login" | "register";

type AuthModalContextValue = {
  open: boolean;
  openModal: (mode?: AuthModalMode) => void;
  closeModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");

  const closeModal = useCallback(() => setOpen(false), []);

  const openModal = useCallback((nextMode?: AuthModalMode) => {
    if (nextMode) setMode(nextMode);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({ open, openModal, closeModal }),
    [open, openModal, closeModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        open={open}
        mode={mode}
        onModeChange={setMode}
        onClose={closeModal}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}

function FieldError({ name, state }: { name: string; state: AuthState }) {
  const msg = state?.fieldErrors?.[name];
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 text-[12px] text-brand-text">
      {msg}
    </p>
  );
}

function LoginForm({
  onSuccess,
  onSwitch,
}: {
  onSuccess: () => void;
  onSwitch: () => void;
}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    async (prev, formData) => {
      const next = await loginAction(prev, formData);
      if (!next?.error) onSuccess();
      return next;
    },
    undefined
  );

  return (
    <>
      <h2 className="display text-4xl leading-[0.9]">Log in</h2>
      <p className="mt-3 text-[14px] text-ink/60">
        Access your Liga Mahasiswa account.
      </p>

      {state?.error ? (
        <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          {state.error}
        </div>
      ) : null}

      <form action={action} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="auth-modal-login-email" className="mb-1.5 block text-[13px] font-bold">
            Email
          </label>
          <input
            id="auth-modal-login-email"
            name="email"
            type="email"
            required
            placeholder="you@campus.edu.my"
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="auth-modal-login-password" className="mb-1.5 block text-[13px] font-bold">
              Password
            </label>
            <a href="/forgot-password" className="text-[12px] font-bold text-brand hover:underline">
              Forgot password?
            </a>
          </div>
          <input
            id="auth-modal-login-password"
            name="password"
            type="password"
            required
            placeholder="Your password"
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink/50">
        No account yet?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold text-brand hover:underline"
        >
          Register
        </button>
      </p>
    </>
  );
}

function RegisterForm({
  onSuccess,
  onSwitch,
}: {
  onSuccess: () => void;
  onSwitch: () => void;
}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    async (prev, formData) => {
      const next = await registerAction(prev, formData);
      if (!next?.error) onSuccess();
      return next;
    },
    undefined
  );

  return (
    <>
      <h2 className="display text-4xl leading-[0.9]">Register</h2>
      <p className="mt-3 text-[14px] text-ink/60">
        Create your Liga Mahasiswa account. Membership is free.
      </p>

      {state?.error ? (
        <div className="mt-6 border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand-text">
          {state.error}
        </div>
      ) : null}

      <form action={action} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="auth-modal-reg-name" className="mb-1.5 block text-[13px] font-bold">
            Full name
          </label>
          <input
            id="auth-modal-reg-name"
            name="name"
            type="text"
            required
            minLength={3}
            placeholder="Nur Aisyah Binti Ahmad"
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <FieldError name="name" state={state} />
        </div>

        <div>
          <label htmlFor="auth-modal-reg-email" className="mb-1.5 block text-[13px] font-bold">
            Email
          </label>
          <input
            id="auth-modal-reg-email"
            name="email"
            type="email"
            required
            placeholder="you@campus.edu.my"
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <FieldError name="email" state={state} />
        </div>

        <div>
          <label htmlFor="auth-modal-reg-password" className="mb-1.5 block text-[13px] font-bold">
            Password
          </label>
          <input
            id="auth-modal-reg-password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <FieldError name="password" state={state} />
        </div>

        <div>
          <label htmlFor="auth-modal-reg-chapter" className="mb-1.5 block text-[13px] font-bold">
            Chapter
          </label>
          <select
            id="auth-modal-reg-chapter"
            name="chapter"
            required
            className="w-full border border-line bg-midnight px-4 py-3 text-[14px] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="">Pick your chapter...</option>
            {CHAPTERS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
          <FieldError name="chapter" state={state} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="press mt-2 w-full border border-2 border-ink bg-brand px-5 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.16em] text-paper disabled:opacity-50"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-ink/50">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold text-brand hover:underline"
        >
          Log in
        </button>
      </p>
    </>
  );
}

function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
}: {
  open: boolean;
  mode: AuthModalMode;
  onModeChange: (mode: AuthModalMode) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSuccess = useCallback(() => {
    onClose();
    router.refresh();
  }, [onClose, router]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === "login" ? "Log in" : "Register"}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md animate-in fade-in duration-200 border border-line bg-paper p-6 sm:p-8"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="mono absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-[16px] text-ink/50 hover:text-brand"
          >
            {"\u00d7"}
          </button>
          {mode === "login" ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitch={() => onModeChange("register")}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitch={() => onModeChange("login")}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
