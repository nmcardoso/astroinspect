/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '' : ''

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  basePath,
}

module.exports = nextConfig
