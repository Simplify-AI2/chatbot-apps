# 🚀 Deployment Guide

This guide covers deploying the SimplifyAI Chatbot to various platforms.

## 📋 Overview

The application consists of two services:
- **Frontend**: React app built with Vite, served via Nginx
- **Backend**: Express.js API server

Both services are containerized and can be deployed independently.

## 🐳 Docker Images

The CI/CD pipeline builds and pushes two Docker images:

- `ghcr.io/your-username/your-repo-backend:latest`
- `ghcr.io/your-username/your-repo-frontend:latest`

## 🌟 Coolify Deployment

### Prerequisites

1. **Coolify Instance**: A running Coolify server
2. **GitHub Repository**: With the project code
3. **GitHub Secrets**: Configured for the workflow

### Step 1: Configure GitHub Secrets

Navigate to your GitHub repository: **Settings → Secrets and variables → Actions**

Add the following secrets:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI Configuration  
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Coolify Configuration
COOLIFY_WEBHOOK=https://your-coolify-instance.com/webhook/12345678-1234-1234-1234-123456789012
COOLIFY_TOKEN=your-coolify-api-token
```

### Step 2: Create Coolify Services

#### Backend Service

1. **Create New Service** in Coolify
2. **Choose "Docker Image"**
3. **Configure**:
   - **Name**: `chatbot-backend`
   - **Image**: `ghcr.io/your-username/your-repo-backend:latest`
   - **Port**: `3001`
   - **Public**: `false` (internal service)

4. **Environment Variables**:
   ```bash
   OPENAI_API_KEY=sk-proj-your-openai-api-key
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=*
   ENABLE_TTS=true
   ENABLE_STT=true
   ```

5. **Health Check**: 
   - **Path**: `/health`
   - **Port**: `3001`

#### Frontend Service

1. **Create New Service** in Coolify
2. **Choose "Docker Image"**
3. **Configure**:
   - **Name**: `chatbot-frontend`
   - **Image**: `ghcr.io/your-username/your-repo-frontend:latest`
   - **Port**: `80`
   - **Public**: `true`

4. **Domain**: Configure your domain (e.g., `chatbot.yourdomain.com`)

5. **Environment Variables** (if needed):
   ```bash
   # These are baked into the image during build
   # but can be overridden if needed
   VITE_API_BASE_URL=https://your-backend-service-url
   ```

### Step 3: Configure Webhook

1. **In Coolify**: Go to your project settings
2. **Create Webhook**: Copy the webhook URL
3. **Add to GitHub Secrets**: Add as `COOLIFY_WEBHOOK`

### Step 4: Deploy

**Automatic Deployment**:
- Push to `main` branch
- GitHub Actions will build and deploy automatically

**Manual Deployment**:
1. Go to **Actions** tab in GitHub
2. Select **"Build & Deploy to Coolify"**
3. Click **"Run workflow"**

## 🔄 CI/CD Pipeline

The deployment pipeline (`.github/workflows/deploy-coolify.yml`) performs:

1. **Checkout Code**: Gets the latest code
2. **Setup Docker**: Configures Docker Buildx with caching
3. **Login to GHCR**: Authenticates to GitHub Container Registry
4. **Inject Environment**: Creates `.env` files with secrets
5. **Build Images**: Builds both backend and frontend
6. **Push Images**: Pushes to GitHub Container Registry
7. **Trigger Deployment**: Calls Coolify webhook

## 🏗️ Alternative Deployment Methods

### Docker Compose (Local/VPS)

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit .env files with your values

# Deploy
docker-compose up -d
```

### Kubernetes

Create Kubernetes manifests:

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatbot-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: chatbot-backend
  template:
    metadata:
      labels:
        app: chatbot-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/your-username/your-repo-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: chatbot-secrets
              key: openai-api-key
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3001"
        - name: CORS_ORIGIN
          value: "*"
        - name: ENABLE_TTS
          value: "true"
        - name: ENABLE_STT
          value: "true"
```

### Vercel/Netlify (Frontend Only)

For frontend-only deployment:

```bash
# Build the frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🔧 Configuration Management

### Environment Variables

**Backend**:
- `OPENAI_API_KEY`: Required for OpenAI API access
- `NODE_ENV`: Set to `production` for production builds
- `PORT`: Server port (default: 3001)
- `CORS_ORIGIN`: CORS configuration
- `ENABLE_TTS`: Enable text-to-speech feature
- `ENABLE_STT`: Enable speech-to-text feature

**Frontend**:
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_ENABLE_TTS`: Enable TTS in UI
- `VITE_ENABLE_STT`: Enable STT in UI

### Feature Flags

Features can be toggled using environment variables:

```bash
# Disable TTS
ENABLE_TTS=false
VITE_ENABLE_TTS=false

# Disable STT
ENABLE_STT=false
VITE_ENABLE_STT=false
```

## 📊 Monitoring

### Health Checks

**Backend**: `GET /health`
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

**Frontend**: HTTP 200 on any route

### Logging

**Backend**: Logs are sent to stdout/stderr
**Frontend**: Served by Nginx, logs available in container

### Metrics

**Backend**: Available at `/api/features` for feature flag status

## 🚨 Troubleshooting

### Common Issues

1. **Image Pull Errors**: Ensure GitHub Container Registry access
2. **Environment Variables**: Check all required secrets are set
3. **Network Issues**: Verify service-to-service communication
4. **Build Failures**: Check GitHub Actions logs
5. **Supabase Connection**: Verify URL and keys are correct

### Debug Commands

```bash
# Check running containers
docker ps

# View logs
docker logs chatbot-backend
docker logs chatbot-frontend

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:80/

# Check environment variables
docker exec chatbot-backend env
```

## 🔐 Security

### Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **CORS**: Configure appropriate CORS origins
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Input Validation**: Validate all user inputs

### Secret Management

- Use GitHub Secrets for CI/CD
- Use Coolify's secret management for runtime
- Rotate API keys regularly
- Use least-privilege access principles

## 📈 Scaling

### Horizontal Scaling

Both services can be scaled horizontally:

```yaml
# In Coolify or K8s
replicas: 3
```

### Load Balancing

Configure load balancing for multiple instances:

```nginx
upstream backend {
    server backend-1:3001;
    server backend-2:3001;
    server backend-3:3001;
}
```

### Database Scaling

For Supabase:
- Enable connection pooling
- Use read replicas for read-heavy workloads
- Consider caching strategies

## 🎯 Performance Optimization

### Frontend

- Images are optimized during build
- Vite provides code splitting
- Nginx serves static files efficiently
- Localization files are included

### Backend

- Use Node.js clustering for CPU-intensive tasks
- Implement caching for API responses
- Use connection pooling for database connections
- Enable compression middleware

## 📞 Support

For deployment issues:

1. Check GitHub Actions logs
2. Review Coolify service logs
3. Verify environment variable configuration
4. Test health endpoints
5. Check network connectivity

For questions:
- Open an issue on GitHub
- Check the documentation
- Review the troubleshooting guide
