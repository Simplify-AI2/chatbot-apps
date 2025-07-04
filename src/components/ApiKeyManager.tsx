import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    // Check if API key already stored in localStorage
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsSet(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsSet(true);
      onApiKeySet(apiKey);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSet(false);
    onApiKeySet('');
  };

  if (isSet) {
    return (
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-green-700">API Key is set</span>
          </div>
          <button
            onClick={handleClearApiKey}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Clear API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4 text-yellow-800">
        🔑 OpenAI API Key Required
      </h3>
      <p className="text-yellow-700 mb-4">
        To use this chatbot, please enter your OpenAI API Key. Your key will be stored locally in your browser and never sent to our servers.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim()}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save API Key
          </button>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
          >
            Get API Key
          </a>
        </div>
      </div>
      <div className="mt-4 text-xs text-yellow-600">
        💡 Your API key is stored locally in your browser and is never sent to our servers.
      </div>
    </div>
  );
};
