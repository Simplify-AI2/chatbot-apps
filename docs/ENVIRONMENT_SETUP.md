# Environment Setup Guide

This document explains how to set up different environments (development vs production) for the chatbot application.

## 🌍 Environment Strategy

### **Branch-based Deployment:**
- **`main` branch** → **Production** environment
- **`develop` branch** → **Development** environment
- **Manual trigger** → Choose environment via GitHub Actions UI

### **Environment Differences:**

| Environment | Branch | API URL | Supabase | Docker Tag |
|------------|--------|---------|----------|------------|
| **Production** | `main` | `https://api.chatbot.simplifygenai.id` | Production DB | `production` |
| **Development** | `develop` | `https://dev-api.chatbot.simplifygenai.id` | Development DB | `development` |

## 🔧 GitHub Secrets Setup

### **Required Secrets:**

#### **For Production (using same Supabase):**
```bash
VITE_SUPABASE_URL=https://dhndhxglrscettstgfyx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobmRoeGdscnNjZXR0c3RnZnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTkyNjgsImV4cCI6MjA2Mjc3NTI2OH0.Gdb-ZbmhrbLVj4Z4xhQzARwMRVk8LNaLH8cSrHnj0_0

# Coolify webhooks
COOLIFY_WEBHOOK=https://your-coolify-instance.com/webhook/production-webhook-id
COOLIFY_TOKEN=your-coolify-token
```

#### **For Development (separate Supabase project):**
If you want separate dev environment, create another Supabase project and update secrets:
```bash
DEV_VITE_SUPABASE_URL=https://your-dev-project.supabase.co
DEV_VITE_SUPABASE_ANON_KEY=your-dev-anon-key

COOLIFY_WEBHOOK_DEV=https://your-coolify-instance.com/webhook/dev-webhook-id
```

## 🚀 Deployment Flow

### **Automatic Deployment:**
1. **Push to `main`** → Deploy to production with production configs
2. **Push to `develop`** → Deploy to development with dev configs

### **Manual Deployment:**
1. Go to **GitHub Actions** → **"Build & Deploy to Coolify"**
2. Click **"Run workflow"**
3. Choose:
   - **Environment**: `production` or `development`
   - **Force options**: Deploy specific services

### **Environment Variables Injection:**

**Production build (main branch):**
```yaml
VITE_API_BASE_URL=https://api.chatbot.simplifygenai.id
VITE_SUPABASE_URL=${secrets.VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${secrets.VITE_SUPABASE_ANON_KEY}
```

**Development build (develop branch):**
```yaml
VITE_API_BASE_URL=https://dev-api.chatbot.simplifygenai.id
VITE_SUPABASE_URL=${secrets.VITE_SUPABASE_URL}  # Could be same or different
VITE_SUPABASE_ANON_KEY=${secrets.VITE_SUPABASE_ANON_KEY}
```

## 📦 Docker Images

### **Image Tags:**
- **Production**: `ghcr.io/simplify-ai2/chatbot-apps-frontend:production`
- **Development**: `ghcr.io/simplify-ai2/chatbot-apps-frontend:development`
- **Git SHA**: `ghcr.io/simplify-ai2/chatbot-apps-frontend:abc1234`

### **Coolify Configuration:**

#### **Production Service:**
```yaml
Image: ghcr.io/simplify-ai2/chatbot-apps-frontend:production
Domain: chatbot.simplifygenai.id
```

#### **Development Service:**
```yaml
Image: ghcr.io/simplify-ai2/chatbot-apps-frontend:development
Domain: dev.chatbot.simplifygenai.id
```

## 🔀 Branch Strategy

### **Recommended Git Flow:**

1. **Feature development:**
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # Make changes
   git push origin feature/new-feature
   # Create PR to develop
   ```

2. **Development testing:**
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop  # 🚀 Auto-deploy to dev environment
   ```

3. **Production release:**
   ```bash
   git checkout main
   git merge develop
   git push origin main     # 🚀 Auto-deploy to production
   ```

## 🔧 Alternative: Multiple Supabase Projects

### **Option 1: Same Supabase Project (Current)**
- ✅ Simple setup
- ✅ Shared user accounts
- ❌ Dev and prod data mixed

### **Option 2: Separate Supabase Projects**
- ✅ Complete isolation
- ✅ Safe for testing
- ❌ More complex setup
- ❌ Separate user accounts

**Setup for Option 2:**
1. Create new Supabase project for development
2. Add separate secrets:
   ```bash
   DEV_VITE_SUPABASE_URL=https://dev-project.supabase.co
   DEV_VITE_SUPABASE_ANON_KEY=dev-anon-key
   ```
3. Update workflow to use different secrets per environment

## 📊 Environment Comparison

| Aspect | Production | Development |
|--------|------------|-------------|
| **Domain** | `chatbot.simplifygenai.id` | `dev.chatbot.simplifygenai.id` |
| **API** | `api.chatbot.simplifygenai.id` | `dev-api.chatbot.simplifygenai.id` |
| **Supabase** | Production project | Same or separate project |
| **Users** | Real users | Test users |
| **Data** | Production data | Test data |
| **Monitoring** | Full monitoring | Basic monitoring |

## 🚨 Best Practices

### **Security:**
1. **Never commit real secrets** to any branch
2. **Use separate Supabase projects** for complete isolation
3. **Rotate API keys regularly**
4. **Monitor access logs**

### **Development:**
1. **Test on development** before production
2. **Use feature flags** for gradual rollouts
3. **Monitor deployment** health checks
4. **Keep environments in sync** (schema, configs)

### **Deployment:**
1. **Always deploy to dev first**
2. **Run tests** before production deployment
3. **Have rollback plan** ready
4. **Monitor** post-deployment metrics

## 🔍 Troubleshooting

### **Common Issues:**

1. **Wrong environment deployed:**
   ```bash
   # Check which branch triggered the deployment
   # Verify environment detection logic in workflow
   ```

2. **Supabase connection error:**
   ```bash
   # Verify secrets are set correctly
   # Check Supabase project status
   # Verify domain configuration
   ```

3. **API connection failure:**
   ```bash
   # Check if backend is deployed and healthy
   # Verify API_BASE_URL is correct
   # Check CORS configuration
   ```

## 📞 Support

For environment setup issues:
1. Check GitHub Actions logs
2. Verify Coolify service status
3. Test environment variables
4. Check domain DNS configuration
