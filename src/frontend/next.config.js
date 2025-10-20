/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000'
  },
  // Включаем standalone для Docker
  output: 'standalone',
  // Оптимизации для Docker
  experimental: {
    outputFileTracingRoot: undefined,
  }
}

module.exports = nextConfig