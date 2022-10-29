/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/astrotools' : ''

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  },
  basePath,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/xtable',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
