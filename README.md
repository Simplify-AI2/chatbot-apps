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

* [Node.JS](https://nodejs.dev/en/)
* [npm](https://www.npmjs.com/)
* [OpenAI API Account](https://openai.com/blog/openai-api)
  * Note: GPT-4 API access is currently accessible to those who have made at least [one successful payment](https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4) through the OpenAI developer platform.


## Setup

1. Clone the repository.
```
git clone https://github.com/elebitzero/openai-react-chat.git
```
2. Copy [env.json](src/env.json)  to `local.env.json` and change 'your-api-key-here' to your [OpenAI Key](https://platform.openai.com/account/api-keys)
3. Build & Run the web server
```
npm install
npm run start
```
<!-- markdown-link-check-disable-next-line -->
The local website [http://localhost:3000/](http://localhost:3000/) should open in your browser.

## Contributions

All contributions are welcome. Feel free to open an issue or create a pull request.
