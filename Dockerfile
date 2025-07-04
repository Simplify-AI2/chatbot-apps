# Multi-stage Dockerfile for building and serving the Vite React app

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Serve stage
FROM nginx:alpine
# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
