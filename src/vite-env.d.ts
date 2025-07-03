/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_MODEL: string
  readonly VITE_DEFAULT_SYSTEM_PROMPT: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
