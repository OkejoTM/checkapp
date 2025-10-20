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
  },
  // Отключаем ESLint во время сборки в production (для Docker)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Отключаем TypeScript проверки во время сборки в production (опционально)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'Development' || process.env.NODE_ENV === 'production',
  }
}

module.exports = nextConfig