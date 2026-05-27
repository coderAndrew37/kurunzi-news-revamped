// app/contact/page.tsx
// Editorial team + contact details — pure Tailwind, matches site palette.

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial Team | Kurunzi Sports',
  description:
    'Meet the journalists and editors behind Kurunzi Sports — Kenya\'s premier digital sports archive.',
}

const TEAM = [
  {
    name: 'Omollo Andrew',
    role: 'Editor-in-Chief',
    bio: 'Omollo has covered Kenyan sport for over a decade, reporting from AFCON tournaments, the Olympics, and every Kenya Premier League season since 2014. He founded Kurunzi Sports to build the archive Kenyan sport deserves.',
    email: 'andrew@kurunzisports.com',
  },
  {
    name: 'Editorial Desk',
    role: 'News & Reporting',
    bio: 'Our reporting team covers breaking news, match reports, and feature stories across all disciplines — from KPL football to national athletics championships.',
    email: 'editorial@kurunzisports.com',
  },
]

const CONTACTS = [
  { label: 'General enquiries', email: 'info@kurunzisports.com' },
  { label: 'Editorial tips & corrections', email: 'editorial@kurunzisports.com' },
  { label: 'Partnerships & advertising', email: 'partners@kurunzisports.com' },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8 pb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-3">
            People
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-red-600 rounded-sm shrink-0" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Editorial Team
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-500 italic leading-relaxed">
            The journalists, editors, and researchers who put Kurunzi Sports
            together every day.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10 space-y-14">

        {/* ── Team ──────────────────────────────────────────────────────── */}
        <section>
          <div className="rounded-lg shadow-sm border border-gray-100 bg-white divide-y divide-gray-100">
            {TEAM.map((member) => (
              <div key={member.name} className="flex gap-5 px-5 sm:px-6 py-6">
                {/* Avatar */}
                <div
                  className="shrink-0 w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg"
                  aria-hidden="true"
                >
                  {member.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                    <h2 className="text-base font-bold text-gray-900">
                      {member.name}
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-[11px] font-bold uppercase tracking-wider text-red-600 hover:text-gray-900 transition-colors"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact details ───────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">
            Contact
          </h2>

          <div className="rounded-lg shadow-sm border border-gray-100 bg-white divide-y divide-gray-100">
            {CONTACTS.map(({ label, email }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 sm:px-6 py-4"
              >
                <span className="sm:w-52 shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {label}
                </span>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-semibold text-red-600 hover:text-gray-900 transition-colors"
                >
                  {email}
                </a>
              </div>
            ))}
          </div>

          {/* Tip box */}
          <div className="mt-6 bg-white rounded-lg border border-gray-100 shadow-sm px-5 sm:px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">
              Submit a tip
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Have a story lead, a correction, or information we should know
              about? Email our editorial desk at{' '}
              <a
                href="mailto:editorial@kurunzisports.com"
                className="text-red-600 underline hover:text-gray-900 transition-colors"
              >
                editorial@kurunzisports.com
              </a>
              . All tip-offs are treated confidentially.
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}