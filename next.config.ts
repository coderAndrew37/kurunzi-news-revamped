import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "ypnloyeywhgpnrjbllni.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Local WordPress
      {
        protocol: "http",
        hostname: "kurunzi-sports.local",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "kurunzinews.co.ke",
      },
      // For development images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: 'https',
        hostname: 'sportscms.kurunzinews.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sports.kurunzinews.com',
        pathname: '/**',
      }
    ],
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

  // Safely sets production page timeout limits (in seconds) 
  staticPageGenerationTimeout: 180,

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // Explicit Next.js 16 throttling key to process static pages 
    // sequentially so your local DB doesn't hit a socket reset
    staticGenerationMaxConcurrency: 1, 
  },
};

export default nextConfig;