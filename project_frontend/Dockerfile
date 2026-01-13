FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - just copy built files
FROM alpine:latest

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

# This image is used just to hold the built files
# Caddy will serve them via volume mount
CMD ["echo", "Frontend build complete. Files are in /app/dist"]
