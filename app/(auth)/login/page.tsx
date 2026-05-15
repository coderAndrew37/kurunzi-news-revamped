// app/(auth)/login/page.tsx
// Dark login page. Google OAuth is the primary CTA (Vercel-style white button).
// Email/password is secondary, separated by a divider.
// Adjust the Google OAuth href to your NextAuth or Auth.js signIn URL.

import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In — Kurunzi Sports',
  description: 'Sign in to your Kurunzi Sports account.',
  robots: { index: false },
}

// ─── Google wordmark SVG (inline, no external request) ───────────────────────

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-[380px]">

        {/* ── Wordmark ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-[#dc2626] rounded-md flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" aria-hidden />
          </div>
          <span className="font-['Barlow_Condensed'] font-black text-white text-base uppercase tracking-tight">
            KURUNZI<span className="text-[#dc2626]"> SPORTS</span>
          </span>
        </div>

        {/* ── Card ──────────────────────────────────────────────────────────── */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-8">

          <h1 className="font-['Playfair_Display'] font-black text-white text-2xl tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-white/40 text-sm font-['Source_Serif_4'] mb-7">
            Sign in to your account to continue
          </p>

          {/* ── Google — primary CTA ─────────────────────────────────────── */}
          {/*
            With NextAuth: href="/api/auth/signin/google"
            With Auth.js:  href="/api/auth/signin?provider=google"
            Replace the href below to match your auth setup.
          */}
          <a
            href="/api/auth/signin/google"
            className={[
              "w-full flex items-center justify-center gap-2.5",
              "h-10 px-4 rounded-lg",
              "bg-white hover:bg-gray-100 active:bg-gray-200",
              "font-['Barlow_Condensed'] font-bold text-sm text-[#0a0a0a] tracking-wide uppercase",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
            ].join(' ')}
          >
            <GoogleIcon className="w-[18px] h-[18px] shrink-0" />
            Continue with Google
          </a>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/25 text-xs font-['Barlow_Condensed'] uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ── Email / password form ─────────────────────────────────────── */}
          <form method="POST" action="/api/auth/callback/credentials">
            <div className="mb-3.5">
              <label
                htmlFor="email"
                className="block text-xs text-white/45 mb-1.5 font-['Barlow_Condensed'] uppercase tracking-widest"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className={[
                  "w-full h-[38px] px-3",
                  "bg-[#1a1a1a] border border-white/12 rounded-lg",
                  "text-white text-sm font-['Source_Serif_4'] placeholder:text-white/20",
                  "focus:outline-none focus:border-white/35",
                  "transition-colors duration-150",
                ].join(' ')}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="password"
                className="block text-xs text-white/45 mb-1.5 font-['Barlow_Condensed'] uppercase tracking-widest"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className={[
                  "w-full h-[38px] px-3",
                  "bg-[#1a1a1a] border border-white/12 rounded-lg",
                  "text-white text-sm placeholder:text-white/20",
                  "focus:outline-none focus:border-white/35",
                  "transition-colors duration-150",
                ].join(' ')}
              />
            </div>

            <div className="flex justify-end mb-5">
              <Link
                href="/forgot-password"
                className="text-xs text-white/30 hover:text-white/55 transition-colors font-['Barlow_Condensed']"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={[
                "w-full h-[38px] rounded-lg",
                "bg-white hover:bg-gray-100 active:bg-gray-200",
                "font-['Barlow_Condensed'] font-bold text-sm text-[#0a0a0a] uppercase tracking-wide",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              ].join(' ')}
            >
              Sign in
            </button>
          </form>

          {/* ── Footer links ─────────────────────────────────────────────── */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-xs text-white/25 font-['Barlow_Condensed']">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-white/45 hover:text-white/70 transition-colors underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>
            <p className="text-xs text-white/20 font-['Barlow_Condensed']">
              <Link href="/terms" className="hover:text-white/40 transition-colors">
                Terms
              </Link>
              <span className="mx-1.5">·</span>
              <Link href="/privacy" className="hover:text-white/40 transition-colors">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}