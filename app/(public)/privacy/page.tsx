// app/privacy/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Kurunzi Sports",
  description:
    "Privacy Policy for Kurunzi Sports — how we collect, use, and protect your data.",
};

const LAST_UPDATED = "1 May 2026";

const SECTIONS = [
  {
    title: "1. Who We Are",
    body: `Kurunzi Sports Media operates kurunzisports.com. We are based in Nairobi, Kenya. This Privacy Policy explains how we collect, use, and protect information about you when you use our website.`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect information you provide directly — for example, when you subscribe to our newsletter or contact us by email. We also collect usage data automatically when you visit the site, including your IP address, browser type, pages visited, and time spent on the site. This data is collected through cookies and similar technologies.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use the information we collect to deliver and improve our journalism; to send newsletters and editorial updates to subscribers who have opted in; to understand how readers use the site so we can improve it; and to comply with legal obligations. We do not sell your personal data to third parties.`,
  },
  {
    title: "4. Cookies",
    body: `We use cookies to make the site work, to remember your preferences, and to understand how readers engage with our content. We also use third-party analytics cookies (such as Google Analytics) to analyse site traffic. You can control cookies through your browser settings. Disabling cookies may affect some site functionality.`,
  },
  {
    title: "5. Newsletter & Email",
    body: `If you subscribe to our newsletter, we will use your email address to send you editorial updates. You can unsubscribe at any time using the link at the bottom of any email we send, or by emailing privacy@kurunzisports.com. We do not share subscriber email addresses with third parties for marketing purposes.`,
  },
  {
    title: "6. Third-Party Services",
    body: `We use a small number of third-party services to operate the site, including hosting providers, analytics platforms, and email delivery services. These services may process your data on our behalf and are required to handle it in accordance with this policy. We also embed content from social media platforms (such as Twitter/X and YouTube), which may set their own cookies.`,
  },
  {
    title: "7. Data Retention",
    body: `We retain newsletter subscriber data for as long as you remain subscribed and for a reasonable period thereafter. Usage data collected by analytics services is retained in accordance with those services' own policies. You may request deletion of your data at any time by contacting us.`,
  },
  {
    title: "8. Your Rights",
    body: `Under applicable data protection law, you have the right to access the personal data we hold about you; to request correction of inaccurate data; to request deletion of your data; and to object to or restrict certain processing. To exercise any of these rights, contact us at privacy@kurunzisports.com.`,
  },
  {
    title: "9. Security",
    body: `We take reasonable technical and organisational measures to protect your data against unauthorised access, loss, or misuse. However, no data transmission over the internet is completely secure, and we cannot guarantee the security of information transmitted to us.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify users of significant changes by updating the date at the top of this page. Your continued use of the site after changes are published constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact",
    body: `For questions about this Privacy Policy or data protection matters, contact us at privacy@kurunzisports.com.`,
  },
];

export default function PrivacyPage() {
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
            Privacy Policy
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
