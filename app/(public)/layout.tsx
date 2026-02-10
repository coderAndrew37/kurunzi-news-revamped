import type { Metadata } from "next";
import { fetchNavCategories } from "@/lib/sanity/api";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";

// Move your Metadata here - specifically for the News site
export const metadata: Metadata = {
  metadataBase: new URL("https://kurunzinews.co.ke"),
  title: {
    template: "%s | Kurunzi News",
    default: "Kurunzi News | Breaking News, Politics, and Business in Kenya",
  },
  description:
    "Kurunzi News provides the latest verified news, political analysis, and business insights across Kenya and the East African region.",
  keywords: [
    "Kenya News",
    "Breaking News Kenya",
    "Kurunzi News",
    "Politics Kenya",
    "Business Kenya",
  ],
  authors: [{ name: "Kurunzi News Team" }],
  openGraph: {
    title: "Kurunzi News",
    description: "Your trusted source for verified news and deep analysis.",
    url: "https://kurunzinews.co.ke",
    siteName: "Kurunzi News",
    images: [
      {
        url: "/og-image.jpg", // Make sure to add this in your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurunzi News",
    description: "Verified News from the heart of Kenya.",
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
  const categories = await fetchNavCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Kurunzi News",
    url: "https://kurunzinews.co.ke",
    logo: "https://kurunzinews.co.ke/logo.png",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar categories={categories} />
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
