import type { Metadata } from "next";
import { getNavCategories } from "@/lib/wordpress/wp-api";
import Navbar from "../_components/wordpress/WPNavbar";
import Footer from "../_components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://kurunzinews.co.ke"), // Update if moving to .com or sports subdomain
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
    url: "https://kurunzinews.co.ke",
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
    canonical: "https://kurunzinews.co.ke",
    types: {
      "application/rss+xml": "https://kurunzinews.co.ke/feed.xml",
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
    url: "https://kurunzinews.co.ke",
    logo: "https://kurunzinews.co.ke/logo.png",
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
