/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/astrotools' : '/'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  basePath
}

module.exports = nextConfig
