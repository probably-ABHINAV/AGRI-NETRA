
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build optimization
  swcMinify: true,
  compress: true,
  
  // Production settings
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Image optimization
  images: {
    unoptimized: false,
    domains: ['placeholder.com', 'supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Performance optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]

    // Add HSTS in production
    if (process.env.NODE_ENV === 'production') {
      headers[0].headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      })
    }

    return headers
  },
  
  // Webpack optimization
  webpack: (config, { isServer, dev }) => {
    // Reduce webpack cache warnings
    if (!isServer && config.optimization?.splitChunks?.cacheGroups?.default) {
      config.optimization.splitChunks.cacheGroups.default.minSize = 0;
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization.minimize = true
      config.optimization.concatenateModules = true
    }
    
    return config;
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  async rewrites() {
    return [
      {
        source: '/api/healthz',
        destination: '/api/health',
      },
    ]
  },
  
  // Output configuration for deployment
  output: 'standalone',
  trailingSlash: false,
  
  // Development settings
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: true,
  }),
}

export default nextConfig
