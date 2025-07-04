# Coolify Deployment Setup

This document explains how to deploy the chatbot application to Coolify with proper secret management.

## Overview

The application consists of:
- **Frontend**: React/Vite app (built as static files, served by nginx)
- **Backend**: Express.js API server

Both are deployed as separate Docker containers that are built and pushed to GitHub Container Registry (GHCR) via GitHub Actions.

## Prerequisites

1. Coolify instance running and accessible
2. GitHub repository with GHCR access
3. Supabase project (if using auth features)
4. OpenAI API key (if using AI features)

## GitHub Secrets Setup

In your GitHub repository settings, add these secrets:

### Required for CI/CD
- `COOLIFY_WEBHOOK`: The webhook URL from Coolify to trigger deployments
- `COOLIFY_TOKEN`: Bearer token for Coolify API authentication (optional, depends on your setup)

### NOT needed in GitHub (handled by Coolify)
- ❌ `VITE_SUPABASE_URL` - Move to Coolify
- ❌ `VITE_SUPABASE_ANON_KEY` - Move to Coolify  
- ❌ `OPENAI_API_KEY` - Move to Coolify
- ❌ Other app secrets - Move to Coolify

## Coolify Service Setup

### 1. Create Frontend Service

**Service Type**: Docker Image
**Image**: `ghcr.io/YOUR_USERNAME/YOUR_REPO-frontend:latest`
**Port**: 80

**Environment Variables**:
```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ENABLE_TTS=true
VITE_ENABLE_STT=true
```

**Important Notes**:
- Frontend uses Vite build-time environment variables
- These env vars are baked into the build, not runtime
- For production, you may want to rebuild the image with production values
- Or use a runtime configuration approach (see Advanced Setup below)

### 2. Create Backend Service

**Service Type**: Docker Image
**Image**: `ghcr.io/YOUR_USERNAME/YOUR_REPO-backend:latest`
**Port**: 3001

**Environment Variables**:
```
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your-openai-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ENABLE_TTS=true
ENABLE_STT=true
```

**Health Check**: 
- Path: `/health`
- Port: 3001

### 3. Domain Configuration

- **Frontend**: Configure your main domain (e.g., `chatbot.yourdomain.com`)
- **Backend**: Configure API subdomain (e.g., `api.chatbot.yourdomain.com`)
- Update frontend's `VITE_API_BASE_URL` to point to backend domain

### 4. Setup Deployment Webhook

1. In Coolify, go to your service settings
2. Find the "Webhooks" section
3. Copy the deployment webhook URL
4. Add it to GitHub secrets as `COOLIFY_WEBHOOK`

## Deployment Flow

1. **Push to main branch** triggers GitHub Actions
2. **GitHub Actions builds** both frontend and backend Docker images
3. **Images are pushed** to GHCR with `latest` and commit SHA tags
4. **Coolify webhook** is triggered to pull and deploy new images
5. **Coolify pulls** the latest images and restarts services

## Environment Variables Reference

### Frontend (Vite Build-time)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.chatbot.yourdomain.com` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `VITE_ENABLE_TTS` | Enable text-to-speech | `true` or `false` |
| `VITE_ENABLE_STT` | Enable speech-to-text | `true` or `false` |

### Backend (Runtime)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port | `3001` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...` |
| `ENABLE_TTS` | Enable text-to-speech API | `true` or `false` |
| `ENABLE_STT` | Enable speech-to-text API | `true` or `false` |

## Advanced Setup (Optional)

### Runtime Configuration for Frontend

If you want to avoid rebuilding images for different environments, you can implement runtime configuration:

1. **Create a config endpoint** in your backend that serves frontend configuration
2. **Modify frontend** to fetch config at startup instead of using build-time env vars
3. **Use a single image** for all environments

This approach requires more code changes but provides better flexibility.

### Using Docker Compose in Coolify

Alternatively, you can deploy using Docker Compose:

1. **Upload docker-compose.yml** to Coolify
2. **Set environment variables** in Coolify's compose service
3. **Use build context** or pre-built images

## Troubleshooting

### Common Issues

1. **Frontend can't connect to backend**
   - Check `VITE_API_BASE_URL` points to correct backend domain
   - Verify CORS settings in backend
   - Check both services are running

2. **Supabase auth not working**
   - Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
   - Check Supabase project settings and allowed origins

3. **OpenAI API calls failing**
   - Verify `OPENAI_API_KEY` is set correctly in backend
   - Check API key has sufficient credits/permissions

4. **Features not working (TTS/STT)**
   - Check feature flags are enabled in both frontend and backend
   - Verify `/api/features` endpoint returns expected values

### Debugging Steps

1. **Check service logs** in Coolify dashboard
2. **Verify environment variables** are set correctly
3. **Test health endpoints** (`/health` for backend)
4. **Check network connectivity** between services
5. **Verify domain/DNS configuration**

## Security Best Practices

1. **Never commit secrets** to GitHub repository
2. **Use Coolify's secret management** for all sensitive data
3. **Set appropriate CORS policies** in backend
4. **Use HTTPS** for all production deployments
5. **Regularly rotate API keys** and secrets
6. **Monitor service logs** for security issues

## Monitoring

1. **Set up health checks** for both services
2. **Monitor resource usage** in Coolify
3. **Set up alerts** for service failures
4. **Regular backups** of configuration and data
