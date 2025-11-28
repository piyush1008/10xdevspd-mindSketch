"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SigninComponent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading("credentials");

    const result = await signIn("credentials", {
      username: email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Unable to sign in with those credentials. Please try again.");
      setLoading(null);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleProviderLogin = async (provider: "github" | "google") => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  const disablePrimary = loading === "credentials" || !email || !password;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(43,118,255,0.35),transparent_55%)]" />
        <div className="absolute inset-y-0 right-1/4 w-1/2 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.25),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-[160px]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-5 py-12 md:px-8">
        <div className="w-full max-w-lg space-y-10 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl md:p-12">
          <div className="text-center space-y-4">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Sign in to keep sketching
            </h1>
            <p className="text-base text-white/70">
              Jump back into your collaborative canvas and pick up right where you left off.
            </p>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="email">
                Email
              </label>
              <div className="rounded-2xl border border-white/10 bg-slate-900/20 px-4 py-3 transition focus-within:border-white/30 focus-within:bg-slate-900/40">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="password">
                Password
              </label>
              <div className="rounded-2xl border border-white/10 bg-slate-900/20 px-4 py-3 transition focus-within:border-white/30 focus-within:bg-slate-900/40">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus-visible:outline-none"
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="status">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={disablePrimary}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 px-6 py-3 text-lg font-semibold text-white shadow-[0_20px_60px_rgba(99,102,241,0.45)] transition hover:shadow-[0_25px_70px_rgba(99,102,241,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "credentials" ? "Signing in..." : "Sign in"}
              <span className="text-2xl transition group-hover:translate-x-1">→</span>
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/50">
              <span className="h-px flex-1 bg-white/20" />
              Or continue with
              <span className="h-px flex-1 bg-white/20" />
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={() => handleProviderLogin("github")}
                disabled={loading === "github"}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "github" ? "Connecting..." : "Github"}
              </button>
              <button
                type="button"
                onClick={() => handleProviderLogin("google")}
                disabled={loading === "google"}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "google" ? "Connecting..." : "Google"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}