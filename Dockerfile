# Multi-stage Dockerfile for building and serving the Vite React app

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Set default environment variables for build
ARG VITE_API_BASE_URL=http://localhost:3001
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_ENABLE_TTS=true
ARG VITE_ENABLE_STT=true

# Make them available during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_ENABLE_TTS=$VITE_ENABLE_TTS
ENV VITE_ENABLE_STT=$VITE_ENABLE_STT

RUN npm run build

# 2. Serve stage
FROM nginx:alpine
# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy public locales for i18n to correct location
COPY --from=builder /app/public/locales /usr/share/nginx/html/locales
# Add custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
