import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**",
      },
      // ADD THIS SECTION FOR SUPABASE
      {
        protocol: "https",
        hostname: "ypnloyeywhgpnrjbllni.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // High-performance news sites use specific device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },

  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

export default nextConfig;
