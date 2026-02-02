const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Ensure Prisma client is treated as external during build
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig
