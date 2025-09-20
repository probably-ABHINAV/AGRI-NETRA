
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    unoptimized: true,
  },
  // Configure for production readiness
  experimental: {
    allowedRevalidateHeaderKeys: [],
  },
  // Security headers for production
  async headers() {
    const headers = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]

    // Add cache control for development
    if (process.env.NODE_ENV === 'development') {
      headers[0].headers.push({
        key: 'Cache-Control',
        value: 'no-cache, no-store, must-revalidate',
      })
    }

    return headers
  },
  // Configure for Replit environment
  webpack: (config, { isServer }) => {
    // Reduce webpack cache warnings
    if (!isServer && config.optimization?.splitChunks?.cacheGroups?.default) {
      config.optimization.splitChunks.cacheGroups.default.minSize = 0;
    }
    return config;
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [];
  },
}

export default nextConfig
