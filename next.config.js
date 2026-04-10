/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.STANDALONE === '1' ? 'standalone' : undefined,
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    instrumentationHook: true,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
