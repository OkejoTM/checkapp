/** @type {import('next').NextConfig} */
const nextConfig = {
  // Делаем переменную доступной в браузере через рантайм конфиг
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL
  },
  env: {
    // Для клиента используем NEXT_PUBLIC_ префикс
    NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL
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
  // Отключаем TypeScript проверки во время сборки в production
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig