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

### Option 2: Docker Mode

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
