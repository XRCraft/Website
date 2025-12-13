import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove ESLint ignore since we've fixed all issues
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties: process.env.NODE_ENV === "production",
  },
  
  // Enable static export for GitHub Pages
  output: 'export',

  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minotar.net',
      },
    ],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'framer-motion'],
  },
  
  // Optimize bundle size
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
  },
  
  // Compression and caching
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Cache optimization
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
};

export default nextConfig;
