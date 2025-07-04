# 🚀 SimplifyAI Chatbot

A powerful, secure, and modern chatbot application with React frontend and Express.js backend.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional)

## 🏃‍♂️ Quick Start

### Option 1: Development Mode (Recommended)

```bash
# 1. Install all dependencies (frontend + backend)
npm run install:all

# 2. Start both frontend and backend
npm start
```

That's it! 🎉

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Option 2: Nix Mode

If you use [Nix](https://zero-to-nix.com/start/install/) and [flakes](https://nixos.wiki/wiki/Flakes), you can get a fully reproducible dev environment (Node.js 20, npm, Docker, etc) with:

```bash
nix develop
```

This will provide:
- Node.js 20
- npm
- Docker
- git, curl, openssl, postgresql (optional for Supabase)
- All tools needed for development

**How to use:**
1. Make sure you have [Nix with flakes enabled](https://nixos.wiki/wiki/Flakes).
2. Run:
   ```bash
   nix develop
   ```
3. You’ll drop into a shell with all dependencies ready.  
   Now you can run `npm run install:all` and `npm start` as usual.

> The `flake.nix` file is provided in the project root.


### Option 3: Docker Mode

```bash
# Build and run with Docker
npm run docker:dev
```

- **Frontend**: http://localhost:80
- **Backend**: http://localhost:3001

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start both frontend and backend in development mode |
| `npm run dev` | Same as `npm start` |
| `npm run install:all` | Install dependencies for both frontend and backend |
| `npm run build` | Build both frontend and backend for production |
| `npm run docker:dev` | Build and run with Docker Compose |
| `npm run docker:build` | Build Docker images |
| `npm run docker:up` | Run existing Docker images |

## 🏁 Feature Flags

You can enable/disable features using environment variables:

### Backend (.env and backend/.env)
```bash
# Enable/disable Text-to-Speech (TTS)
ENABLE_TTS=true

# Enable/disable Speech-to-Text (STT)  
ENABLE_STT=true
```

### Frontend (.env - for build-time)
```bash
# Frontend feature flags (optional, synced from backend at runtime)
VITE_ENABLE_TTS=true
VITE_ENABLE_STT=true
```

### Feature Management
- **TTS Disabled**: Speaker buttons won't appear in chat messages
- **STT Disabled**: Microphone button won't appear in message input
- **Runtime Check**: Features are checked dynamically from backend
- **Graceful Fallback**: Components hide automatically when disabled

### API Endpoints
- `GET /api/features` - Get current feature flag status
- `POST /api/tts` - Text-to-Speech (requires `ENABLE_TTS=true`)
- `POST /api/stt` - Speech-to-Text (requires `ENABLE_STT=true`)

## 🌍 Environment Variables

### Required Setup

1. **Copy environment files:**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. **Configure your keys:**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### Environment Files Structure

**Root `.env`** (Frontend build-time):
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ENABLE_TTS=true
VITE_ENABLE_STT=true
```

**`backend/.env`** (Backend runtime):
```bash
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
PORT=3001
CORS_ORIGIN=*
ENABLE_TTS=true
ENABLE_STT=true
```

## 🚀 Deployment

### Docker Compose (Local Production)

```bash
# Build and run production containers
docker-compose up --build

# Run in background
docker-compose up -d
```

### Coolify (Cloud Deployment)

This project is configured for automated deployment to [Coolify](https://coolify.io/) using GitHub Actions.

📖 **[Complete Coolify Setup Guide](docs/COOLIFY_SETUP.md)**

**Quick Overview:**
1. **Setup GitHub Secrets** (only webhook URL needed)
2. **Configure Coolify Services** with proper environment variables  
3. **Push to main branch** - automatic deployment via GitHub Actions

**Key Benefits:**
- ✅ Secure secret management in Coolify (not in GitHub)
- ✅ Automated CI/CD with GitHub Actions
- ✅ Separate frontend and backend containers
- ✅ Production-ready with health checks
- ✅ Easy rollback and monitoring

### Manual Deployment

For manual deployment or other platforms, see:
- **[General Setup Guide](docs/SETUP.md)**
- **[Supabase Auth Setup](docs/SUPABASE_AUTH.md)**
- **[Deployment Guide](docs/DEPLOYMENT.md)**

## 📝 Requirements

- **Node.js 18+**
- **npm** or **yarn**
- **Docker** (for containerized deployment)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/account/api-keys))
- **Supabase Account** ([Create one here](https://supabase.com/))

## 🤝 Contributing

All contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
