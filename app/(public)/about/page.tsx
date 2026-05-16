// app/about/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Archive | Kurunzi Sports",
  description:
    "Kurunzi Sports is Kenya's premier digital sports archive — delivering deep-dive analysis, breaking news, and historical records from the pitch to the track.",
};

export default function AboutPage() {
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
            About
          </p>
          <h1
            className="kn-headline"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            The Archive
          </h1>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              color: "var(--ink-soft)",
            }}
          >
            Kenya&apos;s premier digital sports archive. Building the record of
            a nation&apos;s sporting story, one story at a time.
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-12">
        <div
          className="prose-content space-y-8"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.0625rem",
            lineHeight: 1.85,
            color: "var(--ink-soft)",
          }}
        >
          <section>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              What We Do
            </h2>
            <p>
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

          <div
            className="border-l-4 pl-5 py-1"
            style={{ borderColor: "var(--accent)" }}
          >
            <p
              className="text-lg italic"
              style={{
                color: "var(--ink-soft)",
                fontFamily: "var(--font-body)",
              }}
            >
              &quot;Kurunzi&quot; means torch in Swahili. We carry the light for
              Kenyan sport.
            </p>
          </div>

          <section>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              Our Principles
            </h2>
            <ul className="space-y-3 list-none pl-0">
              {[
                {
                  title: "Independence",
                  body: "We are not affiliated with any federation, club, or governing body. Our editorial decisions are made without commercial or political interference.",
                },
                {
                  title: "Accuracy",
                  body: "We correct errors promptly and transparently. If we get something wrong, we say so — clearly, in the same place the error appeared.",
                },
                {
                  title: "Depth",
                  body: "Breaking news matters, but so does context. We invest in long-form reporting, data journalism, and investigative work that goes beyond the scoreline.",
                },
                {
                  title: "Representation",
                  body: "We cover all sports, not just the commercially dominant ones. Kenyan athletes compete and excel across dozens of disciplines. We follow all of them.",
                },
              ].map(({ title, body }) => (
                <li key={title} className="flex gap-4">
                  <div
                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--accent)" }}
                  />
                  <div>
                    <strong
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontWeight: 700,
                        color: "var(--ink)",
                        fontSize: "0.875rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {title}
                    </strong>
                    <p className="mt-1">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-0.02em",
              }}
            >
              Get in Touch
            </h2>
            <p>
              For editorial enquiries, corrections, tip-offs, or partnership
              discussions, reach our team at{" "}
              <a
                href="mailto:editorial@kurunzisports.com"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                editorial@kurunzisports.com
              </a>
              . You can also find us on the{" "}
              <Link
                href="/contact"
                style={{ color: "var(--accent)", textDecoration: "underline" }}
              >
                Editorial Team
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
