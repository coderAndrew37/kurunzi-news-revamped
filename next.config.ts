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
      {
        protocol: "http",
        hostname: "kurunzi-sports-backend.local",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "kurunzinews.co.ke",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      //add unsplash for local development with ngrok
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      //add secure.gravatar.com for local development with ngrok
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "**",
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
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
