# Setup dan Deploy Backend + Frontend

## 🚀 Quick Start

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file dengan OpenAI API key Anda
npm run dev
```

### 2. Setup Frontend
```bash
# Di root directory
npm install
npm start
```

### 3. Docker Compose (Recommended)
```bash
# Build dan run semua services
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend: http://localhost:3001
# Health check: http://localhost:3001/health
```

## 🔧 Configuration

### Backend Environment (.env)
```bash
OPENAI_API_KEY=sk-your-actual-openai-api-key
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Frontend Environment (.env)
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_DEFAULT_MODEL=gpt-3.5-turbo
VITE_DEFAULT_SYSTEM_PROMPT=You are a helpful assistant.
```

## 🚀 Deploy ke Coolify

### Option 1: Monorepo Deploy
1. Push seluruh project ke Git
2. Di Coolify, create application dari Git repo
3. Set build context ke root directory
4. Coolify akan detect docker-compose.yml

### Option 2: Separate Deploy
**Backend:**
1. Create new application di Coolify
2. Set build context ke `/backend`
3. Set environment variables di Coolify dashboard
4. Deploy

**Frontend:**
1. Create new application di Coolify  
2. Set build context ke root directory
3. Set `VITE_API_BASE_URL` ke backend URL
4. Deploy

## 🔒 Security Features

✅ **API Key tersembunyi** - Hanya ada di backend
✅ **CORS protection** - Hanya frontend yang diizinkan
✅ **Rate limiting** - 100 requests per hour per IP
✅ **Error handling** - Proper error messages
✅ **Health checks** - Monitoring endpoint

## 📁 Project Structure
```
chatbot-apps/
├── backend/           # Express.js API server
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   ├── Dockerfile     # Backend container
│   └── .env           # Backend secrets
├── src/               # React frontend
├── Dockerfile         # Frontend container
├── docker-compose.yml # Full stack setup
└── .env               # Frontend config
```

## 🛠️ API Endpoints

- `POST /api/chat` - Chat completions
- `GET /api/models` - Available models
- `GET /health` - Health check
