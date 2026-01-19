# Production Dockerfile for Frontend
# Multi-stage build: Build React app, then serve with nginx

FROM node:20-alpine AS builder

# Build argument for API URL
ARG VITE_API_URL=http://localhost:3001/api

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Set environment variable for build
ENV VITE_API_URL=${VITE_API_URL}

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
