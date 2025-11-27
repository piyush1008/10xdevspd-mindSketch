"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { signIn, signOut, useSession } from "next-auth/react";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/room/demo", label: "Live Rooms" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="relative z-20 w-full">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-3xl border border-white/10 bg-white/70 px-6 py-4 shadow-2xl shadow-indigo-900/10 backdrop-blur-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/50">
            <span className="text-xl font-bold">EX</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Exaclidraw
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {baseLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <span
                  className={`inline-flex rounded-full px-4 py-2 ${
                    isActive
                      ? "bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30"
                      : ""
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!session.data?.user && (
            <button
            onClick={()=> signIn()}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-white/20 dark:text-white"
            >
              Sign in
            </button>
          )}

        {session.data?.user && (
            <button
              onClick={()=> signOut()}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-white/20 dark:text-white"
            >
              Logout
            </button>
          )}
          <Link
            href="/room/new"
            className="group relative inline-flex overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="absolute inset-0 rounded-full bg-slate-900 transition duration-300 group-hover:opacity-0 dark:bg-white" />
            <span className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-0 transition duration-300 group-hover:opacity-100" />
            <span className="relative z-10 inline-flex items-center gap-2 text-white dark:text-slate-900">
              Start drawing
              <span className="text-lg">→</span>
            </span>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="relative z-30 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 transition hover:shadow-lg dark:border-white/20 dark:bg-slate-800 dark:text-white md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle Menu</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 rounded-full bg-current transition ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <div
        className={`absolute inset-x-0 top-full mt-3 origin-top rounded-3xl border border-white/10 bg-white/90 p-6 shadow-2xl shadow-indigo-900/10 backdrop-blur-xl transition-all duration-200 md:hidden ${
          isMenuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
          <div className="space-y-4">
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              {link.label}
              <span className="text-slate-400">↗</span>
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-1">
            <Link
              href="/signup"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-base font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/20 dark:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/room/new"
              className="rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-400 px-4 py-3 text-center text-base font-semibold text-white shadow-lg shadow-indigo-500/30"
            >
              Start drawing
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

