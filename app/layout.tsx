import { Geist, Geist_Mono } from "next/font/google"; // Add this back
import { Toaster } from "sonner";
import "./globals.css"; // Ensure this stays here for global styles

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
