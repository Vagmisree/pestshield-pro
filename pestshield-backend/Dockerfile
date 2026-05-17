# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# ─── Stage 2: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run db:generate
RUN pnpm run build

# ─── Stage 3: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 pestshield

# Copy only production artifacts
COPY --from=builder --chown=pestshield:nodejs /app/dist ./dist
COPY --from=builder --chown=pestshield:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=pestshield:nodejs /app/prisma ./prisma
COPY --from=builder --chown=pestshield:nodejs /app/package.json ./

# Create logs directory
RUN mkdir -p logs && chown pestshield:nodejs logs

USER pestshield

EXPOSE 4000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
