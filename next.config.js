/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    instrumentationHook: true,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
