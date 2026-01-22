FROM oven/bun:1 AS base
WORKDIR /app

# ---------------------------
# Prune turborepo
# ---------------------------
FROM base AS pruner

RUN bun add -g turbo

COPY . .
RUN turbo prune --scope=web --docker

# ---------------------------
# Install dependencies
# ---------------------------
FROM base AS deps

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lockb ./bun.lockb

RUN bun install --frozen-lockfile

# ---------------------------
# Build Next.js app
# ---------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .

WORKDIR /app/apps/web

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---------------------------
# Production runtime
# ---------------------------
FROM oven/bun:1.1.0-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
