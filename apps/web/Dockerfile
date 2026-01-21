FROM oven/bun:1.3 AS base
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

RUN bun install

# ---------------------------
# Build Next.js app
# ---------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .

WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dra2pandx
ENV NEXT_PUBLIC_ALGOLIA_APP_ID=XLHL5IDFH9
ENV NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=4b94ea6117cbe235a2e3794e8060ee38
ENV NEXT_PUBLIC_RAZOR_PAY_KEY_ID="rzp_test_Rr3gB4MMpYOcsq"


RUN bun x turbo run build --filter=web

# ---------------------------
# Production runtime - USE NODE.JS
# ---------------------------
FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Starting server with Node.js
WORKDIR /app/apps/web
EXPOSE 3000

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Use Node.js to run the server
CMD ["node", "server.js"]
