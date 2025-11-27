


import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(43,118,255,0.35),transparent_55%)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.25),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-5 py-10 md:px-8 md:py-12">
        <Navbar />

        <section className="grid gap-10 rounded-[32px] border border-white/5 bg-white/5 p-8 text-center shadow-[0_30px_120px_rgba(15,23,42,0.45)] backdrop-blur-xl md:p-14">
          <p className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Collaborate live
          </p>
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              Make ideas tangible with{" "}
              <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                Exaclidraw
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/70 md:text-xl">
              Sketch concepts, host live workshops, and ship faster with a
              multiplayer canvas that feels as fluid as a real whiteboard.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link
              href="/room/new"
              className="group inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 px-6 py-3 text-lg font-semibold text-white shadow-[0_15px_45px_rgba(99,102,241,0.35)] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Launch workspace
              <span className="text-2xl transition group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-lg font-semibold text-white/80 hover:text-white"
            >
              See how it works
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
