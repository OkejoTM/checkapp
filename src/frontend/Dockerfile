# Используем официальный Node.js образ
FROM node:18-alpine AS base

# Установка зависимостей только когда необходимо
FROM base AS deps
# Проверяем https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем файлы package.json и package-lock.json (если доступен)
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Пересборка исходников только когда необходимо
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Создаем папку public, если её нет
RUN mkdir -p public

# Создаем production build
# Отключаем телеметрию Next.js во время сборки
ENV NEXT_TELEMETRY_DISABLED 1
# Отключаем ESLint во время сборки для Docker
ENV ESLINT_NO_DEV_ERRORS=true

RUN npm run build

# Production образ, копируем все файлы и запускаем Next.js
FROM base AS runner
WORKDIR /app

# Отключаем телеметрию Next.js во время выполнения
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем public папку
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Автоматически используем output traces для уменьшения размера образа
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]