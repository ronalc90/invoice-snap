# ─────────────────────────────────────────────────────────
# Base comun: Node 22 + OpenSSL
# ─────────────────────────────────────────────────────────
# Prisma necesita OpenSSL para elegir su query engine. Sin el paquete
# `openssl`, Prisma no detecta la libssl 3 de Alpine, cae a openssl-1.1.x
# y el engine falla en runtime con "libssl.so.1.1: No such file".
FROM node:22-alpine AS base
RUN apk add --no-cache openssl

# ─────────────────────────────────────────────────────────
# Stage 1: Dependencias
# ─────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# npm ci ejecuta `prisma generate` en el postinstall, que necesita el schema
COPY prisma ./prisma
RUN npm ci

# ─────────────────────────────────────────────────────────
# Stage 2: Build
# ─────────────────────────────────────────────────────────
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV STANDALONE=1
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 3: Runner (produccion)
# ─────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma

USER app

EXPOSE 3003

ENV PORT=3003
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3003 || exit 1

CMD ["node", "server.js"]
