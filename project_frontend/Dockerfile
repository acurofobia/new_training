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

# Production stage - copy built files and push to volume on startup
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/dist /app/dist_src

CMD ["sh", "-c", "cp -r /app/dist_src/. /app/dist/ && echo 'Frontend files copied to volume'"]
