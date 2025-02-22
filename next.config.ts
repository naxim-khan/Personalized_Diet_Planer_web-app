import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow Server Actions from these origins
      allowedOrigins: [
        "localhost:3000", // Local development
        "vssknvcj-3000.inc1.devtunnels.ms", // Dev tunnels
        // Add other allowed domains here
      ],
      allowedForwardedHosts: [
        "localhost:3000",
        "vssknvcj-3000.inc1.devtunnels.ms",
      ],
    },
  },
  // Trust the forwarded headers from proxies
  async headers() {
    return [
      {
        source: "/(.*)", // Apply to all routes
        headers: [
          {
            key: "x-forwarded-host",
            value: "vssknvcj-3000.inc1.devtunnels.ms",
          },
          {
            key: "x-forwarded-proto",
            value: "https", // Ensure HTTPS is used
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  // Enable strict mode for development
  reactStrictMode: true,
  // Optional: Add logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Ignore TypeScript and ESLint errors during build (temporary)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configure images if needed
  images: {
    domains: ["localhost", "vssknvcj-3000.inc1.devtunnels.ms"],
  },
};

export default nextConfig;