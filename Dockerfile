# ─── Stage 1: Build frontend ───────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Install deps first (layer cache)
ARG HTTP_PROXY
ARG HTTPS_PROXY

COPY package.json bun.lock ./
RUN http_proxy=$HTTP_PROXY https_proxy=$HTTPS_PROXY bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# ─── Stage 2: Production runtime ───────────────────────────────────────────
FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

ARG HTTP_PROXY
ARG HTTPS_PROXY

# Only production deps
COPY package.json bun.lock ./
RUN http_proxy=$HTTP_PROXY https_proxy=$HTTPS_PROXY bun install --frozen-lockfile --production

# Copy server source
COPY server.ts ./
COPY server/ ./server/
COPY tsconfig.json ./

# Copy built frontend from builder
COPY --from=builder /app/dist ./dist

# Data directory for SQLite
RUN mkdir -p /data

EXPOSE 3001

CMD ["bun", "run", "server.ts"]
