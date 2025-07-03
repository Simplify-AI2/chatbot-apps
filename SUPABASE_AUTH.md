# Supabase Authentication Setup

This project uses Supabase for authentication. Both frontend and backend need to be configured with Supabase credentials.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from the project settings
3. Set up authentication providers as needed

### 2. Configure Backend

Add the following environment variables to your backend `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Configure Frontend

Add the following environment variables to your frontend `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## How It Works

### Frontend
- Users authenticate using Supabase Auth (sign up/sign in)
- The frontend obtains a JWT token from Supabase
- This token is sent with every API request to the backend in the `Authorization` header

### Backend
- All API endpoints (except `/health`) require authentication
- The backend verifies the JWT token with Supabase
- Only authenticated requests are processed

## Security Features

1. **JWT Token Verification**: Every API request is validated against Supabase
2. **Rate Limiting**: Prevents abuse with request limits per IP
3. **CORS Protection**: Only allows requests from configured origins
4. **OpenAI API Key Protection**: API keys are never exposed to the frontend

## Testing Authentication

1. Start both frontend and backend servers
2. Try to access the chat without logging in - it should fail
3. Sign up/sign in through the frontend
4. The chat should work normally after authentication

## Error Handling

The system handles various authentication errors:
- Missing token (401 Unauthorized)
- Invalid token (401 Unauthorized)
- Expired token (401 Unauthorized)
- Supabase configuration errors (500 Internal Server Error)

## Production Deployment

When deploying to production:
1. Set the real Supabase URL and keys in your environment variables
2. Configure `FRONTEND_URL` in the backend to match your production domain
3. Enable proper CORS settings in your deployment platform
