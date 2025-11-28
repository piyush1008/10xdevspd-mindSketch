


import Link from "next/link";

export default function SignupComponent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(43,118,255,0.35),transparent_55%)]" />
        <div className="absolute inset-y-0 left-1/4 w-1/2 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.25),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-[160px]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-5 py-12 md:px-8">
        <div className="w-full max-w-xl space-y-10 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_120px_rgba(15,23,42,0.55)] backdrop-blur-2xl md:p-12">
          <div className="text-center">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Join Exaclidraw
            </p>
            <h1 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Create an account to sketch together
            </h1>
            <p className="mt-3 text-base text-white/70">
              Unlock multiplayer whiteboards, synced canvases, and live workshops for your team.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="name">
                Full name
              </label>
              <div className="rounded-2xl border border-white/10 bg-slate-900/20 px-4 py-3 transition focus-within:border-white/30 focus-within:bg-slate-900/40">
                <input
                  id="name"
                  type="text"
                  placeholder="Avery Lee"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80" htmlFor="email">
                Email
              </label>
              <div className="rounded-2xl border border-white/10 bg-slate-900/20 px-4 py-3 transition focus-within:border-white/30 focus-within:bg-slate-900/40">
                <input
                  id="email"
                  type="email"
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
                  placeholder="••••••••••"
                  className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus-visible:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 px-6 py-3 text-lg font-semibold text-white shadow-[0_20px_60px_rgba(99,102,241,0.45)] transition hover:shadow-[0_25px_70px_rgba(99,102,241,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Create account
              <span className="text-2xl transition group-hover:translate-x-1">→</span>
            </button>
          </form>

          {/* <div className="grid gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/70 md:grid-cols-2">
            {[
              "Live cursors & voice rooms",
              "Secure team spaces",
              "Version history snapshots",
              "Template library access",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-300" />
                {item}
              </div>
            ))}
          </div> */}

          <p className="text-center text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/api/auth/signin" className="text-cyan-300 underline-offset-4 hover:text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}