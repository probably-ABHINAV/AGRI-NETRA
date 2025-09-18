/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow all hosts for Replit proxy environment
  experimental: {
    allowedRevalidateHeaderKeys: [],
  },
  // Allow Replit origins for development
  allowedDevOrigins: ['*.repl.co', '*.replit.dev', '127.0.0.1'],
  // Configure for Replit environment
  async rewrites() {
    return [];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Allow all hosts - critical for Replit proxy
  async redirects() {
    return [];
  },
}

export default nextConfig
