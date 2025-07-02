import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <img src="/UMBRA-logobig.png" alt="UMBRA Logo" className="w-48 h-auto mb-4" style={{maxWidth: '240px'}} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Login to SimplifyAI<br></br>Industry Chatbot</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
