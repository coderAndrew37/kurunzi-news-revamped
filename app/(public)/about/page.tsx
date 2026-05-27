// app/about/page.tsx
// About page — pure Tailwind, matches search/tag/author page shell.

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About the Archive | Kurunzi Sports',
  description:
    'Kurunzi Sports is Kenya\'s premier digital sports archive — delivering deep-dive analysis, breaking news, and historical records from the pitch to the track.',
}

const PRINCIPLES = [
  {
    title: 'Independence',
    body: 'We are not affiliated with any federation, club, or governing body. Our editorial decisions are made without commercial or political interference.',
  },
  {
    title: 'Accuracy',
    body: 'We correct errors promptly and transparently. If we get something wrong, we say so — clearly, in the same place the error appeared.',
  },
  {
    title: 'Depth',
    body: 'Breaking news matters, but so does context. We invest in long-form reporting, data journalism, and investigative work that goes beyond the scoreline.',
  },
  {
    title: 'Representation',
    body: 'We cover all sports, not just the commercially dominant ones. Kenyan athletes compete and excel across dozens of disciplines. We follow all of them.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-16">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-8 pb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-3">
            About
          </p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-red-600 rounded-sm shrink-0" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              The Archive
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-500 italic leading-relaxed">
            Kenya&apos;s premier digital sports archive. Building the record of a
            nation&apos;s sporting story, one story at a time.
          </p>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10 space-y-10 text-[17px] leading-[1.8] text-gray-600">

        <section>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">
            What We Do
          </h2>
          <p className="mb-4">
            Kurunzi Sports covers Kenyan and African sport with the depth and
            seriousness it deserves. We report on football, athletics, rugby,
            basketball, cricket, and every discipline in between — from the
            grassroots to the continental stage.
          </p>
          <p>
            We believe sport is inseparable from the broader story of Kenya.
            When Harambee Stars qualify, when a Rift Valley runner breaks a
            world record, when a young Kenyan boxer wins at the Commonwealth
            Games — these are not footnotes. They are chapters in the national
            narrative. We write those chapters.
          </p>
        </section>

        {/* Pull quote */}
        <blockquote className="border-l-4 border-red-600 pl-5 py-1">
          <p className="text-lg italic text-gray-500">
            &ldquo;Kurunzi&rdquo; means torch in Swahili. We carry the light for
            Kenyan sport.
          </p>
        </blockquote>

        <section>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-5">
            Our Principles
          </h2>
          <ul className="space-y-5 list-none pl-0">
            {PRINCIPLES.map(({ title, body }) => (
              <li key={title} className="flex gap-4">
                <div className="mt-3 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-1">
                    {title}
                  </p>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-4">
            Get in Touch
          </h2>
          <p>
            For editorial enquiries, corrections, tip-offs, or partnership
            discussions, reach our team at{' '}
            <a
              href="mailto:editorial@kurunzisports.com"
              className="text-red-600 underline hover:text-gray-900 transition-colors"
            >
              editorial@kurunzisports.com
            </a>
            . You can also find us on the{' '}
            <Link
              href="/contact"
              className="text-red-600 underline hover:text-gray-900 transition-colors"
            >
              Editorial Team
            </Link>{' '}
            page.
          </p>
        </section>

      </div>
    </main>
  )
}