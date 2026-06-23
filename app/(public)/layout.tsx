import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "../_components/wordpress/WPNavbar";
import Footer from "../_components/wordpress/WPFooter";
import { getNavCategories } from "@/lib/wordpress/data";

const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

// CHANGED for the BBC-style homepage redesign:
//  - Added a conditional AdSense loader script. It only renders when
//    NEXT_PUBLIC_ADSENSE_CLIENT_ID is set, so there's zero AdSense network
//    activity (and zero console noise) until you've actually been approved
//    and have a client ID to put there. WPAdSlot (used on the homepage)
//    depends on this script being present once it's enabled.
const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteURL), // Update if moving to .com or sports subdomain
  title: {
    template: "%s | Kurunzi Sports",
    default: "Kurunzi Sports | Kenya's Home of Verified Sports News & Analysis",
  },
  description:
    "Kurunzi Sports delivers the latest breaking news, match reports, and deep-dive analysis into Kenyan and East African sports.",
  keywords: [
    "Kenya Sports News",
    "Football Kenya",
    "Athletics Kenya",
    "Rugby Kenya",
    "Kurunzi Sports",
    "KPL News",
  ],
  authors: [{ name: "Kurunzi Sports Editorial Team" }],
  openGraph: {
    title: "Kurunzi Sports",
    description:
      "Your trusted source for verified sports coverage and analysis.",
    url: siteURL,
    siteName: "Kurunzi Sports",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurunzi Sports",
    description: "Verified Sports News from the heart of Kenya.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: siteURL,
    types: {
      "application/rss+xml": `${siteURL}/feed.xml`,
    },
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetching categories from WordPress instead of Sanity
  const categories = await getNavCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Kurunzi Sports",
    url: siteURL,
    logo: `${siteURL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {adsenseClientId && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      <div className="min-h-screen bg-[#fdfcfb]">
        {/* Navbar - logic is now internal to the component */}
        <Navbar categories={categories} />

        {/* Main content - Using the subtle paper-like background for readability */}
        <main className="min-h-screen bg-[#fdfcfb]">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}