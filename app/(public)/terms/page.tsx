// app/terms/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Kurunzi Sports",
  description:
    "Terms of Service for Kurunzi Sports — Kenya's premier digital sports archive.",
};

const LAST_UPDATED = "1 May 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using Kurunzi Sports (kurunzisports.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.`,
  },
  {
    title: "2. Use of Content",
    body: `All content published on Kurunzi Sports — including articles, photographs, graphics, and data — is the intellectual property of Kurunzi Sports Media or its content partners. You may share our content for personal, non-commercial purposes provided you attribute Kurunzi Sports and link to the original article. Reproduction of our content for commercial purposes, or republication in full without written permission, is prohibited.`,
  },
  {
    title: "3. User Conduct",
    body: `You agree not to use this site to transmit any unlawful, harmful, or offensive material; to attempt to gain unauthorised access to any part of the site or its related systems; to scrape, crawl, or otherwise harvest data from the site in bulk without prior written consent; or to impersonate any person or entity in connection with the site.`,
  },
  {
    title: "4. Accuracy & Editorial Independence",
    body: `Kurunzi Sports strives for accuracy in all its reporting. We correct errors promptly and transparently. Our editorial decisions are made independently of advertisers, sponsors, and commercial partners. Sponsored content, where published, is clearly labelled as such.`,
  },
  {
    title: "5. Third-Party Links",
    body: `Our content may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    title: "6. Disclaimers",
    body: `Content on Kurunzi Sports is provided for informational purposes only. Match statistics, fixture times, and standings are subject to change and may not reflect real-time data. We make no warranties, express or implied, regarding the accuracy, completeness, or fitness for purpose of any content on this site.`,
  },
  {
    title: "7. Limitation of Liability",
    body: `To the fullest extent permitted by applicable law, Kurunzi Sports Media shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, this site or its content.`,
  },
  {
    title: "8. Changes to These Terms",
    body: `We may update these Terms of Service from time to time. We will notify users of significant changes by updating the "Last updated" date at the top of this page. Your continued use of the site after changes are published constitutes acceptance of the new terms.`,
  },
  {
    title: "9. Governing Law",
    body: `These terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.`,
  },
  {
    title: "10. Contact",
    body: `For questions about these Terms of Service, contact us at legal@kurunzisports.com.`,
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "var(--paper)" }}>
      {/* Header */}
      <div
        className="border-b"
        style={{ borderColor: "var(--rule)", background: "var(--paper-warm)" }}
      >
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-14">
          <p
            className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--accent)" }}
          >
            Legal
          </p>
          <h1
            className="kn-headline"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Terms of Service
          </h1>
          <p
            className="mt-3 text-[11px] uppercase tracking-[0.14em]"
            style={{ fontFamily: "var(--font-ui)", color: "var(--ink-faint)" }}
          >
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-12">
        <div className="space-y-10">
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2
                className="mb-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "var(--ink-soft)",
                }}
              >
                {body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
