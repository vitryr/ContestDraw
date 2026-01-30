# Backend Dockerfile - Dev & Production
FROM node:20-slim AS base

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ============ Development ============
FROM base AS development

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ============ Builder ============
FROM base AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY build.js ./

# Install dependencies
RUN npm ci

# Copy source and prisma
COPY src ./src
COPY prisma ./prisma
COPY .swcrc ./

# Build with esbuild
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# ============ Production ============
FROM base AS production

RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]
