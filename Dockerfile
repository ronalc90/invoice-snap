# ─────────────────────────────────────────────────────────
# Stage 1: Dependencias
# ─────────────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────
# Stage 2: Build
# ─────────────────────────────────────────────────────────
FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 3: Runner (produccion)
# ─────────────────────────────────────────────────────────
FROM node:18-alpine
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
