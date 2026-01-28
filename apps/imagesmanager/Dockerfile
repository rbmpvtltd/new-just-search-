# ----------------------------
# Base
# ----------------------------
FROM oven/bun:1.3 AS base
WORKDIR /app

# ----------------------------
# Prune monorepo
# ----------------------------
FROM base AS builder

COPY . .

RUN bun i && mkdir public

EXPOSE 3000
CMD ["bun", "run", "start"]
