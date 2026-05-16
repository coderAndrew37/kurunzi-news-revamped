// app/contact/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Team | Kurunzi Sports",
  description:
    "Meet the journalists and editors behind Kurunzi Sports — Kenya's premier digital sports archive.",
};

const TEAM = [
  {
    name: "Omollo Andrew",
    role: "Editor-in-Chief",
    bio: "Omollo has covered Kenyan sport for over a decade, reporting from AFCON tournaments, the Olympics, and every Kenya Premier League season since 2014. He founded Kurunzi Sports to build the archive Kenyan sport deserves.",
    email: "andrew@kurunzisports.com",
  },
  {
    name: "Editorial Desk",
    role: "News & Reporting",
    bio: "Our reporting team covers breaking news, match reports, and feature stories across all disciplines — from KPL football to national athletics championships.",
    email: "editorial@kurunzisports.com",
  },
];

const CONTACTS = [
  { label: "General enquiries", value: "info@kurunzisports.com" },
  {
    label: "Editorial tips & corrections",
    value: "editorial@kurunzisports.com",
  },
  { label: "Partnerships & advertising", value: "partners@kurunzisports.com" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--paper)" }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className="border-b"
        style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}
      >
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-14">
          <p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--accent)" }}
          >
            People
          </p>
          <h1
            className="kn-headline"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Editorial Team
          </h1>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              color: "var(--ink-soft)",
            }}
          >
            The journalists, editors, and researchers who put Kurunzi Sports
            together every day.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-12 space-y-16">
        {/* ── Team ────────────────────────────────────────────────────────── */}
        <section>
          <div className="space-y-8">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex gap-5 pb-8 border-b last:border-0"
                style={{ borderColor: "var(--rule)" }}
              >
                {/* Avatar placeholder */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-lg"
                  style={{
                    background: "var(--accent)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {member.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                      }}
                    >
                      {member.name}
                    </h2>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-ui)",
                        color: "var(--accent)",
                      }}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p
                    className="mb-3 leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9375rem",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {member.bio}
                  </p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-[11px] font-bold uppercase tracking-wider transition-colors hover:opacity-70"
                    style={{
                      fontFamily: "var(--font-ui)",
                      color: "var(--accent)",
                      textDecoration: "none",
                    }}
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact details ──────────────────────────────────────────────── */}
        <section>
          <h2
            className="mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Contact
          </h2>

          <div className="space-y-4">
            {CONTACTS.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-3 border-b"
                style={{ borderColor: "var(--rule)" }}
              >
                <span
                  className="w-full sm:w-48 flex-shrink-0 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: "var(--ink-muted)",
                  }}
                >
                  {label}
                </span>
                <a
                  href={`mailto:${value}`}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    textDecoration: "none",
                  }}
                >
                  {value}
                </a>
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-5 rounded-sm"
            style={{
              background: "var(--paper-warm)",
              border: "1px solid var(--rule)",
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2"
              style={{ fontFamily: "var(--font-ui)", color: "var(--accent)" }}
            >
              Submit a tip
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--ink-soft)",
              }}
            >
              Have a story lead, a correction, or information we should know
              about? Email our editorial desk at{" "}
              <a
                href="mailto:editorial@kurunzisports.com"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                editorial@kurunzisports.com
              </a>
              . All tip-offs are treated confidentially.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
