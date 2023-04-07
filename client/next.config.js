/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  images: {
    domains: ['gateway.pinata.cloud']
  }
}

module.exports = nextConfig
