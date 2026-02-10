const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 70, 75, 80],
    deviceSizes: [384, 640, 1080, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: false,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Ensure Prisma client is treated as external during build
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig
