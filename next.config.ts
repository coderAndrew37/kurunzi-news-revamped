import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Image Optimization for Sanity CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
    ],
    // High-performance news sites use specific device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"], // AVIF is 20% smaller than WebP
  },

  // 2. SEO & Performance Enhancements
  reactStrictMode: true,
  poweredByHeader: false, // Security: Don't tell hackers we use Next.js
  
  // 3. Ensure trailing slashes for consistent SEO canonicals
  trailingSlash: false,

  // 4. Redirects (Useful for legacy news URLs or common typos)
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // 5. Advanced SEO: Optimization for Google's "Core Web Vitals"
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

export default nextConfig;