# ============================================================================
# WORKMATCH AI — PRODUCTION MULTI-STAGE DOCKERFILE
# ============================================================================

# STAGE 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package manifests first for optimal layer caching
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Copy full application source
COPY . .

# Build both backend (api/index.js) and frontend (frontend/dist)
RUN npm run build

# STAGE 2: Production Minimal Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV DATABASE_PATH=/app/data/workmatch.sqlite

# Create data directory and assign permissions to non-root user
RUN mkdir -p /app/data && chown -R node:node /app

# Copy built application bundles from builder
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/api ./api
COPY --from=builder --chown=node:node /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=node:node /app/backend/src/database ./backend/src/database

USER node

EXPOSE 4000

# Container health probe checking database and connectors status
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "api/index.js"]
