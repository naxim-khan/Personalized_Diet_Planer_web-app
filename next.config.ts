import {withSentryConfig} from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow Server Actions from these origins
      allowedOrigins: [
        "localhost:3000", // Local development
        "vssknvcj-3000.inc1.devtunnels.ms", // Dev tunnels
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
    domains: ["localhost", "vssknvcj-3000.inc1.devtunnels.ms", "res.cloudinary.com"],
  },
  // Add this to handle dynamic routes properly
  output: "standalone", // Recommended for production
  // Add this to handle static generation issues
  trailingSlash: true, // Ensures consistent URL handling
};

export default withSentryConfig(nextConfig, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "nazeem-khan",
project: "javascript-nextjs",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
// tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});