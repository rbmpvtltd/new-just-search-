# ----------------------------
# Base
# ----------------------------
FROM oven/bun:1.3 AS base
WORKDIR /app

# ----------------------------
# Prune monorepo
# ----------------------------
FROM base AS pruner
RUN bun add -g turbo

# copy full repo
COPY . .

# prune only api app
RUN turbo prune --scope=@repo/backend --docker

# ----------------------------
# Dependencies
# ----------------------------
FROM base AS deps
WORKDIR /app

# copy pruned files
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock

RUN bun install --frozen-lockfile

# ----------------------------
# Build
# ----------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .

RUN bun run build --filter=@repo/backend

# ----------------------------
# Runtime
# ----------------------------
FROM oven/bun:canary-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=builder /app/apps/backend/package.json /app/apps/backend/package.json

WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["bun", "dist/index.js"]
