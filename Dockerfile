# Voidlink — Railway Phase A: static-site hosting.
#
# Two-stage Docker build:
#   1. Builder: pnpm + workspace install, build the Vite frontend
#   2. Runtime: tiny static-file server (`serve`) on a minimal node image
#
# Phase B (cloud saves) will add an `apps/server` build target alongside.
# Phase C (multiplayer) will replace the runtime with the WebSocket server.

# ── Builder ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm matching the engines pin in package.json
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy lockfile + workspace manifests first so install layer caches
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/desktop/package.json ./apps/desktop/
COPY libs/core/package.json ./libs/core/
COPY libs/ui/package.json ./libs/ui/

RUN pnpm install --frozen-lockfile

# Copy sources and build the web app
COPY . .
RUN pnpm --filter @voidlink/web build

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Minimal static server. `serve` is ~3MB, zero config, handles SPA fallback.
RUN npm install -g serve@14.2.4

# Copy only the built output
COPY --from=builder /app/apps/web/dist ./dist

# Railway will populate PORT; default to 8080 for local docker run
ENV PORT=8080
EXPOSE 8080

# `-s` enables SPA fallback (every route serves index.html so client-side
# routing works). `-l` binds to the port Railway provides.
CMD ["sh", "-c", "serve -s dist -l ${PORT}"]
