import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-supabase-url' && supabaseAnonKey !== 'your-supabase-anon-key') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
  }
} else {
  console.warn('⚠️  Supabase not configured. Authentication will be disabled.');
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting (simple in-memory store)
const requestCounts = new Map();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

// Rate limiting middleware
const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(clientIP)) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  const clientData = requestCounts.get(clientIP);
  
  if (now > clientData.resetTime) {
    // Reset the count
    requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Try again later.',
      resetTime: new Date(clientData.resetTime).toISOString()
    });
  }
  
  clientData.count++;
  next();
};

// Supabase Auth Middleware
const authenticateSupabase = async (req, res, next) => {
  try {
    // Skip auth for health check
    if (req.path === '/health') {
      return next();
    }

    // If Supabase is not configured, skip auth (development mode)
    if (!supabase) {
      console.warn('⚠️  Skipping authentication - Supabase not configured');
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request for later use
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// OpenAI Chat Completions Proxy
app.post('/api/chat', authenticateSupabase, rateLimit, async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000, stream = false } = req.body;

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return res.status(response.status).json({ 
        error: error.error?.message || 'OpenAI API error' 
      });
    }

    // Handle streaming response
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

      // Handle the streaming response from OpenAI using Node.js streams
      response.body.on('data', (chunk) => {
        res.write(chunk);
      });

      response.body.on('end', () => {
        res.end();
      });

      response.body.on('error', (error) => {
        console.error('Stream error:', error);
        res.end();
      });
    } else {
      // Handle non-streaming response
      const data = await response.json();
      res.json(data);
    }

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available models
app.get('/api/models', authenticateSupabase, rateLimit, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter only chat models
    const chatModels = data.data
      .filter(model => model.id.includes('gpt'))
      .sort((a, b) => a.id.localeCompare(b.id));

    res.json({ data: chatModels });

  } catch (error) {
    console.error('Models API Error:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Text-to-Speech endpoint
app.post('/api/tts', authenticateSupabase, rateLimit, async (req, res) => {
  try {
    const { text, voice = 'alloy', model = 'tts-1', speed = 1.0 } = req.body;

    // Validate request
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 4096) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 4096 characters' });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Call OpenAI TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI TTS API Error:', error);
      return res.status(response.status).json({ 
        error: error.error?.message || 'TTS API error' 
      });
    }

    // Forward the audio stream
    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);

  } catch (error) {
    console.error('TTS Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Chat API: http://localhost:${PORT}/api/chat`);
});
