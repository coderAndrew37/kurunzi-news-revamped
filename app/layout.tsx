import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";
import { fetchNavCategories } from "@/lib/sanity/api";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Comprehensive SEO Metadata
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 2. JSON-LD for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Kurunzi News",
    url: "https://kurunzinews.co.ke",
    logo: "https://kurunzinews.co.ke/logo.png",
    sameAs: [
      "https://facebook.com/kurunzinews",
      "https://twitter.com/kurunzinews",
      "https://instagram.com/kurunzinews",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  };

  const categories = await fetchNavCategories();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50`}
      >
        <Navbar categories={categories} />
        <main className="grow">{children}</main>
        <Toaster position="top-center" richColors />
        <Footer />
      </body>
    </html>
  );
}
