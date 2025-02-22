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
};

export default nextConfig;