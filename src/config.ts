// Configuration - API key will be managed by user input
export const OPENAI_DEFAULT_MODEL: string = import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo';
export const OPENAI_DEFAULT_SYSTEM_PROMPT: string = import.meta.env.VITE_DEFAULT_SYSTEM_PROMPT || 'You are a helpful assistant.';

// API key will be retrieved from localStorage
export const getApiKey = (): string => {
  return localStorage.getItem('openai_api_key') || '';
};
