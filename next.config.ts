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

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
