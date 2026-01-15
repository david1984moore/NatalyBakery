/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
