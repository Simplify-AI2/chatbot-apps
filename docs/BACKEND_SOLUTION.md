# Simple Backend Proxy dengan Express.js

## Setup Backend
```bash
mkdir chatbot-backend
cd chatbot-backend
npm init -y
npm install express cors dotenv
npm install -D @types/node @types/express typescript nodemon
```

## server.js
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API key disimpan aman di backend
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});
```

## Frontend perubahan di ChatService.ts
```typescript
// Ganti endpoint dari OpenAI langsung ke backend Anda
const apiUrl = 'http://localhost:3001/api/chat'; // atau domain production
```
